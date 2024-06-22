from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user_register/', UserRegister, name='user_register'),
    path('user_weekly_workout/', user_weekly_workout, name='user_weekly_workout'),
    path('create_program/', workoutProgram, name='user_weekly_workout'),
    path('user_profile_update/', UserProfileUpdate, name='user_profile_update'),
]