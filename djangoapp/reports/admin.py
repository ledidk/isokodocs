from django.contrib import admin
from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    """Admin interface for Report model."""
    
    list_display = ['document', 'reported_by', 'reason', 'status', 
                    'reviewed_by', 'created_at']
    list_filter = ['status', 'reason', 'created_at']
    search_fields = ['document__title', 'reported_by__username', 'description']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Report Details', {
            'fields': ('document', 'reported_by', 'reason', 'description')
        }),
        ('Moderation', {
            'fields': ('status', 'reviewed_by', 'reviewed_at', 'moderator_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'document', 'reported_by', 'reviewed_by'
        )
