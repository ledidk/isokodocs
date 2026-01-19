from rest_framework import serializers
from django.conf import settings
from .models import Document
from djangoapp.categories.serializers import CategoryListSerializer


class DocumentListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for document lists."""
    category = CategoryListSerializer(read_only=True)
    uploaded_by_username = serializers.CharField(source='uploaded_by.username', read_only=True)
    tag_list = serializers.ReadOnlyField()
    
    class Meta:
        model = Document
        fields = [
            'id', 'title', 'slug', 'description', 'category',
            'language', 'tag_list', 'status', 'uploaded_by_username',
            'view_count', 'download_count', 'created_at'
        ]


class DocumentDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single document view."""
    category = CategoryListSerializer(read_only=True)
    uploaded_by_username = serializers.CharField(source='uploaded_by.username', read_only=True)
    reviewed_by_username = serializers.CharField(source='reviewed_by.username', read_only=True, allow_null=True)
    tag_list = serializers.ReadOnlyField()
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id', 'title', 'slug', 'description', 'category',
            'language', 'tags', 'tag_list', 'file', 'file_url', 'file_size',
            'license', 'license_details', 'status', 'uploaded_by_username',
            'reviewed_by_username', 'reviewed_at', 'rejection_reason',
            'view_count', 'download_count', 'created_at', 'updated_at'
        ]
    
    def get_file_url(self, obj):
        """Get absolute URL for file."""
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class DocumentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating documents."""
    category_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Document
        fields = [
            'title', 'description', 'category_id', 'language',
            'tags', 'file', 'license', 'license_details'
        ]
    
    def validate_file(self, value):
        """Validate file size and type."""
        if value.size > settings.MAX_UPLOAD_SIZE:
            max_size_mb = settings.MAX_UPLOAD_SIZE / (1024 * 1024)
            raise serializers.ValidationError(
                f'File size cannot exceed {max_size_mb}MB.'
            )
        
        if value.content_type not in settings.ALLOWED_DOCUMENT_TYPES:
            raise serializers.ValidationError(
                'Only PDF files are allowed.'
            )
        
        return value
    
    def validate_category_id(self, value):
        """Validate category exists."""
        from djangoapp.categories.models import Category
        if not Category.objects.filter(id=value).exists():
            raise serializers.ValidationError('Invalid category.')
        return value
    
    def create(self, validated_data):
        """Create document with uploaded_by set to current user."""
        category_id = validated_data.pop('category_id')
        from djangoapp.categories.models import Category
        category = Category.objects.get(id=category_id)
        
        document = Document.objects.create(
            category=category,
            uploaded_by=self.context['request'].user,
            status='pending',  # Always pending by default
            **validated_data
        )
        return document


class DocumentUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating documents (moderators only)."""
    
    class Meta:
        model = Document
        fields = ['title', 'description', 'language', 'tags', 'license', 'license_details']


class DocumentApprovalSerializer(serializers.Serializer):
    """Serializer for approving/rejecting documents."""
    action = serializers.ChoiceField(choices=['approve', 'reject'], required=True)
    rejection_reason = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        if attrs['action'] == 'reject' and not attrs.get('rejection_reason'):
            raise serializers.ValidationError({
                'rejection_reason': 'Rejection reason is required when rejecting a document.'
            })
        return attrs
