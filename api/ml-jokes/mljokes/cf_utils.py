'''
Collaborative Filtering utils
Authors: Alejandro Alvarez, Brenda Palma
'''
import numpy as np
import matplotlib.pyplot as plt
from tqdm import tqdm
from sklearn.manifold import TSNE
import pandas as pd


def get_rating(model, user_id, joke_id):
    '''
    Get the rating that ´user_id´ would assign to ´joke_id´
    '''
    pred = model.predict(uid=user_id, iid=joke_id)
    if pred.details['was_impossible']:
        return np.nan
    return pred.est

def get_predicted_ratings(model, user_id, joke_list):
    '''
    Get predicted ratings by ´user_id´ of jokes in joke_list
    '''
    return list(map(lambda x: get_rating(model, user_id, x), joke_list))


def get_all_ratings(model):
    '''
    Get predictions for all jokes by all users (for later use in ensemble model)
    '''
    all_preds = np.empty((0,3))
    user_list = []
    joke_list = []
    ratings = []
    for user_id in tqdm(model.trainset.all_users()):
        preds = list(map(lambda x: [user_id, x, get_rating(model, user_id, x)], np.arange(1,model.trainset.n_items+1)))
        all_preds = np.vstack((all_preds, preds))
    pred_df = pd.DataFrame({'user_id': pd.Series(all_preds[:,0]).astype(int), \
        'joke_id': pd.Series(all_preds[:,1]).astype(int), \
            'pred_cf': all_preds[:,2]})
    return pred_df



def generate_joke_embeddings(model, perplexity, random_state):
    '''
    Plot the joke-concept matrix in 2D (dim. reduction with PCA)
    '''
    tsne = TSNE(n_components=2, perplexity=perplexity, learning_rate='auto', n_iter=1000,  verbose=0, init = 'pca', random_state=random_state)

    joke_embeddings = tsne.fit_transform(model.qi)
    return joke_embeddings


def get_real_ratings(ratings, user_id):
    '''
    Filter rated jokes by ´user_id´
    '''
    return ratings.loc[ratings['user_id']==user_id,['joke_id', 'rating']]

def get_top_rated_jokes(ratings, user_id, top_n):
    '''
    Get top_n rated jokes for ´user_id´
    '''
    real_ratings = get_real_ratings(ratings, user_id)
    top_n = min(top_n, len(real_ratings))
    sorted_idx = np.argsort(real_ratings['rating'])[::-1]
    return real_ratings['joke_id'].values[sorted_idx][:top_n]

def get_bottom_rated_jokes(ratings, user_id, bottom_n):
    '''
    Get bottom_n rated jokes for ´user_id´
    '''
    real_ratings = get_real_ratings(ratings, user_id)
    bottom_n = min(bottom_n, len(real_ratings))
    sorted_idx = np.argsort(real_ratings['rating'])
    return real_ratings['joke_id'].values[sorted_idx][:bottom_n]


def get_recommendations(model, user_id, unseen_by_user, n_jokes):
    """
    Get top_n joke recommnedations for ´user_id´ based on predicted ratings.
    Recommended jokes are chosen from the pool of previously unseen jokes by the user.
    """
    n_jokes = min(n_jokes, len(unseen_by_user))
    pred_ratings = get_predicted_ratings(model, user_id, unseen_by_user)
    sorted_idx = np.argsort(pred_ratings)[::-1]
    unseen_sorted = unseen_by_user[sorted_idx]
    ratings_sorted = np.array(pred_ratings)[sorted_idx]
    return unseen_sorted[:n_jokes], ratings_sorted[:n_jokes]

def get_counter_recommendations(model, user_id, unseen_by_user, n_jokes):
    """
    Get bottom_n joke recommnedations for ´user_id´ based on predicted ratings.
    Recommended jokes are chosen from the pool of previously unseen jokes by the user.
    """
    n_jokes = min(n_jokes, len(unseen_by_user))
    pred_ratings = get_predicted_ratings(model, user_id, unseen_by_user)
    sorted_idx = np.argsort(pred_ratings)
    unseen_sorted = unseen_by_user[sorted_idx]
    ratings_sorted = np.array(pred_ratings)[sorted_idx]
    return unseen_sorted[:n_jokes], ratings_sorted[:n_jokes]



def get_user_profile(model, ratings, jokes, user_id, n_rated, n_recomm, unseen_by_user):
    # Top rated joked
    top_rated = get_top_rated_jokes(ratings, user_id, n_rated)

    # Bottom rated jokes
    bottom_rated = get_bottom_rated_jokes(ratings, user_id, n_rated)

    # Recommendations
    recomm, _ = get_recommendations(model, user_id, unseen_by_user, n_recomm)

    # Counter recommendations
    counter_recomm, _  = get_counter_recommendations(model, user_id, unseen_by_user, n_recomm)

    # Display profile
    print("Top rated jokes")
    display_jokes(jokes, top_rated)

    print("Worst rated jokes")
    display_jokes(jokes, bottom_rated)

    print("Recommendations")
    display_jokes(jokes, recomm)

    print("Counter recommendations")
    display_jokes(jokes, counter_recomm)
    


def plot_user_preferences(model, joke_embeddings, user_id, unseen_jokes, n_recommended, mask_unseen=True):

    all_ratings = get_predicted_ratings(model, user_id, np.arange(1, model.qi.shape[0]+1))
    recomm_jokes,_ = get_recommendations(model, user_id, unseen_jokes, n_recommended)

    idx_unseen = list(map(lambda x: x-1,unseen_jokes))
    idx_recomm = list(map(lambda x: x-1,recomm_jokes))

    fig = plt.scatter(joke_embeddings[:,0], joke_embeddings[:,1], cmap = 'RdYlGn', c=all_ratings)
    if mask_unseen:
        plt.scatter(joke_embeddings[idx_unseen,0], joke_embeddings[idx_unseen,1],  c = 'gray')
    plt.scatter(joke_embeddings[idx_recomm,0], joke_embeddings[idx_recomm,1], c='black', marker="x")
    plt.show()


def display_jokes(jokes, jokes_to_display):
    for j in jokes_to_display:
        joke = jokes['text'][jokes['joke_id']==j].values[0]
        print(joke, '\n')



