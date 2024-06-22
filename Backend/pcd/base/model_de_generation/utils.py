from langchain.chains import LLMChain
from langchain_community.callbacks import get_openai_callback
from langchain.prompts.prompt import PromptTemplate
#from langchain_community.chat_models import ChatOpenAI
from langchain_openai import ChatOpenAI
from . import prompts
import os


llm = ChatOpenAI(
    openai_api_key= os.environ.get('API_KEY'),
    model_name="gpt-3.5-turbo",
    temperature=0.8,
)

def construct_input(form_data):
    input_text = f"""
    
    Hello, My name is {form_data['username']}, I am {form_data['age']} years old, 
    my height is {form_data['height']} {form_data['heightUnit']} and I weigh {form_data['weight']} {form_data['weightUnit']}.
    As for my existing medical conditions: {', '.join(form_data['healthConditions'])}.
    For my current medications, I take {form_data['medications']}.
    For my allergies or dietary restrictions, I have {form_data['allergies']}.
    For previous injuries or surgeries, I have {form_data['injuries']}.
    For my fitness goals, I am aiming for {', '.join(form_data['fitnessGoals'])}.
    For my activity level, I am {form_data['activityLevel']}.
    My preferred workout times are {form_data['workoutTime']}.
    I am {form_data['experienceLevel']}.

    """
    return input_text

def llmchain(form_data):
    with get_openai_callback():
        input_text = construct_input(form_data)
        prompt = PromptTemplate(template=prompts.templates.recom_template, input_variables=["input"])  # Provide input_text as the input variable
        llm_chain = LLMChain(llm=llm, prompt=prompt)
        llm_answer = llm_chain.invoke(input=input_text)  # Only pass input_text as an argument
        
    return llm_answer






