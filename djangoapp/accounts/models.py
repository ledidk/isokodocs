from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    Adds fields for moderation and banning functionality.
    """
    is_banned = models.BooleanField(
        default=False,
        help_text='Designates whether this user has been banned from uploading.'
    )
    banned_reason = models.TextField(
        blank=True,
        help_text='Reason for banning this user.'
    )
    banned_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Date and time when user was banned.'
    )
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.username
    
    @property
    def is_moderator(self):
        """Check if user is a moderator (staff or in moderators group)."""
        return self.is_staff or self.groups.filter(name='moderators').exists()
