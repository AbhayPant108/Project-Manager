from rest_framework import viewsets,mixins
from django.db.models import Q,Count
from rest_framework.permissions import IsAuthenticated,AllowAny
from .permissions import IsRecipientOnly,IsSenderOnly,IsOwnerOnly
from utils.api_response import ApiResponse
from rest_framework import status
from .models import User,FriendRequest,UserProfile
from rest_framework.response import Response
from api.project.models import Project
from api.project.serializers import ProjectsListSerialize,MyTasksSerializer
from .serializers import UserSerializer,FriendRequestSerializer,VerifyCodeSerializer,UserProfileSerializer,UsersListSerializer,RegisterSerializer
from rest_framework.decorators import action

# Create your views here
# TODO: change ModelViewset to genericviewset
class UserAuthViewset(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [IsAuthenticated]

    def get_serializer_class(self, *args, **kwargs):
        serializers_dict = {
            'register':RegisterSerializer,
            'verifyCode':VerifyCodeSerializer
        }
        return serializers_dict.get(RegisterSerializer,UserSerializer)
        
    @action(detail=False,methods=['POST'],permission_classes=[AllowAny],url_path='register')
    def register(self,request,*args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return ApiResponse(
                message="User registered successfully.",
                data=serializer.data,
                status=status.HTTP_201_CREATED
                )

    @action(detail=False,methods='POST',url_path='verify-code')
    def verifyCode(self):
        data = self.request.data
        serializer = self.get_serializer(data = data)
        serializer.is_valid(raise_exception=True)
        pass  # send email logic             

class DashBoardViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self,request):
        user = self.request.user
        queryset = Project.objects.filter(Q(owner = user)|Q(members = user))
        data = {
            'name':user.profile.full_name if hasattr(user,'profile') and user.profile else user.username,
            'stats':{
                'active_projects':queryset.distinct().count(),
                'pending_tasks':user.my_tasks.filter(Q(status='INCOMPLETE')|Q(status = 'IN_PROGRESS')).count(),
                'completed_tasks':user.my_tasks.filter(status = 'COMPLETED').count()
            },
            'projects':ProjectsListSerialize(queryset.annotate(
                members_count = Count('members',distinct=True),
                task_completed = Count('tasks',filter=Q(tasks__status = 'COMPLETED'),distinct=True),
                tasks_count = Count('tasks',distinct=True),
                ).distinct()[:3],many=True).data,
            'tasks':MyTasksSerializer(user.my_tasks.all()[:5],many=True).data,
        }
        return ApiResponse(
            data=data,
            message="Successful",
            status=200
        )
# A Viewset for users, their profiles (including my_profile)
class UsersViewset(viewsets.GenericViewSet,mixins.ListModelMixin):

    def get_queryset(self):
        queryset_dict = {
            'list':User.objects.select_related('profile'),
            'my_profile':UserProfile.objects.filter(user = self.request.user).select_related('user'),
            'profile':UserProfile.objects.select_related('user')
        }
        return queryset_dict.get(self.action,User.objects.all())
    def get_permissions(self):
        actions_dict = {
            'list':[],
            'my_profile':[IsOwnerOnly],
            'user_profile':[]
        }
        self.permission_classes =[IsAuthenticated] + actions_dict.get(self.action,[])
        return super().get_permissions()
    # Serializer for 'action' types
    def get_serializer_class(self):
        serializers_dict = {
            'list':UsersListSerializer,
            'my_profile':UserProfileSerializer,
            'user_profile':UserProfileSerializer,
        }
        return serializers_dict.get(self.action,UserSerializer)
    
    def list(self, request, *args, **kwargs):
        search_name = self.request.query_params.get('search-name')
        queryset = self.get_queryset()
        if search_name:
            queryset = queryset.filter(
                Q(username__icontains = search_name)|
                Q(profile__first_name__icontains = search_name)|
                Q(profile__last_name__icontains = search_name)
            ).distinct()
        serializer = self.get_serializer(queryset,many=True)
        return ApiResponse(
            data=serializer.data,
            message='All users fetched.',
            status=200
        )
        
    

    # action for 'GET','POST','PATCH' for my profile
    @action(detail=False,methods=['GET','PATCH','POST',],url_path='me')
    def my_profile(self,request,*args, **kwargs):
        # 1 get user and his profile
        user = request.user
        profile = self.get_queryset().filter(user = user).select_related('user').annotate(
            total_projects = Count('user__owned_projects',distinct=True),
            total_tasks = Count('user__my_tasks',distinct=True),
            friends_count = Count('user__requests_got',filter=Q(user__requests_got__status = 'ACCEPTED'),distinct=True)
            ).first()
        
        # 2 handle GET
        if request.method == 'GET':
            if not profile:
                return ApiResponse(
                    message='Profile does not exist',
                    status=status.HTTP_404_NOT_FOUND
                    )
            serialize = self.get_serializer(profile)
            return ApiResponse(
                message="Fetched user profile.",
                status=status.HTTP_200_OK,
                data=serialize.data
                )
            

        # 3 handle POST
        elif request.method == 'POST':
            if profile:
                return ApiResponse(
                    message='Profile already exist',
                    status=status.HTTP_400_BAD_REQUEST
                    )
            serialize = self.get_serializer(data=request.data)
            serialize.is_valid(raise_exception=True)
            serialize.save(user=user)
            return ApiResponse(
                message="Profile created Successfully.",
                status=status.HTTP_200_OK,
                data=serialize.data
                )
        
        # 4 handle PATCH
        serialize = self.get_serializer(profile,data=request.data,partial =True)
        serialize.is_valid(raise_exception=True)
        serialize.save(user = user)
        return ApiResponse(
                message="Profile Updated Successfully.",
                status=status.HTTP_200_OK,
                data=serialize.data
                )

    # action for getting user profile details by user's 'id' (ReadOnly fields)
    @action(detail=True,methods=['GET'],url_path='profile')
    def profile(self,request,pk=None):
        profile = self.get_queryset().filter(user = pk).select_related('user').annotate(
            total_projects = Count('user__owned_projects',distinct=True),
            total_tasks = Count('user__my_tasks',distinct=True),
            friends_count = Count('user__requests_got',filter=Q(user__requests_got__status = 'ACCEPTED'),distinct=True)
            ).first()
        if profile:
            serializer = self.get_serializer(profile)
            return ApiResponse(
                message='Fetched user successfully.',
                data=serializer.data,
                status=status.HTTP_200_OK
                )
        return ApiResponse(
            message='Profile does not exist.',
            status=status.HTTP_400_BAD_REQUEST
            )

class FriendRequestsViewSet(viewsets.ModelViewSet):
    serializer_class = FriendRequestSerializer 
    def get_queryset(self):
        user = self.request.user
        queryset = FriendRequest.objects.filter(Q(from_user = user)|Q(to_user = user))
        request_type = self.request.query_params.get('type')
        if self.action == 'list':
            if request_type == 'sent':
                queryset = queryset.filter(from_user = user)
            elif request_type == 'received':
                queryset = queryset.filter(to_user = user)
        elif self.action in ['accept_request','reject_request']:
            queryset = queryset.filter(to_user = user,status = 'PENDING')
        return queryset
    
    def perform_create(self, serializer):
        return serializer.save(from_user = self.request.user)
    def get_permissions(self):
        actions_dict = {
            'update':[IsRecipientOnly],
            'partial_update':[IsRecipientOnly],
            'destroy':[IsSenderOnly],
            'accept_request':[IsRecipientOnly]
        }
        self.permission_classes =[IsAuthenticated] + actions_dict.get(self.action,[])
        return super().get_permissions()

    @action(detail=True,methods=['POST'],url_path='accept')
    def accept_request(self,request,pk=None):
        instance = self.get_object()
        instance.status = 'ACCEPTED'
        instance.save()
        return ApiResponse(
            message='Friend Request Accepted.',
            status=200
        )
    @action(detail=True,methods=['POST'],url_path='reject')
    def reject_request(self,request,pk=None):
        instance = self.get_object()
        instance.status = 'REJECTED'
        instance.save()
        return ApiResponse(
            message='Friend Request Rejected.',
            status=200
        )


