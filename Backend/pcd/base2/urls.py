from django.urls import path
from .views import *

urlpatterns = [
    path('exercise_analysis/<str:day>/<str:index>/', exercise_analysis, name='start_workout'),
    path('video_feed/', video_feed, name='video_feed'),

]