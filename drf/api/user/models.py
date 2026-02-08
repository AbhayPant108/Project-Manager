from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.
class User(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    id = models.UUIDField(primary_key=True,unique=True,editable=False,default=uuid.uuid4)
    is_verified = models.BooleanField(blank=False,default=False)
    email = models.EmailField(blank=False,unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    verifyCode = models.IntegerField(blank=False,null=True)

    def save(self, *, force_insert = False, force_update = False, using = None, update_fields = None):
        if self.username:
            self.username:str = self.username.strip()
        return super().save(force_insert=force_insert, force_update=force_update, using=using, update_fields=update_fields)

class UserProfile(models.Model):
    id = models.UUIDField(primary_key=True,unique=True,editable=False,default=uuid.uuid4)
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name='profile')
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    phone_number = PhoneNumberField(unique=True)
    avatar = models.ImageField(upload_to='avatars/',blank=True,null = True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    bio = models.TextField(blank=True,default='',max_length=300)

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'
    @property
    def avatar_url(self):
        try:
            if self.avatar and hasattr(self.avatar,'url'):
                return self.avatar.url
        except ValueError:
            return ''
        return ''
    
        
    
class FriendRequest(models.Model):
    class Meta:
        unique_together = ('from_user','to_user')    

    class Status(models.TextChoices):
        PENDING = 'PENDING','Pending'
        ACCEPTED = 'ACCEPTED','Accepted'
        REJECTED = 'REJECTED','Rejected'
    id = models.UUIDField(primary_key=True,unique=True,editable=False,default=uuid.uuid4) 
    from_user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='requests_sent')
    to_user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='requests_got')
    date_send = models.DateTimeField(auto_now_add=True)
    status = models.CharField(choices=Status.choices,default='PENDING')
    
