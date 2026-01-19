from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import DocumentViewSet

router = DefaultRouter()
router.register(r'documents', DocumentViewSet, basename='document')

urlpatterns = [
    path('', include(router.urls)),
    # Additional endpoints for approval
    path('documents/<int:pk>/approve/', DocumentViewSet.as_view({'post': 'approve_reject'}), name='document-approve'),
    path('documents/<int:pk>/reject/', DocumentViewSet.as_view({'post': 'approve_reject'}), name='document-reject'),
]
