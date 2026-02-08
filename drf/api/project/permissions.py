from rest_framework import permissions
from .models import Project

class IsProjectOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # 1. Allow any authenticated user to view the list (GET)
        if request.method in permissions.SAFE_METHODS: # GET, HEAD, OPTIONS
            return request.user.is_authenticated

        # 2. To POST (create), check if the user owns the project provided in request body
        if request.method == 'POST':
            
            project_id = view.kwargs.get('pk')
            print(project_id)
            return Project.objects.filter(id=project_id, owner=request.user).exists()
        
        return True

    def has_object_permission(self, request, view, obj):
        # 3. Members can VIEW a specific task (GET /tasks/1/)
        if request.method in permissions.SAFE_METHODS:
            return True

        # 4. Only the PROJECT owner can UPDATE or DELETE a specific task
        return obj.project.owner == request.user