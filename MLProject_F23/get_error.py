from collaborative import collaborative_filtering
from collaborative import load_data
import pandas as pd

def get_error(movies_df, ratings_df):
    """
    Get the error of the collaborative filtering algorithm.
    @param movies_df: The movies dataframe.
    @param ratings_df: The ratings dataframe.
    @return: The error of the collaborative filtering algorithm.
    """
    error = 0
    # while(True):
    #     print("Max number of users: ", ratings_df['userId'].nunique())
    #     num_of_users_to_test_error = int(input("Enter number of users to test error on: "))
    #     if num_of_users_to_test_error > ratings_df['userId'].nunique():
    #         print("Error: Number of users to test error on is greater than number of users in dataset.")
    #         continue
    #     else:
    #         break

    num_users = 0
    for user_id in ratings_df['userId'].unique()[:1]:
        # print("User ID: ", user_id)
        user_df = ratings_df[ratings_df['userId'] == user_id].sort_values(by = 'rating', ascending=False).reset_index()
        input_df = user_df.head(10)
        input_df = movies_df.merge(input_df, on='movieId', how = 'right')
        user_input = input_df[['title', 'rating']].transpose().to_dict()

        # test_df = user_df[10:20]
        # test_df = movies_df.merge(test_df, on='movieId', how = 'right')

        inputMovies = pd.DataFrame(list(user_input.values()))
        # movies_df, ratings_df = load_data()
        recommendation_df = collaborative_filtering(movies_df, ratings_df, inputMovies)
        final = recommendation_df.reset_index(drop = True).merge(user_df, on = ['movieId'], how = 'left').dropna()
        if len(final) != 0:
            num_users+=1
            sum = 0
            for index, row in final.iterrows():
                # print(row['weighted_average_recommendation_score'])
                x = abs(row['weighted_average_recommendation_score'] - row['rating'])
                sum += x
            error += sum/len(final)
    return error/num_users

if __name__ == "__main__":
    print("Please wait while the data is loading...")
    movies_df_final, ratings_df_final = load_data()
    print("The training accuracy is", 100-round(get_error(movies_df_final, ratings_df_final)*100,2), "%.")
