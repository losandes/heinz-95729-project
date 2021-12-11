from data import helper_func
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pickle

## loading necessary file
mf_model = np.load('BestMFModel.npy')
anime_attributes = np.load('anime_attribute.npy')
rating_matrix = np.load('rating_matrix1000000.npy')
anime_new2old_content = np.load('anime_new_to_old_content.npy')
with open('anime_old_to_new_content.pkl','rb') as f:
    anime_old2new_content = pickle.load(f)
anime_new2old_mf = np.load('data/anime_new_to_old.npy')
anime_new2old_fp = np.load('data/anime_new_to_old_fp.npy')
with open('data/ruleBase.pkl','rb') as f:
    rule_base = pickle.load(f)
rating_matrix = list(rating_matrix)


'''
ensemble model starts!!!
'''
print("--------------------welcome to anime recommender system---------------------")
print("please enter your id")
user_id = int(input())
# if we has the information about this user
if(helper_func.isIn(user_id)):
    print("------------------------welcome-------------------------")

    # get his/her new id
    user_o2n = helper_func.get_user_new_id(user_id)

    cosine_sim = cosine_similarity(anime_attributes)
    like_anime_index,like_anime_name = helper_func.get_user_like(user_id)
    # get the best anime old id
    new_id = anime_old2new_content[like_anime_index[0][0]]

    similar_anime = list(enumerate(cosine_sim[new_id]))
    recommendation = sorted(similar_anime,key=lambda x:x[1],reverse=True)
    i = 0
    result_content_based = []
    for anime in recommendation:
        name = helper_func.get_anime_name(anime_new2old_content[int(anime[0])])
        # make sure it is not viewed by the user
        if name not in like_anime_name:
            result_content_based.append(name)
            i+=1
            if i==3:
                break

    # mf predict
    user_rating_predict = mf_model[int(user_o2n)]
    gt = rating_matrix[int(user_o2n)]
    #print(len(user_rating_predict))
    #print(len(gt))
    tmp = []
    for i in range(len(gt)):
        if gt[i] == 0:
            tmp.append([user_rating_predict[i],i])
    tmp.sort(key=lambda x:x[0],reverse=True)
    mf_result = []
    for i in range(3):
        mf_result.append([helper_func.get_anime_name(anime_new2old_mf[tmp[i][1]]),tmp[i][0]])
    print('------------------we recommend these anime for you-------------------')
    print(result_content_based+mf_result)
else:
    print("you are a new user,please first let us know about yourself\n")
    print("please select an anime you like")
    like_anime = []
    while True:
        for i in range(30):
            print(str(i)+":"+helper_func.get_anime_name(anime_new2old_fp[i]))
        tmp = input()
        if tmp.isdigit() and 0<=int(tmp)<30:
            like_anime.append(int(tmp))
        else:
            break
    key = tuple(like_anime)
    rule_based_result = []
    if key in rule_base:
        rule_based_result = rule_base[key]
        rule_based_result = list(list(rule_based_result)[0])
        rule_based_result = [helper_func.get_anime_name(anime_new2old_fp[i]) for i in rule_based_result]


    like_anime = [anime_new2old_fp[i] for i in like_anime]
    like_anime_name = [helper_func.get_anime_name(i) for i in like_anime]
    like_index = like_anime[0]

    cosine_sim = cosine_similarity(anime_attributes)
    similar_anime = list(enumerate(cosine_sim[like_index]))
    recommendation = sorted(similar_anime, key=lambda x: x[1], reverse=True)
    i = 0
    result_content_based = []
    for anime in recommendation:

        name = helper_func.get_anime_name(anime_new2old_content[int(anime[0])])
        if name not in like_anime_name:
            rule_based_result.append(name)
            #print(anime[0])
            i += 1
            if i == 5:
                break
    print('------------------we recommend these anime for you-------------------')
    print(rule_based_result)






