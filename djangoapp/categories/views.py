from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Category
from .serializers import CategorySerializer, CategoryListSerializer
from djangoapp.accounts.permissions import IsModerator


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing and managing categories.
    List and retrieve are public, create/update/delete require moderator permissions.
    """
    queryset = Category.objects.all()
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CategoryListSerializer
        return CategorySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticatedOrReadOnly]
        else:
            permission_classes = [IsModerator]
        return [permission() for permission in permission_classes]
