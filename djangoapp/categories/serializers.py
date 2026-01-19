from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""
    document_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 
                  'order', 'document_count', 'created_at']
        read_only_fields = ['id', 'slug', 'created_at']


class CategoryListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for category lists."""
    document_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'document_count']
