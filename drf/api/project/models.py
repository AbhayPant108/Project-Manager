from django.db import models
import uuid
from ..user.models import User
from django.utils.translation import gettext_lazy as _ # for human readable translations
# Create your models here.




class Project(models.Model):
    class Access(models.TextChoices):
        PRIVATE = 'PRIVATE','Private'
        PUBLIC = 'PUBLIC','Public'
        FRIENDS_ONLY = 'FRIENDS_ONLY','Friends only'
    class Status(models.TextChoices):
        INCOMPLETE = 'INCOMPLETE',_('Incomplete')
        IN_PROGRESS = 'IN_PROGRESS',_('In-Progress')
        COMPLETED = 'COMPLETED',_('Completed')
    
    id = models.UUIDField(primary_key=True,editable=False,default=uuid.uuid4,unique=True)
    title = models.CharField(max_length=50,blank=False)
    description = models.TextField(blank=True,default='')
    owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name='owned_projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    members = models.ManyToManyField(User,related_name='assigned_projects',blank=True,null=True)
    access = models.CharField(choices=Access.choices,default='PRIVATE')
    status = models.CharField(choices=Status.choices,default='INCOMPLETE')
    def __str__(self):
        return f'{self.title} - {self.owner.username}(owner)'
        

class Task(models.Model):
    # modern way of handling choices by class
    # Advabtage: Increase code flexiblity,Provide human readable outputs
    class Status(models.TextChoices):
        INCOMPLETE = 'INCOMPLETE',_('Incomplete')
        IN_PROGRESS = 'IN_PROGRESS',_('In-Progress')
        COMPLETED = 'COMPLETED',_('Completed')

    class Priority(models.TextChoices):
        LOW = 'LOW',_('Low')  # _() can convert in different languages
        HIGH = 'HIGH',_('High')
        MEDIUM = 'MEDIUM',_('Medium')

    id = models.UUIDField(primary_key=True,editable=False,default=uuid.uuid4,unique=True)
    project = models.ForeignKey(Project,on_delete=models.CASCADE,related_name='tasks')
    title = models.CharField(max_length=50,blank=False)
    description = models.TextField(blank=True,default='')
    assigned_to = models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True,related_name='my_tasks')
    status = models.CharField(choices=Status.choices,default='INCOMPLETE')
    priority = models.CharField(choices=Priority.choices)
    due_date = models.DateField(blank=True)

    

    def __str__(self):
        return f'Task: {self.title} assigned to {self.assigned_to.username}'
