from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.utils import timezone
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

from .serializers import RegisterSerializer, UserSerializer, BanUserSerializer
from .permissions import IsModerator

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    
    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST'))
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class LoginView(TokenObtainPairView):
    """
    API endpoint for user login (JWT token generation).
    Rate limited to prevent brute force attacks.
    """
    
    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST'))
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for viewing and updating user profile.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for moderators to view and manage users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsModerator]
    
    @action(detail=True, methods=['post'], url_path='ban')
    def ban_user(self, request, pk=None):
        """Ban a user from uploading documents."""
        user = self.get_object()
        
        if user.is_staff or user.is_superuser:
            return Response(
                {'error': 'Cannot ban staff or superuser accounts.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = BanUserSerializer(data=request.data)
        if serializer.is_valid():
            user.is_banned = True
            user.banned_reason = serializer.validated_data['reason']
            user.banned_at = timezone.now()
            user.save()
            
            return Response({
                'message': f'User {user.username} has been banned.',
                'user': UserSerializer(user).data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='unban')
    def unban_user(self, request, pk=None):
        """Unban a user."""
        user = self.get_object()
        
        user.is_banned = False
        user.banned_reason = ''
        user.banned_at = None
        user.save()
        
        return Response({
            'message': f'User {user.username} has been unbanned.',
            'user': UserSerializer(user).data
        })
