from django.urls import path,include
from rest_framework_nested import routers
from api.project.views import ProjectViewSet,TaskViewSet,ViewAllProjects


router = routers.DefaultRouter()
router.register(r'projects',ProjectViewSet,basename='user-projects')
router.register(r'tasks',TaskViewSet,basename='users-tasks')
router.register(r'test',ViewAllProjects,basename='project-tasks')





urlpatterns = [
    path('',include(router.urls)),
]
