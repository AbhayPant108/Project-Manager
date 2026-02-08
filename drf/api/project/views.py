from .serializers import Test,ProjectDetailsSerializer,ProjectTasksSerializer,ProjectsListSerialize
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from api.user.models import User
from django.db.models import Prefetch,Count,Q
from .models import Project,Task,models
from .permissions import IsProjectOwnerOrReadOnly
from rest_framework.decorators import action
from utils.api_response import ApiResponse



class ProjectViewSet(viewsets.ModelViewSet):
    '''
    A ViewSet for Project Model
    '''
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Project.objects.filter(
            Q(owner = self.request.user)|Q(members = self.request.user)
            )
        if self.action == 'list':    
            owned = self.request.query_params.get('owned') == 'true'
            updated = self.request.query_params.get('updated') == 'true'
            
            if owned and updated:
                queryset = queryset.filter(owner = self.request.user)
                queryset.order_by('-updated_at')
            elif owned:
                queryset = queryset.filter(owner = self.request.user)
            elif updated:
                queryset = queryset.order_by('-updated_at')
            return queryset.annotate(
                members_count = Count('members',distinct=True),
                task_completed = Count('tasks',filter=Q(tasks__status = 'COMPLETED'),distinct=True),
                tasks_count = Count('tasks',distinct=True),
                )
        elif self.action == 'retrieve':
            return queryset.select_related('owner__profile').prefetch_related('members__profile').distinct()
        return queryset
    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)
    def get_serializer_class(self):
        serializer_dict = {
            'list':ProjectsListSerialize,
            'tasks':ProjectTasksSerializer,
            'retrieve':ProjectDetailsSerializer
        }
        return serializer_dict.get(self.action,ProjectDetailsSerializer)
    def retrieve(self, request, *args, **kwargs):
        data = self.get_object()
        serializer = self.get_serializer(data)
        return ApiResponse(
            data=serializer.data,
            message='Project Detail fetched',
            status=200
        )
    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        serializer = self.get_serializer(data,many=True)
        return ApiResponse(
            data=serializer.data,
            message='All Projects Fetched',
            status=200
        )
        
    @action(methods=['GET','POST'],detail=True,url_path='tasks',permission_classes=[IsProjectOwnerOrReadOnly])
    def tasks(self,request,pk=None):
        if self.request.method == 'POST':
            serializer = self.get_serializer(data=self.request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(project_id = pk)
            return ApiResponse(
                message='Task Added Successfully.',
                status=200
            )
        project_tasks = Task.objects.filter(project_id = pk).select_related('assigned_to__profile')
        data = {
            'tasks_count':project_tasks.count(),
            'tasks_list':self.get_serializer(project_tasks,many=True).data,
            'tasks_completed':project_tasks.filter(status = 'COMPLETED').count()
        }
        return ApiResponse(
           data=data,
           message='Project Tasks Fetched',
           status=200
       )

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectTasksSerializer
    permission_classes = [IsAuthenticated,IsProjectOwnerOrReadOnly]
    

    # queryset include tasks of the projects that have owner = user and user in members
    # simple terms: set of all tasks of user's project and assigned to user projects
    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(
            models.Q(project__owner=user)|models.Q(assigned_to = user)
        ).select_related('project').distinct()
        
    
        

    
class ViewAllProjects(viewsets.ModelViewSet):
    queryset =Project.objects.all()
    serializer_class = Test
