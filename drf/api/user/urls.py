from django.urls import include,path
from .views import UsersViewset,UserAuthViewset,FriendRequestsViewSet,DashBoardViewSet
from rest_framework_nested import routers
from rest_framework_simplejwt.views import TokenRefreshView,TokenObtainPairView

router = routers.DefaultRouter()
router.register(r'auth',UserAuthViewset,basename='app-user')
router.register(r'users',UsersViewset,basename='app-users')
router.register(r'dashboard',DashBoardViewSet,basename='dashboard')
router.register(r'friend-requests',FriendRequestsViewSet,basename='freiend-requests')

urlpatterns = [
    path('',include(router.urls)),
    path('auth/login/',TokenObtainPairView.as_view(),name='access-token'),
    path('auth/token/refresh/',TokenRefreshView.as_view(),name='refresh-token'),
    path('auth/token/verify/',TokenRefreshView.as_view(),name='verify-token')
    
]