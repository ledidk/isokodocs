from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Q
from django.utils import timezone
from django.http import FileResponse
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

from .models import Document
from .serializers import (
    DocumentListSerializer,
    DocumentDetailSerializer,
    DocumentCreateSerializer,
    DocumentUpdateSerializer,
    DocumentApprovalSerializer
)
from djangoapp.accounts.permissions import IsModerator, IsOwnerOrModerator


class DocumentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing and managing documents.
    
    List/Retrieve: Public (only approved documents visible to non-moderators)
    Create: Authenticated users (rate limited)
    Update/Delete: Owner or moderators
    Approve/Reject: Moderators only
    """
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['created_at', 'view_count', 'download_count', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Filter queryset based on user permissions.
        Non-moderators only see approved documents.
        """
        queryset = Document.objects.select_related('category', 'uploaded_by')
        
        # Moderators see all documents
        if self.request.user.is_authenticated and (
            self.request.user.is_staff or 
            self.request.user.groups.filter(name='moderators').exists()
        ):
            pass  # Return all documents
        else:
            # Non-moderators only see approved documents
            queryset = queryset.filter(status='approved')
        
        # Filter by category
        category_slug = self.request.query_params.get('category', None)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Filter by language
        language = self.request.query_params.get('language', None)
        if language:
            queryset = queryset.filter(language=language)
        
        # Filter by license
        license_type = self.request.query_params.get('license', None)
        if license_type:
            queryset = queryset.filter(license=license_type)
        
        # Filter by status (moderators only)
        status_filter = self.request.query_params.get('status', None)
        if status_filter and self.request.user.is_authenticated and (
            self.request.user.is_staff or 
            self.request.user.groups.filter(name='moderators').exists()
        ):
            queryset = queryset.filter(status=status_filter)
        
        # Filter by tags
        tags = self.request.query_params.get('tags', None)
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            q_objects = Q()
            for tag in tag_list:
                q_objects |= Q(tags__icontains=tag)
            queryset = queryset.filter(q_objects)
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'list':
            return DocumentListSerializer
        elif self.action == 'create':
            return DocumentCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return DocumentUpdateSerializer
        return DocumentDetailSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsOwnerOrModerator]
        elif self.action in ['approve_reject', 'pending_documents']:
            permission_classes = [IsModerator]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]
    
    @method_decorator(ratelimit(key='user', rate='10/h', method='POST'))
    def create(self, request, *args, **kwargs):
        """Create a new document (rate limited to 10 per hour)."""
        # Check if user is banned
        if request.user.is_banned:
            return Response(
                {'error': 'You are banned from uploading documents.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().create(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        """Retrieve document and increment view count."""
        instance = self.get_object()
        instance.increment_view_count()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], url_path='download')
    def download(self, request, slug=None):
        """Download document file and increment download count."""
        document = self.get_object()
        document.increment_download_count()
        
        if document.file:
            response = FileResponse(document.file.open('rb'), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{document.title}.pdf"'
            return response
        
        return Response(
            {'error': 'File not found.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    @action(detail=True, methods=['post'], url_path='approve-reject')
    def approve_reject(self, request, slug=None):
        """Approve or reject a document (moderators only)."""
        document = self.get_object()
        serializer = DocumentApprovalSerializer(data=request.data)
        
        if serializer.is_valid():
            action_type = serializer.validated_data['action']
            
            if action_type == 'approve':
                document.status = 'approved'
                document.reviewed_by = request.user
                document.reviewed_at = timezone.now()
                document.rejection_reason = ''
                document.save()
                
                return Response({
                    'message': 'Document approved successfully.',
                    'document': DocumentDetailSerializer(document, context={'request': request}).data
                })
            
            elif action_type == 'reject':
                document.status = 'rejected'
                document.reviewed_by = request.user
                document.reviewed_at = timezone.now()
                document.rejection_reason = serializer.validated_data.get('rejection_reason', '')
                document.save()
                
                return Response({
                    'message': 'Document rejected.',
                    'document': DocumentDetailSerializer(document, context={'request': request}).data
                })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='pending')
    def pending_documents(self, request):
        """Get all pending documents (moderators only)."""
        pending = Document.objects.filter(status='pending').select_related('category', 'uploaded_by')
        page = self.paginate_queryset(pending)
        
        if page is not None:
            serializer = DocumentListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = DocumentListSerializer(pending, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='my-documents')
    def my_documents(self, request):
        """Get current user's uploaded documents."""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        my_docs = Document.objects.filter(uploaded_by=request.user).select_related('category')
        page = self.paginate_queryset(my_docs)
        
        if page is not None:
            serializer = DocumentListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = DocumentListSerializer(my_docs, many=True, context={'request': request})
        return Response(serializer.data)
