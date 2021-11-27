'''
Collaborative Filtering utils
Authors: Alejandro Alvarez, Brenda Palma
'''
import numpy as np

def get_rating(model, user_id, joke_id):
    pred = model.predict(uid=user_id, iid=joke_id)
    return pred.est

def get_recommendations(model, user_id, unseen_by_user, n_jokes):
    n_jokes = min(n_jokes, len(unseen_by_user))
    ratings = list(map(lambda x: get_rating(model, user_id, x), unseen_by_user))
    sorted_idx = np.argsort(ratings)[::-1]
    jokes = unseen_by_user[sorted_idx]
    ratings = np.array(ratings)[sorted_idx]
    return jokes[:n_jokes], ratings[:n_jokes]


def display_jokes(jokes, jokes_to_display):
    for j in jokes_to_display:
        joke = jokes['text'][jokes['joke_id']==j].values[0]
        print(joke, '\n')



