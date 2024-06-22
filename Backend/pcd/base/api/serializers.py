from rest_framework import serializers
from ..models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['name', 'reps', 'sets']

class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['meal_type', 'description']

class DailyWorkoutSerializer(serializers.ModelSerializer):
    workout = ExerciseSerializer(many=True)
    meals = MealSerializer(many=True)

    class Meta:
        model = DailyWorkout
        fields = ['day', 'workout', 'meals']

class WeeklyWorkoutSerializer(serializers.ModelSerializer):
    daily_workouts = DailyWorkoutSerializer(many=True)

    class Meta:
        model = WeeklyWorkout
        fields = ['daily_workouts']
