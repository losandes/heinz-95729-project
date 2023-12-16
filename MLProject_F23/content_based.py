# Version 2:
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer
import ast
from fuzzywuzzy import process

def find_closest_movie(title_input, dataset_path):
    """
    Find the closest movie title in the dataset to the given input title.
    :param P_input: The input title as a string.
    :param dataset_path: Path to the meta_dataset CSV file.
    :return: A tuple of the closest movie title and its movieId.
    """
    # Load the dataset
    data = pd.read_csv(dataset_path)

    # Use fuzzy matching to find the closest title
    match = process.extractOne(title_input, data['title'])
    print(f"\nYour input is: {title_input}")
    # Ensure a match was found and correctly unpack the result
    if match:
        closest_title = match[0]
        score = match[1]  # the matching score

        # Get the movieId of the closest title
        movie_id = data[data['title'] == closest_title]['movieId'].iloc[0]

        print(f"Closest Movie: {closest_title}, Movie ID: {movie_id}\n")
        return closest_title, movie_id
    else:
        print(f"\nCannot find a match movie\n")
        return None, None

def load_data(file_path):
    """
    Load the meta dataset and process tagIds and genres.
    """
    data = pd.read_csv(file_path)

    # Convert tagIds from string representation of list to actual list of integers
    data['tagIds'] = data['tagIds'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else [])

    # Split genres into lists
    data['genres'] = data['genres'].apply(lambda x: x.split('|') if isinstance(x, str) else [])

    return data

def create_feature_matrix(data):
    """
    Convert the list of tagIds and genres for each movie into a one-hot encoded matrix.
    """
    mlb_tags = MultiLabelBinarizer()
    mlb_genres = MultiLabelBinarizer()

    tag_matrix = mlb_tags.fit_transform(data['tagIds'])
    genre_matrix = mlb_genres.fit_transform(data['genres'])

    # Combine the tag and genre matrices
    feature_matrix = np.concatenate((tag_matrix, genre_matrix), axis=1)
    return feature_matrix


def recommend_movies_id(movie_id, movies, feature_matrix):
    """
    Recommend movies based on a given movie ID.
    """
    if movie_id not in movies['movieId'].values:
        print("Movie ID not found.")
        return []

    idx = movies.index[movies['movieId'] == movie_id].tolist()[0]
    cosine_sim = cosine_similarity([feature_matrix[idx]], feature_matrix)[0]
    sim_scores = list(enumerate(cosine_sim))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:11]  # Top 10 recommendations
    return [i[0] for i in sim_scores]

def get_contentbased_recommand(movie_name):
    dataset_path = '/data/meta_dataset.csv'
    # Load the meta dataset
    meta_dataset = load_data(dataset_path)
    # Create the feature matrix
    feature_matrix = create_feature_matrix(meta_dataset)
    input_title = movie_name
    closest_title, movie_id = find_closest_movie(input_title, dataset_path)
    movie_indices = recommend_movies_id(movie_id, meta_dataset, feature_matrix)
    recommended_movies = meta_dataset.iloc[movie_indices][['title', 'genres']]
    # Display the results
    print("Movies recommended for Movie '{}':".format(closest_title))
    print(recommended_movies)
    return recommended_movies


if __name__ == "__main__":
    # Example Usage:
    mov_df = get_contentbased_recommand("Star War")










'''Version 1: txt based recommendation system

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Dec 05, 2023 Notes:
# how can I use GPU to speed up the program: try to run with M1 or CoLab to save time
# Send it to professor with details about the question

def load_data(file_path):
    """
    Load the meta dataset.
    """
    return pd.read_csv(file_path)


def create_similarity_matrix(data):
    """
    Create a TF-IDF Vectorizer and compute the cosine similarity matrix.
    """
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(data['combined_features'])
    return cosine_similarity(tfidf_matrix)


def recommend_movies(movie_title, movies, cosine_sim):
    """
    Recommend movies based on a given movie title.
    """
    # Get the index of the movie that matches the title
    if movie_title not in movies['title'].values:
        print("Movie not found in the dataset.")
        return []
    idx = movies.index[movies['title'] == movie_title].tolist()[0]

    # Get the pairwise similarity scores of all movies with that movie
    sim_scores = list(enumerate(cosine_sim[idx]))

    # Sort the movies based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the scores of the 10 most similar movies
    sim_scores = sim_scores[1:11]

    # Get the movie indices of  the top 10 most similar movies
    return [i[0] for i in sim_scores]


# Main execution
if __name__ == "__main__":
    # Load the meta dataset
    meta_dataset = load_data('archive/meta_dataset.csv')

    # Create the similarity matrix
    cosine_sim = create_similarity_matrix(meta_dataset)

    # Example usage
    movie_title = "Toy Story (1995)"
    recommendations = meta_dataset['title'].iloc[recommend_movies(movie_title, meta_dataset, cosine_sim)]
    print("Movies recommended for '{}':".format(movie_title))
    for movie in recommendations:
        print(movie)
'''