import json

from django.db import transaction
from django.db.models import Q
from django.contrib.auth.hashers import make_password

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from ..models import *
from .serializers import *
from ..model_de_generation import utils
#------------------------------------------------------------------------------------#
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['age'] = user.age
        token['height'] = user.height
        token['heightUnit'] = user.heightUnit
        token['weight'] = user.weight
        token['weightUnit'] = user.weightUnit
        token['experienceLevel'] = user.experienceLevel
        token['fitnessGoals'] = user.fitnessGoals
        token['healthConditions'] = user.healthConditions
        
        return token
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
#------------------------------------------------------------------------------------#
@api_view(['POST'])
@permission_classes([AllowAny])
def UserRegister(request):    
    try:
        user = CustomUser.objects.create(
            username= request.data.get('username'),
            email= request.data.get('email'),
            password= make_password(request.data.get('password')),
            age= request.data.get('age'),
            experienceLevel= request.data.get('experienceLevel'),
            height= request.data.get('height'),
            heightUnit= request.data.get('heightUnit'),
            weight= request.data.get('weight'),
            weightUnit= request.data.get('weightUnit'),
            medications= request.data.get('medications'),
            allergies= request.data.get('allergies'),
            injuries= request.data.get('injuries'),
            fitnessGoals= request.data.get('fitnessGoals'),
            healthConditions = request.data.get('healthConditions')
        )
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#------------------------------------------------------------------------------------#
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def UserProfileUpdate(request):
    try:
        data = request.data
        if request.user is not None:
            user = request.user
            user.age = data['age']
            user.height = data['height']
            user.weight = data['weight']
            user.save()

            customPayload={
                    'username' : user.username,
                    'email' : user.email,
                    'age' : user.age,
                    'height' : user.height,
                    'heightUnit' : user.heightUnit,
                    'weight' : user.weight,
                    'weightUnit' : user.weightUnit,
                    'experienceLevel' : user.experienceLevel,
                    'fitnessGoals' : user.fitnessGoals,
                    'healthConditions' : user.healthConditions,
                }
            tokens = RefreshToken.for_user(user)
            tokens.payload.update(customPayload)
            refresh = str(tokens)
            access = str(tokens.access_token)
            token = {
                'refresh': refresh,
                'access': access,
            }
            return Response({'token': token}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': "you need to be logged in !"}, status=400)
    except CustomUser.DoesNotExist:
        return Response({'message': "User not found"}, status=404)
    
    except Exception as e:
        return Response({'message': str(e)}, status=500)
#------------------------------------------------------------------------------------#
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_weekly_workout(request):
    try:
        if request.user is not None:
            try:
                with transaction.atomic():
                    weekly_workout = WeeklyWorkout.objects.get(user=request.user)
                    serializer = WeeklyWorkoutSerializer(weekly_workout, many=False)
                    return Response(serializer.data)
            except:
                return Response({'message': "User doesn't have a weekly program yet"})
        else:
            return Response({'message': "User has to be logged in"}, status=400)            
    except CustomUser.DoesNotExist:
        return Response({'message': "User not found"}, status=404)
    except Exception as e:
        return Response({'message': str(e)}, status=500)
#------------------------------------------------------------------------------------#
@api_view(['POST','PUT'])
@permission_classes([AllowAny])
def workoutProgram(request):
    form_data = request.data
    user_id = form_data["user_id"]
    email = form_data["email"]
    try:
        response = utils.llmchain(form_data)
        response_string = response['text'].replace('\n', '').replace('    ', '')
        response_data = json.loads(response_string)

        if user_id is not None and email is not None:
            user = CustomUser.objects.get(Q(id=user_id) & Q(email=email))
            if request.method == 'PUT':
                user.experienceLevel = form_data['experienceLevel']
                user.fitnessGoals = form_data['fitnessGoals']
                user.medications = form_data['medications']
                user.allergies = form_data['allergies']
                user.injuries = form_data['injuries']
                user.healthConditions = form_data['healthConditions']
                user.save()

            weekly_program, weekly_program_created = WeeklyWorkout.objects.get_or_create(user=user)

            # Clear existing daily workouts and related exercises and meals
            if not weekly_program_created:
                for daily_workout in weekly_program.daily_workouts.all():
                    for exercise in daily_workout.workout.all():
                        exercise.delete()
                    for meal in daily_workout.meals.all():
                        meal.delete()
                    daily_workout.delete()

            # Iterate through the response data and update or create DailyWorkout instances
            for day_data in response_data['workout_program']:
                with transaction.atomic():
                    day = day_data['day']
                    exercises_data = day_data['workout']
                    meals_data = day_data['meals']
                    # Update or create DailyWorkout instance
                    daily_workout = DailyWorkout.objects.get_or_create(day=day, user=user)[0]
                    # Update or create Exercise instances and add to daily workout
                    if isinstance(exercises_data, list) and (len(exercises_data) > 1):
                        for exercise_data in exercises_data:
                            exercise = Exercise.objects.get_or_create(
                                name=exercise_data['exercise'],
                                reps=exercise_data['reps'],
                                sets=exercise_data['sets']
                            )[0]
                            daily_workout.workout.add(exercise)
                    else:
                        exercise = Exercise.objects.get_or_create(
                            name='Rest day',
                        )[0]
                        daily_workout.workout.add(exercise)
                    # Update or create Meal instances and add to daily workout
                    for meal_data in meals_data:
                        meal = Meal.objects.get_or_create(
                            meal_type=meal_data['meal_type'],
                            description=meal_data['description']
                        )[0]
                        daily_workout.meals.add(meal)
                    # Add daily workout to weekly program
                    weekly_program.daily_workouts.add(daily_workout)
            if request.method == 'PUT':
                customPayload={
                    'username' : user.username,
                    'email' : user.email,
                    'age' : user.age,
                    'height' : user.height,
                    'heightUnit' : user.heightUnit,
                    'weight' : user.weight,
                    'weightUnit' : user.weightUnit,
                    'experienceLevel' : user.experienceLevel,
                    'fitnessGoals' : user.fitnessGoals,
                    'healthConditions' : user.healthConditions,
                }
                tokens = RefreshToken.for_user(user)
                tokens.payload.update(customPayload)
                refresh = str(tokens)
                access = str(tokens.access_token)
                token = {
                    'refresh': refresh,
                    'access': access,
                }
                return Response({'token': token}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'User profile updated successfully'}, status=200)
            
        else:
            return Response({'message': "you need to be logged in !"}, status=400)
    
    except CustomUser.DoesNotExist:
        return Response({'message': "User not found"}, status=404)
    
    except Exception as e:
        return Response({'message': str(e)}, status=500)