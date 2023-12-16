import numpy as np
import pandas as pd
import warnings, math
warnings.filterwarnings("ignore")
from fuzzywuzzy import process

def match_and_update_titles(userInput, movies_df):
    """
    Match and update titles in userInput.
    @param userInput: The user input.
    @param movies_df: The movies dataframe.
    @return: The updated userInput.
    """
    titles = movies_df['title'].tolist()
    for user_movie in userInput:
        # Find the closest match in the movies_df titles
        closest_match = process.extractOne(user_movie['title'], titles)
        # Update the title in userInput
        user_movie['title'] = closest_match[0]
    return userInput

def load_data():
    """
    Load the movies and ratings datasets.
    @return: The movies and ratings datasets.
    """
    movies_df = pd.read_csv('input/movie.csv')
    ratings_df = pd.read_csv('input/rating.csv')
    movies_df['year'] = movies_df.title.str.extract('(\(\d\d\d\d\))',expand=False)
    #Removing paranthesis
    movies_df['year'] = movies_df.year.str.extract('(\d\d\d\d)',expand=False)
    #Removing the years from the 'title' column
    movies_df['title'] = movies_df['title'].str.replace('(\(\d\d\d\d\))', '', regex=True)
    #Applying the strip function to get rid of any ending whitespace characters that may have appeared
    movies_df['title'] = movies_df['title'].apply(lambda x: x.strip())
    # movies_df = movies_df.drop(columns = ['genres'])
    ratings_df = ratings_df.drop(columns = ['timestamp'])
    return movies_df, ratings_df


def get_pearson_correlation(inputMovies, userSubsetGroup):
    """
    Get the Pearson correlation between two users.
    @param inputMovies: The input movies.
    @param userSubsetGroup: The user subset group.
    @return: The Pearson correlation between two users.
    """

    #Store the Pearson Correlation in a dictionary, where the key is the user Id and the value is the coefficient
    pearsonCorrelationDict = {}

    #For every user group in our subset
    for name, group in userSubsetGroup:

        #Let's start by sorting the input and current user group so the values aren't mixed up later on
        group = group.sort_values(by='movieId')
        inputMovies = inputMovies.sort_values(by='movieId')

        #Get the N (total similar movies watched) for the formula
        nRatings = len(group)

        #Get the review scores for the movies that they both have in common
        temp_df = inputMovies[inputMovies['movieId'].isin(group['movieId'].tolist())]

        #And then store them in a temporary buffer variable in a list format to facilitate future calculations
        tempRatingList = temp_df['rating'].tolist()

        #Let's also put the current user group reviews in a list format
        tempGroupList = group['rating'].tolist()

        #Now let's calculate the pearson correlation between two users, so called, x and y

        #For package based
        #scipy.stats import pearsonr
        #pearsonr(tempRatingList,tempGroupList)[0]

        #For hard code based
        Sxx = sum([i**2 for i in tempRatingList]) - pow(sum(tempRatingList),2)/float(nRatings)
        Syy = sum([i**2 for i in tempGroupList]) - pow(sum(tempGroupList),2)/float(nRatings)
        Sxy = sum( i*j for i, j in zip(tempRatingList, tempGroupList)) - sum(tempRatingList)*sum(tempGroupList)/float(nRatings)

        #If the denominator is different than zero, then divide, else, 0 correlation.
        if Sxx != 0 and Syy != 0:
            pearsonCorrelationDict[name[0]] = Sxy/np.sqrt(Sxx*Syy)
        else:
            pearsonCorrelationDict[name[0]] = 0
    pearsonDF = pd.DataFrame.from_dict(pearsonCorrelationDict, orient='index')
    pearsonDF.columns = ['similarityIndex']
    pearsonDF['userId'] = pearsonDF.index
    pearsonDF.index = range(len(pearsonDF))
    return pearsonDF

def collaborative_filtering(movies_df, ratings_df, inputMovies):
    """
    Perform collaborative filtering.
    @param movies_df: The movies dataframe.
    @param ratings_df: The ratings dataframe.
    @param inputMovies: The input movies.
    @return: The collaborative filtering recommendation dataframe.
    """
    #Filtering out the movies by title
    inputId = movies_df[movies_df['title'].isin(inputMovies['title'].tolist())]
    #Then merging it so we can get the movieId. It's implicitly merging it by title.
    inputMovies = pd.merge(inputId, inputMovies)
    #Dropping information we won't use from the input dataframe
    inputMovies = inputMovies.drop(columns = ['year'])
    #Filtering out users that have watched movies that the input has watched and storing it
    userSubset = ratings_df[ratings_df['movieId'].isin(inputMovies['movieId'].tolist())]
    #Groupby creates several sub dataframes where they all have the same value in the column specified as the parameter
    userSubsetGroup = userSubset.groupby(['userId'])
    #Sorting it so users with movie most in common with the input will have priority
    userSubsetGroup = sorted(userSubsetGroup,  key=lambda x: len(x[1]), reverse=True)
    userSubsetGroup = userSubsetGroup[0:100]

    pearsonDF = get_pearson_correlation(inputMovies, userSubsetGroup)
    topUsers=pearsonDF.sort_values(by='similarityIndex', ascending=False)[0:50]
    # ratings_df['userId'] = ratings_df['userId'].astype(int)
    topUsers['userId'] = topUsers['userId'].astype('int64')
    topUsersRating = topUsers.merge(ratings_df, left_on='userId', right_on='userId', how='inner')
    #Multiplies the similarity by the user's ratings
    topUsersRating['weightedRating'] = topUsersRating['similarityIndex']*topUsersRating['rating']
    tempTopUsersRating = topUsersRating.groupby('movieId').sum()[['similarityIndex','weightedRating']]
    tempTopUsersRating.columns = ['sum_similarityIndex','sum_weightedRating']
    # return tempTopUsersRating
    # Calculate weighted average recommendation score
    recommendation_df = pd.DataFrame()
    recommendation_df['weighted_average_recommendation_score'] = tempTopUsersRating['sum_weightedRating'] / tempTopUsersRating['sum_similarityIndex']
    recommendation_df['movieId'] = tempTopUsersRating.index
    recommendation_df = recommendation_df.sort_values(by='weighted_average_recommendation_score', ascending=False)
    return recommendation_df

def algorithm(dataframe_input):
    """
    The algorithm to be used.
    @param dataframe_input: The user input.
    @return: The recommendation dataframe.
    """
    dataframe_input = convert_to_dataframe(dataframe_input)
    userInput = dataframe_input.to_dict(orient='records')
    movies_df_final, ratings_df_final = load_data()
    # Match and update titles in userInput
    userInput = match_and_update_titles(userInput, movies_df_final)
    inputMovies = pd.DataFrame(userInput)
    recommendation_df = collaborative_filtering(movies_df_final, ratings_df_final, inputMovies)
    recommended_df = movies_df_final[movies_df_final['movieId'].isin(recommendation_df.head(20)['movieId'].tolist())]
    recommended_df.drop(columns = ['movieId'], inplace = True)
    return recommended_df


def convert_to_dataframe(input_str):
    """
    Convert the input string to a DataFrame.
    @param input_str: The input string.
    @return: The DataFrame.
    """
    # Split the input string into a list of movie titles and ratings
    input_list = input_str.split(',')
    # Check if the number of elements in the list is even
    if len(input_list) % 2 != 0:
        raise ValueError("Invalid input format. Please provide movie titles and ratings in pairs.")

    # Parse the list into a list of dictionaries
    movies = []
    for i in range(0, len(input_list), 2):
        try:
            title = input_list[i].strip()
            rating = float(input_list[i + 1].strip())
            movies.append({'title': title, 'rating': rating})
        except ValueError:
            raise ValueError("Invalid rating. Ensure that all ratings are numbers.")
    # Convert the list of dictionaries to a DataFrame
    return pd.DataFrame(movies)

# if __name__ == "__main__":
    # Example Usage:
    # userInput = [
    #             {'title':'The Breakfast Club', 'rating':5},
    #             {'title':'Toy Story', 'rating':3.5},
    #             {'title':'Jumanji', 'rating':2},
    #             {'title':"Pulp Fiction", 'rating':5},
    #             {'title':'Akira', 'rating':4.5}
    #         ]
    # userInput = "The Breakfast Club,5,Toy Story,3.5,Jumanji,2,Pulp Fiction,5,Akira,4.5"
    # recommendation_df = algorithm(userInput)
    # print(recommendation_df)
