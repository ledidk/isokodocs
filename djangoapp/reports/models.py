from django.db import models
from django.conf import settings


class Report(models.Model):
    """
    Report model for users to report problematic documents.
    """
    REASON_CHOICES = [
        ('copyright', 'Copyright Violation'),
        ('spam', 'Spam or Misleading'),
        ('personal_info', 'Contains Personal Information'),
        ('inappropriate', 'Inappropriate Content'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('reviewed', 'Reviewed'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed'),
    ]
    
    # Report Details
    document = models.ForeignKey(
        'documents.Document',
        on_delete=models.CASCADE,
        related_name='reports'
    )
    reported_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reports_made'
    )
    reason = models.CharField(max_length=20, choices=REASON_CHOICES)
    description = models.TextField(help_text='Detailed description of the issue')
    
    # Moderation
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reports_reviewed'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    moderator_notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reports'
        verbose_name = 'Report'
        verbose_name_plural = 'Reports'
        ordering = ['-created_at']
        unique_together = ['document', 'reported_by']  # One report per user per document
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['document', 'status']),
        ]
    
    def __str__(self):
        return f"Report on '{self.document.title}' by {self.reported_by.username}"
