from django.contrib import admin
from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    """Admin interface for Document model."""
    
    list_display = ['title', 'category', 'language', 'status', 'uploaded_by', 
                    'view_count', 'download_count', 'created_at']
    list_filter = ['status', 'language', 'category', 'license', 'created_at']
    search_fields = ['title', 'description', 'tags', 'uploaded_by__username']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['view_count', 'download_count', 'file_size', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description')
        }),
        ('Categorization', {
            'fields': ('category', 'language', 'tags')
        }),
        ('File', {
            'fields': ('file', 'file_size')
        }),
        ('License', {
            'fields': ('license', 'license_details')
        }),
        ('Moderation', {
            'fields': ('status', 'uploaded_by', 'reviewed_by', 'reviewed_at', 'rejection_reason')
        }),
        ('Statistics', {
            'fields': ('view_count', 'download_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('category', 'uploaded_by', 'reviewed_by')
