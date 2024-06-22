import time
import cv2
import numpy as np
import random
from  .utils import find_angle, get_landmark_features, draw_text, draw_dotted_line
class ProcessFrame:
    def __init__(self, thresholds, flip_frame = False,sets=3,reps=10):
        
        # Set if frame should be flipped or not.
        self.flip_frame = flip_frame
        self.completion_message = f""
        self.motivational_message=f""
        self.sets=sets
        self.reps=reps
        self.frame_index=0
        self.rest=False
        self.rest_timer_start=0
        self.rest_time=60
        self.rest_timer=0
        # self.thresholds
        self.thresholds = thresholds

        # Font type.
        self.font = cv2.FONT_HERSHEY_SIMPLEX

        # line type
        self.linetype = cv2.LINE_AA

        # set radius to draw arc
        self.radius = 20

        # Colors in BGR format.
        self.COLORS = {
                        'blue'       : (0, 127, 255),
                        'red'        : (255, 50, 50),
                        'green'      : (0, 255, 127),
                        'light_green': (100, 233, 127),
                        'yellow'     : (255, 255, 0),
                        'magenta'    : (255, 0, 255),
                        'white'      : (255,255,255),
                        'cyan'       : (0, 255, 255),
                        'light_blue' : (102, 204, 255)
                      }


 
        # Dictionary to maintain the various landmark features.
        self.dict_features = {}
        self.left_features = {
                                'shoulder': 11,
                                'elbow'   : 13,
                                'wrist'   : 15,                    
                                'hip'     : 23,
                                'knee'    : 25,
                                'ankle'   : 27,
                                'foot'    : 31
                             }

        self.right_features = {
                                'shoulder': 12,
                                'elbow'   : 14,
                                'wrist'   : 16,
                                'hip'     : 24,
                                'knee'    : 26,
                                'ankle'   : 28,
                                'foot'    : 32
                              }

        self.dict_features['left'] = self.left_features
        self.dict_features['right'] = self.right_features
        self.dict_features['nose'] = 0

        
        # For tracking counters and sharing states in and out of callbacks.
        self.state_tracker = {
            'state_seq': [],

            'start_inactive_time': time.perf_counter(),
            'start_inactive_time_front': time.perf_counter(),
            'INACTIVE_TIME': 0.0,
            'INACTIVE_TIME_FRONT': 0.0,

            # 0 --> Elbows Pointed Out, 1 --> Correct your hips
            'DISPLAY_TEXT' : np.full((2,), False),
            'COUNT_FRAMES' : np.zeros((2,), dtype=np.int64),

            #'LOWER_HIPS': False,
            'PULL_BACK': False,

            #'INCORRECT_POSTURE': False,
            'CORRECT_YOUR_HIPS': False,

            'prev_state': None,
            'curr_state':None,

            #'''SQUAT_COUNT': 0,
            #'IMPROPER_SQUAT':0
            'PULL_COUNT':0,
            'IMPROPER_PULL':0,
            'CURRENT_SET':0,

            
        }
        
        self.FEEDBACK_ID_MAP = {
                                0: ('Elbows Pointed Out', 215, (0, 153, 255)),
                                1: ('Correct your hips', 125, (255, 80, 80)),
                                #2: ('KNEE FALLING OVER TOE', 170, (255, 80, 80)),
                                #3: ('SQUAT TOO DEEP', 125, (255, 80, 80))
                               }
    def _get_state(self, elbow_angle):
        
        elbow = None        

        if self.thresholds['SHOULDER_ELBOW_WRIST']['NORMAL'][0] <= elbow_angle <= self.thresholds['SHOULDER_ELBOW_WRIST']['NORMAL'][1]:
            elbow = 1
        elif self.thresholds['SHOULDER_ELBOW_WRIST']['TRANS'][0] <= elbow_angle <= self.thresholds['SHOULDER_ELBOW_WRIST']['TRANS'][1]:
            elbow = 2
        elif self.thresholds['SHOULDER_ELBOW_WRIST']['PASS'][0] <= elbow_angle <= self.thresholds['SHOULDER_ELBOW_WRIST']['PASS'][1]:
            elbow = 3

        return f's{elbow}' if elbow else None
    def _update_state_sequence(self, state):

        if state == 's2':
            if (('s3' not in self.state_tracker['state_seq']) and (self.state_tracker['state_seq'].count('s2'))==0) or \
                    (('s3' in self.state_tracker['state_seq']) and (self.state_tracker['state_seq'].count('s2')==1)):
                        self.state_tracker['state_seq'].append(state)
            

        elif state == 's3':
            if (state not in self.state_tracker['state_seq']) and 's2' in self.state_tracker['state_seq']: 
                self.state_tracker['state_seq'].append(state)
    def _show_feedback(self, frame, c_frame, dict_maps, pull_back):


        if pull_back:
            draw_text(
                frame, 
                'PULL_BACK', 
                pos=(30, 80),
                text_color=(0, 0, 0),
                font_scale=0.6,  # Increase the font scale to make the text larger
                text_color_bg=(255, 255, 0)
            )

        for idx in np.where(c_frame)[0]:
            draw_text(
                    frame, 
                    dict_maps[idx][0], 
                    pos=(30, dict_maps[idx][1]),
                    text_color=(255, 255, 230),
                    font_scale=0.6,
                    text_color_bg=dict_maps[idx][2]
                )

        return frame
    def process(self, frame: np.array, pose):
        play_sound = None
       
        self.frame_index+=1
        motivational_strings = [
                "Great job! Keep up the good work!",
                "You're doing fantastic! Keep pushing!",
                "Amazing effort! You're getting stronger!",
                "You're unstoppable! Keep going!",
                "You're crushing it! Keep that momentum!",
                "Incredible work! You're on fire!",
                "Wow! You're making incredible progress!",
                "You're a star! Keep shining bright!",
                "You're a champion! Keep striving for greatness!",
                "Fantastic work! You're inspiring!",
                # Add more motivational strings as needed
            ]
        frame_height, frame_width, _ = frame.shape

        # Process the image.
        keypoints = pose.process(frame)

        if keypoints.pose_landmarks:
            ps_lm = keypoints.pose_landmarks

            nose_coord = get_landmark_features(ps_lm.landmark, self.dict_features, 'nose', frame_width, frame_height)
            left_shldr_coord, left_elbow_coord, left_wrist_coord, left_hip_coord, left_knee_coord, left_ankle_coord, left_foot_coord = \
                                get_landmark_features(ps_lm.landmark, self.dict_features, 'left', frame_width, frame_height)
            right_shldr_coord, right_elbow_coord, right_wrist_coord, right_hip_coord, right_knee_coord, right_ankle_coord, right_foot_coord = \
                                get_landmark_features(ps_lm.landmark, self.dict_features, 'right', frame_width, frame_height)

            offset_angle = find_angle(left_shldr_coord, right_shldr_coord, nose_coord)

            if offset_angle > self.thresholds['OFFSET_THRESH']:
                
                display_inactivity = False

                end_time = time.perf_counter()
                self.state_tracker['INACTIVE_TIME_FRONT'] += end_time - self.state_tracker['start_inactive_time_front']
                self.state_tracker['start_inactive_time_front'] = end_time

                if self.state_tracker['INACTIVE_TIME_FRONT'] >= self.thresholds['INACTIVE_THRESH']:
                    self.state_tracker['PULL_COUNT'] = 0
                    self.state_tracker['IMPROPER_PULL'] = 0
                    display_inactivity = True

                cv2.circle(frame, nose_coord, 7, self.COLORS['white'], -1)
                cv2.circle(frame, left_shldr_coord, 7, self.COLORS['yellow'], -1)
                cv2.circle(frame, right_shldr_coord, 7, self.COLORS['magenta'], -1)

                if self.flip_frame:
                    frame = cv2.flip(frame, 1)

                if display_inactivity:
                    # cv2.putText(frame, 'Resetting SQUAT_COUNT due to inactivity!!!', (10, frame_height - 90), 
                    #             self.font, 0.5, self.COLORS['blue'], 2, lineType=self.linetype)
                    play_sound = 'reset_counters'
                    self.state_tracker['INACTIVE_TIME_FRONT'] = 0.0
                    self.state_tracker['start_inactive_time_front'] = time.perf_counter()

                draw_text(
                    frame, 
                    "CORRECT: " + str(self.state_tracker['PULL_COUNT']), 
                    pos=(int(frame_width*0.68), 30),
                    text_color=(255, 255, 230),
                    font_scale=0.6,
                    text_color_bg=(18, 185, 0)
                ) 
                draw_text(
                    frame,
                    f"SETS COMPLETED: {self.state_tracker['CURRENT_SET']}/{self.sets}",
                    pos=(int(frame_width * 0.55), 130),
                    text_color=(255, 255, 230),
                    font_scale=0.7,
                    text_color_bg=(0, 153, 153)
                ) 
                

                draw_text(
                    frame, 
                    "INCORRECT: " + str(self.state_tracker['IMPROPER_PULL']), 
                    pos=(int(frame_width*0.68), 80),
                    text_color=(255, 255, 230),
                    font_scale=0.6,
                    text_color_bg=(221, 0, 0),
                    
                )  
                
                
                draw_text(
                    frame, 
                    'CAMERA NOT ALIGNED PROPERLY!!!', 
                    pos=(30, frame_height-60),
                    text_color=(255, 255, 230),
                    font_scale=0.6,
                    text_color_bg=(255, 153, 0),
                ) 
                
                
                draw_text(
                    frame, 
                    'OFFSET ANGLE: '+str(offset_angle), 
                    pos=(30, frame_height-30),
                    text_color=(255, 255, 230),
                    font_scale=0.6,
                    text_color_bg=(255, 153, 0),
                ) 

                # Reset inactive times for side view.
                self.state_tracker['start_inactive_time'] = time.perf_counter()
                self.state_tracker['INACTIVE_TIME'] = 0.0
                self.state_tracker['prev_state'] =  None
                self.state_tracker['curr_state'] = None
            
            # Camera is aligned properly.
            else:

                self.state_tracker['INACTIVE_TIME_FRONT'] = 0.0
                self.state_tracker['start_inactive_time_front'] = time.perf_counter()


                dist_l_sh_hip = abs(left_elbow_coord[1]- left_wrist_coord[1])
                dist_r_sh_hip = abs(right_elbow_coord[1] - right_wrist_coord)[1]

                shldr_coord = None
                elbow_coord = None
                wrist_coord = None
                hip_coord = None
                knee_coord = None
                ankle_coord = None
                foot_coord = None

                if dist_l_sh_hip > dist_r_sh_hip:
                    shldr_coord = left_shldr_coord
                    elbow_coord = left_elbow_coord
                    wrist_coord = left_wrist_coord
                    hip_coord = left_hip_coord
                    knee_coord = left_knee_coord
                    ankle_coord = left_ankle_coord
                    foot_coord = left_foot_coord

                    multiplier = -1
                                     
                
                else:
                    shldr_coord = right_shldr_coord
                    elbow_coord = right_elbow_coord
                    wrist_coord = right_wrist_coord
                    hip_coord = right_hip_coord
                    knee_coord = right_knee_coord
                    ankle_coord = right_ankle_coord
                    foot_coord = right_foot_coord

                    multiplier = 1
                    

                # ------------------- Verical Angle calculation --------------
                     #go low:s1-->s2 shoulder_elbow_vert in[0,35]
                #go deeper:s2-->s3    shoulder_elbow_vert in[40,80]
                #elbows_pointed_out: shoulder_elbow_vert<10 and knee_ankle_vert>60
                #hip_mistake:shoulder_hip_knee <170
                
                elbow_vertical_angle = find_angle(shldr_coord, np.array([elbow_coord[0], 0]),elbow_coord)
                cv2.ellipse(frame, elbow_coord, (30, 30), 
                            angle = 0, startAngle = -90, endAngle = -90+multiplier*elbow_vertical_angle, 
                            color = self.COLORS['white'], thickness = 3, lineType = self.linetype)

                draw_dotted_line(frame, elbow_coord, start=elbow_coord[1]-80, end=elbow_coord[1]+20, line_color=self.COLORS['blue'])




                print(f'shldr:+ {shldr_coord}')
                print(f'elbow:+ {elbow_coord}')
                print(f'wrist:+{wrist_coord}')

                shoulder_hip_knee = find_angle(shldr_coord,knee_coord, hip_coord)
                print("shoulderhipknee:"+str(shoulder_hip_knee))
                cv2.ellipse(frame, hip_coord, (20, 20), 
                            angle = 0, startAngle = 180-find_angle(shldr_coord,np.array([0,hip_coord[1]]),hip_coord),
                            endAngle = 180-find_angle(shldr_coord,np.array([0,hip_coord[1]]),hip_coord)-multiplier*shoulder_hip_knee, 
                            color = self.COLORS['white'], thickness = 3,  lineType = self.linetype)

                #draw_dotted_line(frame, knee_coord, start=knee_coord[1]-50, end=knee_coord[1]+20, line_color=self.COLORS['blue'])



                shoulder_elbow_wrist = find_angle(wrist_coord, shldr_coord, elbow_coord)
                print("shoulderelbowwrist:"+str(shoulder_elbow_wrist))
                '''cv2.ellipse(frame, ankle_coord, (30, 30),
                            angle = 0, startAngle = -90, endAngle = -90 + multiplier*ankle_vertical_angle,
                            color = self.COLORS['white'], thickness = 3,  lineType=self.linetype)

                draw_dotted_line(frame, ankle_coord, start=ankle_coord[1]-50, end=ankle_coord[1]+20, line_color=self.COLORS['blue'])'''

                # ------------------------------------------------------------
        
                
                # Join landmarks.
                cv2.line(frame, shldr_coord, elbow_coord, self.COLORS['light_blue'], 4, lineType=self.linetype)
                cv2.line(frame, wrist_coord, elbow_coord, self.COLORS['light_blue'], 4, lineType=self.linetype)
                cv2.line(frame, shldr_coord, hip_coord, self.COLORS['light_blue'], 4, lineType=self.linetype)
                cv2.line(frame, knee_coord, hip_coord, self.COLORS['light_blue'], 4,  lineType=self.linetype)
                cv2.line(frame, ankle_coord, knee_coord,self.COLORS['light_blue'], 4,  lineType=self.linetype)
                cv2.line(frame, ankle_coord, foot_coord, self.COLORS['light_blue'], 4,  lineType=self.linetype)
                
                # Plot landmark points
                cv2.circle(frame, shldr_coord, 7, self.COLORS['yellow'], -1,  lineType=self.linetype)
                cv2.circle(frame, elbow_coord, 7, self.COLORS['yellow'], -1,  lineType=self.linetype)
                cv2.circle(frame, wrist_coord, 7, self.COLORS['yellow'], -1,  lineType=self.linetype)
                cv2.circle(frame, hip_coord, 7, self.COLORS['yellow'], -1,  lineType=self.linetype)
                cv2.circle(frame, knee_coord, 7, self.COLORS['yellow'], -1,  lineType=self.linetype)
                cv2.circle(frame, ankle_coord, 7, self.COLORS['yellow'], -1,  lineType=self.linetype)
                cv2.circle(frame, foot_coord, 7, self.COLORS['yellow'], -1,  lineType=self.linetype)

                

                current_state = self._get_state(int(shoulder_elbow_wrist))
                print(f'current state {current_state}')
                self.state_tracker['curr_state'] = current_state
                self._update_state_sequence(current_state)



                # -------------------------------------- COMPUTE COUNTERS --------------------------------------
                print(self.state_tracker['state_seq'])
                print("shoulderelbowwrist:"+str(shoulder_elbow_wrist))
                if current_state == 's1':
                    print(self.state_tracker['CORRECT_YOUR_HIPS'])
                    if len(self.state_tracker['state_seq']) == 3 and not self.state_tracker['CORRECT_YOUR_HIPS']:
                        self.state_tracker['PULL_COUNT']+=1
                        #play_sound = str(self.state_tracker['SITUP_COUNT'])
                        
                    

                    elif self.state_tracker['CORRECT_YOUR_HIPS']:
                        self.state_tracker['IMPROPER_PULL']+=1
                        play_sound = 'incorrect'
                    '''elif 's2' in self.state_tracker['state_seq'] and len(self.state_tracker['state_seq'])==1:
                        self.state_tracker['IMPROPER_PULL']+=1
                        #play_sound = 'incorrect'''
                        
                    
                    self.state_tracker['state_seq'] = []
                    self.state_tracker['CORRECT_YOUR_HIPS'] = False


                # ----------------------------------------------------------------------------------------------------




                # -------------------------------------- PERFORM FEEDBACK ACTIONS --------------------------------------
                else:                    

                    #elbows_pointed_out: shoulder_elbow_vert<10 and knee_ankle_vert>60
                    #print(f'anklevert{ankle_vertical_angle} and thresh {self.thresholds["KNEE_ANKLE_VERT"]}')
                    '''if elbow_vertical_angle < self.thresholds['ELBOW_THRESH'] and ankle_vertical_angle>self.thresholds['KNEE_ANKLE_VERT'] :
                        self.state_tracker['DISPLAY_TEXT'][0] = True
                        self.state_tracker['ELBOWS_POINTED_OUT'] = True'''

                    #hip_mistake:shoulder_hip_knee< 170
                        
                    '''if (shoulder_hip_knee < self.thresholds['SHOULDER_HIP_KNEE']):
                        self.state_tracker['DISPLAY_TEXT'][1] = True
                        self.state_tracker['CORRECT_YOUR_HIPS'] = True'''


                # ----------------------------------------------------------------------------------------------------


                
                
                # ----------------------------------- COMPUTE INACTIVITY ---------------------------------------------

                display_inactivity = False
                
                if self.state_tracker['curr_state'] == self.state_tracker['prev_state']:

                    end_time = time.perf_counter()
                    self.state_tracker['INACTIVE_TIME'] += end_time - self.state_tracker['start_inactive_time']
                    self.state_tracker['start_inactive_time'] = end_time

                    if self.state_tracker['INACTIVE_TIME'] >= self.thresholds['INACTIVE_THRESH']:
                        self.state_tracker['PULL_COUNT'] = 0
                        self.state_tracker['IMPROPER_PULL'] = 0
                        display_inactivity = True

                
                else:
                    
                    self.state_tracker['start_inactive_time'] = time.perf_counter()
                    self.state_tracker['INACTIVE_TIME'] = 0.0

                # -------------------------------------------------------------------------------------------------------
              


                elbow_text_coord_x = elbow_coord[0] + 10
                hip_text_coord_x = hip_coord[0] + 15
                ankle_text_coord_x = ankle_coord[0] + 10

                if self.flip_frame:
                    frame = cv2.flip(frame, 1)
                    elbow_text_coord_x = frame_width - elbow_coord[0] + 10
                    hip_text_coord_x = frame_width - hip_coord[0] + 15
                    ankle_text_coord_x = frame_width - ankle_coord[0] + 10

                
                
                if ('s2' in self.state_tracker['state_seq'] ) or (current_state == 's1'and not 's2' in self.state_tracker['state_seq'] ):
                    self.state_tracker['PULL_BACK'] = False

                '''if 's3' in self.state_tracker['state_seq'] or (current_state == 's2'  and not 's3' in self.state_tracker['state_seq']):
                    self.state_tracker['GO_DEEPER'] = False'''

                self.state_tracker['COUNT_FRAMES'][self.state_tracker['DISPLAY_TEXT']]+=1

                frame = self._show_feedback(frame, self.state_tracker['COUNT_FRAMES'], self.FEEDBACK_ID_MAP,self.state_tracker['PULL_BACK'])




                if display_inactivity:
                    # cv2.putText(frame, 'Resetting COUNTERS due to inactivity!!!', (10, frame_height - 20), self.font, 0.5, self.COLORS['blue'], 2, lineType=self.linetype)
                    play_sound = 'reset_counters'
                    self.state_tracker['start_inactive_time'] = time.perf_counter()
                    self.state_tracker['INACTIVE_TIME'] = 0.0

                
                cv2.putText(frame, str(int(shoulder_hip_knee)), (hip_text_coord_x, hip_coord[1]), self.font, 1, self.COLORS['light_green'], 2, lineType=self.linetype)
                #cv2.putText(frame, str(int(elbow_vertical_angle)), (elbow_text_coord_x, elbow_coord[1]+10), self.font, 1, self.COLORS['light_green'], 2, lineType=self.linetype)
                #cv2.putText(frame, str(int(ankle_vertical_angle)), (ankle_text_coord_x, ankle_coord[1]), self.font, 1, self.COLORS['light_green'], 2, lineType=self.linetype)

                 
                draw_text(
                    frame, 
                    "CORRECT: " + str(self.state_tracker['PULL_COUNT']), 
                    pos=(int(frame_width*0.68), 30),
                    text_color=(255, 255, 230),
                    font_scale=0.6,  # Increase the font scale to make the text larger
                    text_color_bg=(18, 185, 0)
                )
                draw_text(
                    frame,
                    f"SETS COMPLETED: {self.state_tracker['CURRENT_SET']}/{self.sets}",
                    pos=(int(frame_width * 0.55), 130),
                    text_color=(255, 255, 230),
                    font_scale=0.7,
                    text_color_bg=(0, 153, 153)
                )
                draw_text(
                    frame, 
                    "INCORRECT: " + str(self.state_tracker['IMPROPER_PULL']), 
                    pos=(int(frame_width*0.68), 80),
                    text_color=(255, 255, 230),
                    font_scale=0.6,  # Increase the font scale to make the text larger
                    text_color_bg=(221, 0, 0),
                )
  
                
                
                self.state_tracker['DISPLAY_TEXT'][self.state_tracker['COUNT_FRAMES'] > self.thresholds['CNT_FRAME_THRESH']] = False
                self.state_tracker['COUNT_FRAMES'][self.state_tracker['COUNT_FRAMES'] > self.thresholds['CNT_FRAME_THRESH']] = 0    
                self.state_tracker['prev_state'] = current_state
                                  

       
        
        else:

            if self.flip_frame:
                frame = cv2.flip(frame, 1)

            end_time = time.perf_counter()
            self.state_tracker['INACTIVE_TIME'] += end_time - self.state_tracker['start_inactive_time']

            display_inactivity = False

            if self.state_tracker['INACTIVE_TIME'] >= self.thresholds['INACTIVE_THRESH']:
                self.state_tracker['PULL_COUNT'] = 0
                self.state_tracker['IMPROPER_PULL'] = 0
                display_inactivity = True

            self.state_tracker['start_inactive_time'] = end_time

            draw_text(
                    frame, 
                    "CORRECT: " + str(self.state_tracker['PULL_COUNT']), 
                    pos=(int(frame_width*0.68), 30),
                    text_color=(255, 255, 230),
                    font_scale=0.6,
                    text_color_bg=(18, 185, 0)
                )  
            draw_text(
                    frame,
                    f"SETS COMPLETED: {self.state_tracker['CURRENT_SET']}/{self.sets}",
                    pos=(int(frame_width * 0.55), 130),
                    text_color=(255, 255, 230),
                    font_scale=0.7,
                    text_color_bg=(0, 153, 153)
                )
                

            draw_text(
                    frame, 
                    "INCORRECT: " + str(self.state_tracker['IMPROPER_PULL']), 
                    pos=(int(frame_width*0.68), 80),
                    text_color=(255, 255, 230),
                    font_scale=0.6,
                    text_color_bg=(221, 0, 0),
                    
                )  

            if display_inactivity:
                play_sound = 'reset_counters'
                self.state_tracker['start_inactive_time'] = time.perf_counter()
                self.state_tracker['INACTIVE_TIME'] = 0.0
            
            
            # Reset all other state variables
            
            self.state_tracker['prev_state'] =  None
            self.state_tracker['curr_state'] = None
            self.state_tracker['INACTIVE_TIME_FRONT'] = 0.0
            self.state_tracker['ELBOWS_POINTED_OUT'] = False
            self.state_tracker['CORRECT_YOUR_HIPS'] = False
            self.state_tracker['DISPLAY_TEXT'] = np.full((2,), False)
            self.state_tracker['COUNT_FRAMES'] = np.zeros((2,), dtype=np.int64)
            self.state_tracker['start_inactive_time_front'] = time.perf_counter()
        if self.reps == self.state_tracker['PULL_COUNT']:
            display_duration = 60  

            if 'completion_message_frame' not in self.state_tracker:
                self.rest=True
                self.rest_timer_start = time.time()
                self.state_tracker['completion_message_frame'] = self.frame_index
                self.motivational_message = random.choice(motivational_strings)
                self.completion_message = f"SET {self.state_tracker['CURRENT_SET']+1} COMPLETED!"
            else:
                # Check if the display duration has not elapsed
                if(self.frame_index-self.state_tracker['completion_message_frame']<display_duration):
                    draw_text(
                        frame,
                        self.completion_message,
                        pos=(20, 30),  # Adjusted position for upper left corner
                        text_color=(255, 255, 255),  # White text color
                        font_scale=0.7,
                        text_color_bg=(0, 0, 255)  # Blue background color
                    )

                    draw_text(
                        frame,
                        self.motivational_message,
                        pos=(20, 200),  # Adjusted position for upper left corner
                        text_color=(150, 0, 0),  # Dark red text color
                        font_scale=0.7,
                        text_color_bg=(255, 255, 0)  # Yellow background color
                    )
                    if self.state_tracker['CURRENT_SET'] + 1 == self.sets:
                        draw_text(
                            frame,
                            "SUPERMAN PULL EXERCISE COMPLETED!",
                            pos=(20, 300),  
                            text_color=(255, 255, 255), 
                            font_scale=0.7,
                            text_color_bg=(0, 128, 0)  
                        )

                


                else:
                    
                    del self.state_tracker['completion_message_frame']
                    print(f"SET {self.state_tracker['CURRENT_SET']+1} COMPLETED!")
                    self.state_tracker['PULL_COUNT'] = 0
                    self.state_tracker['CURRENT_SET'] += 1
                    self.state_tracker['IMPROPER_PULL'] = 0

        rest_time_elapsed = time.time() - self.rest_timer_start
        self.rest_timer = max(0, self.rest_time - rest_time_elapsed)
        #print(self.rest_timer)
        if(self.rest_timer > 0):
            min, sec = divmod(self.rest_timer, 60)
            draw_text(
                frame,
                f"Rest Time: {int(min):02d}:{int(sec):02d}  [REST]",
                pos=(20, 150),  
                text_color=(255, 255, 255),  
                font_scale=0.7,
                text_color_bg=(0, 128, 0) 
            )
            
            
        return frame, play_sound

      

 