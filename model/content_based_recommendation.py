import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from data import helper_func
import pickle

def content_based_recommend(user_id):

    anime_attributes = np.load('anime_attribute.npy')
    cosine_sim = cosine_similarity(anime_attributes)
    like_anime_index = helper_func.get_user_like(user_id)
    similar_anime = list(enumerate(cosine_sim[like_anime_index]))
    recommendation = sorted(similar_anime, key=lambda x: x[1], reverse=True)
    i = 0
    recommend = []
    ## recommend 5 anime to the user
    for anime in recommendation:
        recommend.append(anime[0])
        i += 1
        if i == 5:
            break
    return recommend
