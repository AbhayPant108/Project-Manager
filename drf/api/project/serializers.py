from rest_framework import serializers
from .models import Project,Task
from api.user.models import User,UserProfile
from django.db.models import Q




class MemberMiniSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='profile.full_name')
    avatar = serializers.CharField(source='profile.avatar')
    class Meta:
        model = User
        fields = ['id','username','full_name','avatar']

class MemberProfileSerailizer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    class Meta:
        model = UserProfile
        fields = [
            'id',
            'full_name',  
            'phone_number' , 
            'avatar'  ,
            'created_at' , 
            'user' ,
            ]
class MembersDetailsSerializer(serializers.ModelSerializer):
    profile = MemberProfileSerailizer(read_only=True)
    class Meta:
        model = User
        fields = ['id','username','profile']


class ProjectDetailsSerializer(serializers.ModelSerializer):
    members = MemberMiniSerializer(many=True,read_only=True)
    created_at = serializers.DateTimeField(format='%d-%m-%Y',read_only=True)
    owner = MemberMiniSerializer(read_only=True)
    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'description',
            'members',
            'created_at',
            'owner',
            'status',
            'access'
            ]
class Test(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id']  

class ProjectsListSerialize(serializers.ModelSerializer):
    # tasks = serializers.PrimaryKeyRelatedField(many = True,read_only = True)
    members_count = serializers.IntegerField(read_only=True)
    tasks_count = serializers.IntegerField(read_only=True)
    tasks_completed = serializers.IntegerField(read_only=True,default=0)
    owner = MemberMiniSerializer(read_only=True)
    created_at = serializers.DateTimeField(format='%d-%m-%Y')
    updated_at = serializers.DateTimeField(format='%d-%m-%Y')

    class Meta:
        model = Project
        fields = ['id','title','description','members_count','tasks_count','tasks_completed',
                  'created_at','updated_at','access','status','owner']
        read_only_fields = ['id','title','description','members_count','tasks_count','tasks_completed',
                  'created_at','updated_at','access','status','owner']
        
    # def get_members_list(self, obj):
    #     members= []
    #     for member in obj.members.all():
    #         if hasattr(member,'profile'):
    #             members.append({
    #                 'full_name':member.profile.full_name,
    #                 'avatar':member.profile.avatar.url if member.profile.avatar else None
    #             })
    #         else:
    #             members.append({
    #                 'full_name': member.username,
    #                 'avatar': None,}) # can change to '' if needed
    #     return members


       
class MyTasksSerializer(serializers.ModelSerializer):
    class ProjectMiniSerializer(serializers.ModelSerializer):
        class Meta:
            model = Project
            fields = ['id','title','description']

    
    class Meta(serializers.SerializerMetaclass):
        model = Task
        fields = ['id','title','priority','due_date','status']        
class ProjectTasksSerializer(serializers.ModelSerializer):
    user = MemberMiniSerializer(source='assigned_to',read_only=True)
    assigned_to = serializers.PrimaryKeyRelatedField(
            queryset = User.objects.all(),
            required = False,
            allow_null = True,
            write_only = True
    )
    due_date = serializers.DateField(format="%d-%m-%Y",input_formats=["%d-%m-%Y","%Y-%m-%d"])
    class Meta:
        model = Task
        fields = ['id','title','status','priority','due_date','assigned_to','user']
             