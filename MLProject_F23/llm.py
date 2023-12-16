import time
from gpt4all import GPT4All
from langchain import llms
import pandas as pd
import os
from langchain.prompts import PromptTemplate
from langchain.schema import StrOutputParser

"""
UTILS
"""

def now_ms(get_time=time.time):
    """
    Returns the current time in milliseconds.
    """
    return round(get_time() * 1000)


def duration_ms(start_time, now_ms=now_ms):
    """
    Returns the duration in milliseconds since the given start time.
    """
    return now_ms() - start_time


def duration_s(start_time, now_ms=now_ms):
    """
    Returns the duration in seconds since the given start time.
    """
    return duration_ms(start_time, now_ms) / 1000


SHOULD_TRACE = True
START_TIME = now_ms()


def trace(*args, **kwargs):
    """
    Prints a trace message if the `SHOULD_TRACE` flag is set to True.
    """
    if SHOULD_TRACE:
        print(f"TRACE::{duration_s(START_TIME)}::", *args, **kwargs)

def use_gpt4all(model_name, model_cache_path, fq_model_path):
    """
    Prepares a LLM for use in Q&A. Downloads the model to the
    cache if it isn't already there.

    PARAMETERS:
    model_name (str):       The name of the model to use.
    model_cache_path (str): The path to the model cache.
    fq_model_path (str):    The fully qualified path to the model.

    RETURNS:
    (Any (LCEL<LLM>)): The prepared LLM.
    """
    trace("preparing LLM")
    trace(f"model_name={model_name}")
    trace(f"model_cache_path={model_cache_path}")
    trace(f"fq_model_path={fq_model_path}")

    # if the chosen model isn't cached, this will
    # load it into the cache for future use
    # (~/.cache/gpt4all on linux & macos)
    GPT4All(model_name=model_name, model_path=model_cache_path)

    # load an LCEL chain wrapper of GPT4All
    return llms.GPT4All(model=fq_model_path)


def choose_gpt4all():
    GPT_MODEL_NAME = "mistral-7b-instruct-v0.1.Q4_0.gguf"
    GPT_MODEL_CACHE_PATH = os.path.expanduser("~/Documents/")
    GPT_FQ_MODEL_PATH = f"{GPT_MODEL_CACHE_PATH}{GPT_MODEL_NAME}"

    return use_gpt4all(GPT_MODEL_NAME, GPT_MODEL_CACHE_PATH, GPT_FQ_MODEL_PATH)

llm = choose_gpt4all()

def extract_movie_names(user_input):
    """
    Extracts key information from the user input using the LLM.
    """
    prompt = PromptTemplate(
        template="""Given the sentence, identify and extract any movie titles. 
                Sentence: '{text}'"""
                ,
        input_variables=["text"],
    )
    chain = prompt | llm | StrOutputParser()

    ans = chain.invoke({"text": user_input})
    return ans

def generate_movie_names(user_input):
    """
    generate a possible movie name that is closest to the description from the user input using the LLM.
    """
    prompt = PromptTemplate(
        template="""Given the sentence, return a movie that is closest to the description from sentence: '{text}'"""
                ,
        input_variables=["text"],
    )
    chain = prompt | llm | StrOutputParser()

    ans = chain.invoke({"text": user_input})
    return ans


def create_conversational_recommendations(user_input, movie_df):
    """
    Creates a conversational response from the LLM based on the user input
    and a DataFrame containing movie recommendations.
    """
    # Convert the DataFrame to a structured list format
    movies_list = movie_df.apply(lambda row: f"- {row['title']} (Genres: {row['genres']})", axis=1).tolist()
    movies_text = "\n".join(movies_list)

    # Define the template for the prompt
    template = (
        f"The user is looking for movie recommendations and mentioned: '{user_input}'. "
        f"Based on their interest, we found the following movies:\n{movies_text}\n"
        "Can you turn this list into a conversational recommendation?"
    )

    # Create the prompt template
    prompt = PromptTemplate(
        template=template,
        input_variables=["text"],
    )

    # Create a chain that uses the LLM and parses the output as a string
    chain = prompt | llm | StrOutputParser()

    # Invoke the chain with the user input
    ans = chain.invoke({"text": user_input})

    # Return the conversational recommendations
    return ans





