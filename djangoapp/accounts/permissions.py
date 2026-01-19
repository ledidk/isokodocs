from rest_framework import permissions


class IsModerator(permissions.BasePermission):
    """
    Custom permission to only allow moderators (staff or in moderators group).
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_staff or request.user.groups.filter(name='moderators').exists())
        )


class IsOwnerOrModerator(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or moderators to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner or moderators
        is_moderator = (
            request.user.is_staff or 
            request.user.groups.filter(name='moderators').exists()
        )
        
        return obj.user == request.user or is_moderator
