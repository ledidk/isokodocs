from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    """Serializer for Report model."""
    reported_by_username = serializers.CharField(source='reported_by.username', read_only=True)
    reviewed_by_username = serializers.CharField(source='reviewed_by.username', read_only=True, allow_null=True)
    document_title = serializers.CharField(source='document.title', read_only=True)
    document_slug = serializers.CharField(source='document.slug', read_only=True)
    
    class Meta:
        model = Report
        fields = [
            'id', 'document', 'document_title', 'document_slug',
            'reported_by_username', 'reason', 'description',
            'status', 'reviewed_by_username', 'reviewed_at',
            'moderator_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'reported_by_username', 'status', 'reviewed_by_username',
            'reviewed_at', 'moderator_notes', 'created_at', 'updated_at'
        ]


class ReportCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating reports."""
    document_slug = serializers.SlugField(write_only=True)
    
    class Meta:
        model = Report
        fields = ['document_slug', 'reason', 'description', 'status']
        read_only_fields = ['status']
    
    def validate_document_slug(self, value):
        """Validate document exists."""
        from djangoapp.documents.models import Document
        try:
            document = Document.objects.get(slug=value)
            return document
        except Document.DoesNotExist:
            raise serializers.ValidationError('Document not found.')
    
    def validate(self, attrs):
        """Check if user already reported this document."""
        document = attrs['document_slug']
        user = self.context['request'].user
        
        if Report.objects.filter(document=document, reported_by=user).exists():
            raise serializers.ValidationError(
                'You have already reported this document.'
            )
        
        return attrs
    
    def create(self, validated_data):
        """Create report with reported_by set to current user."""
        document = validated_data.pop('document_slug')
        
        report = Report.objects.create(
            document=document,
            reported_by=self.context['request'].user,
            **validated_data
        )
        return report


class ReportUpdateSerializer(serializers.Serializer):
    """Serializer for updating report status (moderators only)."""
    status = serializers.ChoiceField(
        choices=['reviewed', 'resolved', 'dismissed'],
        required=True
    )
    moderator_notes = serializers.CharField(required=False, allow_blank=True)
