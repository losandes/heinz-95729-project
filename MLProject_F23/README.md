# Welcome to Machine Learning Recommendation Engine Project

This project is a machine learning recommendation engine that utilizes content-based filtering and collaborative filtering techniques. It aims to provide personalized recommendations to users based on their preferences and the characteristics of the items being recommended. The movie recommendation chatbot utilizes the power of GPT4all, a large language model, to extract movie names from user input. It then transfers the extracted movie names to filtering mechanisms to provide personalized movie recommendations to users.

# Acknowledgments
This project utilizes the following libraries and resources:

- [GPT4all]() - Large language model for natural language processing.
npm - Package manager for JavaScript.
- [Movie Dataset](https://www.kaggle.com/datasets/grouplens/movielens-20m-dataset/) - Dataset used for training and testing the movie recommendation system.

## Getting Started

To get started with the Movie Recommendation Chatbot, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies by running the following command:
`$pip install fuzzywuzzy
$pip install ast
$pip install tkinter
$pip install gpt4all
$pip install langchain`

3. Please make sure you download the model to your local environment from [GPT4All](https://gpt4all.io/index.html)
4. Download "mistral-7b-instruct-v0.1.Q4_0.gguf" and make sure to change the path: GPT_MODEL_CACHE_PATH in llm.py()


