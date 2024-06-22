from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    avatar = models.ImageField(null=True, default='avatar.svg')
    age = models.CharField(max_length=50, null=True)
    experienceLevel = models.CharField(max_length=50, null=True)
    height = models.CharField(max_length=50, null=True)
    heightUnit = models.CharField(max_length=50, null=True)
    weight = models.CharField(max_length=50, null=True)
    weightUnit = models.CharField(max_length=50, null=True)
    medications = models.TextField(null=True)
    allergies = models.TextField(null=True)
    injuries = models.TextField(null=True)
    fitnessGoals = ArrayField(models.CharField(max_length=100), blank=True, null=True)
    healthConditions = ArrayField(models.CharField(max_length=100), blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']


class Exercise(models.Model):
    name = models.CharField(null=True, max_length=60)
    reps = models.IntegerField(null=True)
    sets = models.IntegerField(null=True)

class Meal(models.Model):
    meal_type = models.CharField(null=True, max_length=60)
    description = models.TextField(null=True)

class DailyWorkout(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    day = models.CharField(max_length=10)
    workout = models.ManyToManyField(Exercise, related_name='daily_workout')
    meals = models.ManyToManyField(Meal, related_name='daily_workout')
    class Meta:
        unique_together = ['user', 'day']


class WeeklyWorkout(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    daily_workouts = models.ManyToManyField(DailyWorkout, related_name='weekly_workouts')
