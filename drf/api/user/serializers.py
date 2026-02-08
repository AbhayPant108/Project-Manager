from .models import User,UserProfile,FriendRequest
from rest_framework import serializers,status
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueTogetherValidator

# For Registering user
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email','password','is_verified']
        extra_kwargs = {
            'password':{
                'write_only':True
            }
        }
    def validate_username(self, value:str):
        if value:
            normalized_value = value.strip()
            if User.objects.filter(username = normalized_value).exists():
                raise ValidationError('User with this username already exists.')
            return normalized_value
        return value
    
    # overriding create to hash password on saving
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
class VerifyCodeSerializer(serializers.Serializer):
    verifyCode = serializers.RegexField(
        trim_whitespace=True,
        required=True,
        regex=r'^[0-9]+$',
        min_length=6,
        max_length=6,
        error_messages={
            'invalid':'Verify code is invalid',
            'max_length':'Code is too long (must be 6 digits)',
            'min_length':'Code is too long (must be 6 digits)'
        })

# For displaying users in a list
class UsersListSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField(read_only=True)
    avatar_url = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id','username','full_name','avatar_url','date_joined']
        read_only_fields = ['username','date_joined','id']
    def get_full_name(self,obj):
        if not hasattr(obj,'profile'): 
            return ''
        return obj.profile.full_name
    def get_avatar_url(self,obj):
        if not hasattr(obj,'profile'): 
            return ''
        return obj.profile.avatar_url
    

# For user obj,(optional)
class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.ReadOnlyField(source='profile.avatar_url',default='')
    full_name = serializers.ReadOnlyField(source='profile.username')
    class Meta:
       model = User
       fields = ['id','username','full_name','avatar_url']

# For user Profile (own)

class UserProfileSerializer(serializers.ModelSerializer):
    total_projects = serializers.IntegerField()
    total_tasks = serializers.IntegerField()
    friends_count = serializers.IntegerField()
    username = serializers.CharField(source='user.username')
    date_joined = serializers.CharField(source='user.date_joined')
    class Meta:
        model = UserProfile
        fields = [
                'id',
                'first_name',
                'last_name',
                'phone_number',
                'avatar_url',
                'created_at',
                'updated_at',
                'full_name',
                'bio',
                'username',
                'total_projects',
                'total_tasks',
                'friends_count',
                'date_joined'
                ]
        read_only = ['id','created_at','updated_at','full_name','username','total_projects','total_tasks','friends_count','date_joined']
   
class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    class Meta:
        model = FriendRequest
        fields = '__all__'
        read_only_fields = ['id','from_user','date_send','status']
       
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.context.get('request').user
        target_user = data.get('to_user')

        # POST validation (only authenticated)
        if user == target_user:
            raise ValidationError(detail='You cannot send a request to yourself.',code=400)
        if FriendRequest.objects.filter(from_user = user,to_user = target_user,status = 'PENDING').exists():
        
            raise ValidationError(detail='Already sent request to the user.',code=400)
        return data
        # UPDATE validation (only authenticated and recipient)
        # if self.instance:
        #     if target_user == self.instance.to_user:\
        #     raise ValidationError(detail='You cannot change the recipient.',code=400)
        # 
        # else:
        


