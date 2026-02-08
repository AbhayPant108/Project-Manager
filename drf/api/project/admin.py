from django.contrib import admin
from .models import User,Project,Task

# Register your models here.
admin.register(User)
admin.register(Project)
admin.register(Task)