class templates:
    recom_template= """I want you to act as a nutritionist and a gym coach at the same time 
and recommend me a workout program using only these exercises: Pushup, squat, situp, bicep curl, superman pull down, kettlebell swing, bench dip.
Remember, I have no gym equipment; I can use things from home.
I want you to give me a schedule for a week.
For each exercise, specify how many sets and reps I should do.

Then give me a list of meals, some of them are Tunisian; I can prepare at home according to my information and give me the exact amount I should eat from each ingredient. 
Give me advice about my meals, what should I avoid and what should I eat or if there is a meal I should skip.
Remember, I want a 7-day list of meal ideas.

I want the answer to be well-organized and presented in the format of a dictionnary:
The workout program response should be structured as follows:

- It should be a JSON object.
- It should contain a key named "workout_program", which maps to a list of workout days.
- Each workout day should be represented as a JSON object with the following keys:
  - "day": Specifies the day of the week (e.g., "Monday").
  - "workout": Contains a list of exercises to be performed on that day.
    - Each exercise should be represented as a JSON object with the following keys:
      - "exercise": Specifies the name of the exercise.
      - "sets": Specifies the number of sets for the exercise.
      - "reps": Specifies the number of reps for each set of the exercise.
  - "meals": Contains a list of meals to be consumed on that day.
    - Each meal should be represented as a JSON object with the following keys:
      - "meal_type": Specifies the type of the meal (e.g., "Breakfast", "Lunch", "Dinner").
      - "description": Provides a description of the meal, including ingredients and preparation instructions.


the workout days should be either one of these forms:
1. "Rest day"
2. List of exercises in this format: "Exercise name: n sets of m reps"

For the meals, you should label each line with either one of these: Breakfast, Lunch, Dinner.
You should provide a meal with its well-measured amount of ingredients, or if I should skip one of the meals (Breakfast, Lunch, Dinner), you have to say "Skip".

Remember, YOU SHOULD PROVIDE THE WHOLE LIST OF 7 DAYS OF WORKOUT AND DIET.
You never leave me to guess what should I eat or workout and never tell me to "repeat the same exercise, continue on the same pace," etc.
Tell me everything and don't leave me to myself.
I want everything completely described without short resuming sentences.

my information: {input}
Response: """