# Welcome to Machine Learning Recommendation Engine Project

This project is a machine learning recommendation engine that utilizes content-based filtering and collaborative filtering techniques. It aims to provide personalized recommendations to users based on their preferences and the characteristics of the items being recommended. The movie recommendation chatbot utilizes the power of GPT4all, a large language model, to extract movie names from user input. It then transfers the extracted movie names to filtering mechanisms to provide personalized movie recommendations to users.


## Getting Started

To get started with the Movie Recommendation Chatbot, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies by running the following command:
`$pip install fuzzywuzzy`<br>
`$pip install ast`<br>
`$pip install tkinter`<br>
`$pip install gpt4all`<br>
`$pip install langchain`<br>

3. Please make sure you download the model to your local environment from [GPT4All](https://gpt4all.io/index.html)
4. Download "mistral-7b-instruct-v0.1.Q4_0.gguf" and make sure to change the path: GPT_MODEL_CACHE_PATH in llm.py()
5. To run the content-based filtering recommendation algorithm, you need to follow these steps:
- Download the movie dataset from https://www.kaggle.com/datasets/grouplens/movielens-20m-dataset/.
- Rename the downloaded dataset folder to 'data'. This step is important as the 'data' folder name is used in the code.
- Run the 'datamerge.py' file. This file reorganizes and forms a large metadata for the convenience of content-based recommendation. It merges the data from the 'data' folder.
- After running 'datamerge.py', you can proceed to run the content-based recommendation algorithm, and hence the chatbot.
6. Run `frontGUI.py` in the terminal using the following command:<br>
`python frontGUI.py`

## Accuracy Estimation (Collaborative Filtering)

To estimate the accuracy of the collaborative filtering algorithm used in this project, we have implemented the `get_error` function. This function calculates the error by comparing the predicted movie ratings with the actual ratings provided by users.

The `get_error` function takes two parameters: `movies_df` (the movies dataframe) and `ratings_df` (the ratings dataframe). It iterates over the unique user IDs in the ratings dataframe and performs the following steps:

1. Retrieves the user's ratings and selects the top 10 rated movies.
2. Merges the selected movies with the movies dataframe to get additional movie information.
3. Calls the collaborative filtering algorithm to generate movie recommendations based on the user's ratings.
4. Compares the predicted ratings with the actual ratings and calculates the error.
5. Updates the error value and increments the number of users.
6. Returns the average error per user.

To calculate the training accuracy, we load the movie and ratings data using the `load_data` function and then call the `get_error` function. The training accuracy is calculated by subtracting the error from 100 and rounding it to two decimal places.

Please note that the accuracy estimation is based on the provided movie dataset and may vary depending on the dataset used. Also, keeping the available computation resources, the error (and accuracy) has only been computed over the first user. The accuracy based on the ratings of 1 user in the dataset is 59.2%.

![Alt text](Accuracy.png)

# Acknowledgments
This project utilizes the following libraries and resources:

- [GPT4All]() - Large language model for natural language processing.
npm - Package manager for JavaScript.
- [Movie Dataset](https://www.kaggle.com/datasets/grouplens/movielens-20m-dataset/) - Dataset used for training and testing the movie recommendation system.


