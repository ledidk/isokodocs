from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for custom User model."""
    
    list_display = ['username', 'email', 'first_name', 'last_name', 
                    'is_staff', 'is_banned', 'date_joined']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'is_banned', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Moderation', {
            'fields': ('is_banned', 'banned_reason', 'banned_at'),
        }),
    )
    
    readonly_fields = ['date_joined', 'last_login', 'banned_at']
