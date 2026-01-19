from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator
from slugify import slugify
import os


def document_upload_path(instance, filename):
    """Generate upload path for documents."""
    ext = filename.split('.')[-1]
    filename = f"{instance.slug}.{ext}"
    return os.path.join('documents', filename)


class Document(models.Model):
    """
    Document model for storing uploaded files.
    """
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('fr', 'French'),
    ]
    
    LICENSE_CHOICES = [
        ('cc0', 'CC0 - Public Domain'),
        ('cc-by', 'CC BY - Attribution'),
        ('cc-by-sa', 'CC BY-SA - Attribution-ShareAlike'),
        ('cc-by-nd', 'CC BY-ND - Attribution-NoDerivs'),
        ('cc-by-nc', 'CC BY-NC - Attribution-NonCommercial'),
        ('cc-by-nc-sa', 'CC BY-NC-SA - Attribution-NonCommercial-ShareAlike'),
        ('cc-by-nc-nd', 'CC BY-NC-ND - Attribution-NonCommercial-NoDerivs'),
        ('other', 'Other'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    
    # Categorization
    category = models.ForeignKey(
        'categories.Category',
        on_delete=models.PROTECT,
        related_name='documents'
    )
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='en')
    tags = models.CharField(
        max_length=255,
        blank=True,
        help_text='Comma-separated tags'
    )
    
    # File
    file = models.FileField(
        upload_to=document_upload_path,
        validators=[FileExtensionValidator(allowed_extensions=['pdf'])]
    )
    file_size = models.BigIntegerField(default=0, help_text='File size in bytes')
    
    # License
    license = models.CharField(max_length=20, choices=LICENSE_CHOICES, default='cc-by')
    license_details = models.TextField(
        blank=True,
        help_text='Additional license information'
    )
    
    # Moderation
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='uploaded_documents'
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_documents'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    # Counters
    view_count = models.IntegerField(default=0)
    download_count = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'documents'
        verbose_name = 'Document'
        verbose_name_plural = 'Documents'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['slug']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Document.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        
        # Set file size if file exists
        if self.file:
            self.file_size = self.file.size
        
        super().save(*args, **kwargs)
    
    def increment_view_count(self):
        """Increment view counter."""
        self.view_count += 1
        self.save(update_fields=['view_count'])
    
    def increment_download_count(self):
        """Increment download counter."""
        self.download_count += 1
        self.save(update_fields=['download_count'])
    
    @property
    def is_approved(self):
        """Check if document is approved."""
        return self.status == 'approved'
    
    @property
    def tag_list(self):
        """Return tags as a list."""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',') if tag.strip()]
        return []
