from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(CustomUser)
admin.site.register(Exercise)
admin.site.register(Meal)
admin.site.register(DailyWorkout)
admin.site.register(WeeklyWorkout)