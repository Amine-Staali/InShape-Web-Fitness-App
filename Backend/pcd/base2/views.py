import importlib
import json
import jwt

import cv2

from django.http import HttpResponse, StreamingHttpResponse, HttpResponseServerError
from django.shortcuts import render
from django.db.models import Q

from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from base.models import *
from base.api.serializers import *
from .models import *
from .serializers import *
#------------------------------------------------------------------------------------#
@permission_classes([IsAuthenticated])
def exercise_analysis(request, day = "0", index = "0"):
    day = int(day)
    index = int(index)
    token = request.GET.get('q')

    try:
        userInfos = jwt.decode(token, options={"verify_signature": False})
        user_id = userInfos.get('user_id')
        email = userInfos.get('email')
        user = CustomUser.objects.get(Q(id= user_id) & Q(email= email))
        weekly_workout = WeeklyWorkout.objects.get(user = user)
        serializer = WeeklyWorkoutSerializer(weekly_workout, many=False)
        program = serializer.data
        selected_exercise = program["daily_workouts"][day]["workout"][index]
        if(index == (len(program["daily_workouts"][day]["workout"]) - 1)):
            return render(request, 'base2/exercise_analysis.html', {"program": json.dumps(program), "selected_exercise": json.dumps(selected_exercise), "day" : day, "index" : index, "mode": user.experienceLevel, "token": token, "workout_status":"stop"})
        else:
            return render(request, 'base2/exercise_analysis.html', {"program": json.dumps(program), "selected_exercise": json.dumps(selected_exercise), "day" : day, "index" : index, "mode": user.experienceLevel, "token": token, "workout_status":"continue"})
    except Exception as e:
        return HttpResponse(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#------------------------------------------------------------------------------------#
def video_frame_generator(live_process_frame, pose):
    cap = cv2.VideoCapture(0)  
    while True:
        ret, frame = cap.read()
        if not ret: 
            break  
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame, _ = live_process_frame.process(frame, pose)
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        _, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
    cap.release()
#------------------------------------------------------------------------------------#
Exercises = {
    "squat": "squat",
    "pushup" : "push_up",
    "situp" : "sit_ups",
    "superman pull down": "superman_pull_back",
    "bicep curl" : "bicep_curl",
    "bench dip" : "tricep_bench",
    "kettlebell swing" : "ketbell_swing"
}
#------------------------------------------------------------------------------------#
def video_feed(request):
    mode = request.GET.get('mode')
    selected_exercise = json.loads(request.GET.get('selected_exercise'))
    for exercises_key in Exercises.keys():
        if selected_exercise["name"].lower() in exercises_key :
            exercise = Exercises[exercises_key]
            break
    utils_module = None
    thresholds = None
    thresholds_module = None
    process_module = None
    pose = None
    p_module_name = "base2.exercises." + exercise + ".process_frame"
    process_module = importlib.import_module(p_module_name)
    try:
        t_module_name = "base2.exercises." + exercise + ".thresholds"
        u_module_name = "base2.exercises." + exercise + ".utils"
        thresholds_module = importlib.import_module(t_module_name)
        process_module = importlib.import_module(p_module_name)
        utils_module = importlib.import_module(u_module_name)
        print(process_module)
        if mode.lower() in 'beginner':
            thresholds = thresholds_module.get_thresholds_beginner()
        elif mode.lower() in 'Pro':
            thresholds = thresholds_module.get_thresholds_pro()
    except (ImportError, AttributeError) as e:
        return HttpResponseServerError(f"Error loading module: {e}")
    try:
        live_process_frame = process_module.ProcessFrame(thresholds=thresholds, flip_frame=True,sets=selected_exercise["sets"],reps=selected_exercise["reps"])
        pose = utils_module.get_mediapipe_pose()
    except (ImportError, AttributeError) as e:
        return HttpResponseServerError(f"Error initializing process frame: {e}")
    
    def generator_wrapper():
        for frame_data in video_frame_generator(live_process_frame, pose):
            #provoke the event listener in js, the camera continues to work normally
            yield frame_data

    response = StreamingHttpResponse(generator_wrapper(), content_type='multipart/x-mixed-replace; boundary=frame')

    return response