from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import Report
from .serializers import (
    ReportSerializer,
    ReportCreateSerializer,
    ReportUpdateSerializer
)
from djangoapp.accounts.permissions import IsModerator


class ReportViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing and managing reports.
    
    Create: Authenticated users
    List/Retrieve/Update: Moderators only
    """
    queryset = Report.objects.select_related('document', 'reported_by', 'reviewed_by')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReportCreateSerializer
        return ReportSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'my_reports']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsModerator]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Filter queryset based on query parameters."""
        queryset = super().get_queryset()
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by reason
        reason = self.request.query_params.get('reason', None)
        if reason:
            queryset = queryset.filter(reason=reason)
        
        return queryset
    
    @action(detail=True, methods=['post'], url_path='update-status')
    def update_status(self, request, pk=None):
        """Update report status (moderators only)."""
        report = self.get_object()
        serializer = ReportUpdateSerializer(data=request.data)
        
        if serializer.is_valid():
            report.status = serializer.validated_data['status']
            report.moderator_notes = serializer.validated_data.get('moderator_notes', '')
            report.reviewed_by = request.user
            report.reviewed_at = timezone.now()
            report.save()
            
            return Response({
                'message': 'Report status updated successfully.',
                'report': ReportSerializer(report).data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='pending')
    def pending_reports(self, request):
        """Get all pending reports (moderators only)."""
        pending = Report.objects.filter(status='pending').select_related(
            'document', 'reported_by'
        )
        page = self.paginate_queryset(pending)
        
        if page is not None:
            serializer = ReportSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ReportSerializer(pending, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='my-reports')
    def my_reports(self, request):
        """Get current user's reports."""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        my_reports = Report.objects.filter(reported_by=request.user).select_related('document')
        page = self.paginate_queryset(my_reports)
        
        if page is not None:
            serializer = ReportSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ReportSerializer(my_reports, many=True)
        return Response(serializer.data)
