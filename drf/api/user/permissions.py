
from rest_framework import permissions

class IsRecipientOnly(permissions.BasePermission):
    # Both sender and recipient can get 
    # Only recipient of user can update 
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.to_user == request.user or obj.from_user == request.user
        
        return obj.to_user == request.user

class IsSenderOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.from_user
    
    
class IsOwnerOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user