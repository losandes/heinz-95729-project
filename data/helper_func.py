'''
This file read 1 million data from the original data, and then map the original user id and anime id
to a new id start from 0.
then we use dictionary and list to record these mapping: old id->new id; new id ->old id
so that we can do:
given user_id, we can find new_id= dict[user_id] , and see the rating_matrix[new_id] which represent the users' rating on
different movie
'''

import pandas as pd
import numpy as np
import pickle


'''
rating_file = pd.read_csv('rating.csv')
rating_file = rating_file[rating_file['rating']!=-1]
rating_file = rating_file.head(1000000)


user_old_to_new = {}
user_new_to_old = []
user_id = 0
anime_old_to_new = {}
anime_new_to_old = []
anime_id = 0

for index,row in rating_file.iterrows():
    #print(user_new_to_old, row['user_id'])
    if row['user_id'] not in user_old_to_new:
        user_old_to_new[row['user_id']] = user_id
        user_id+=1
        user_new_to_old.append(row['user_id'])
    if row['anime_id'] not in anime_old_to_new:
        anime_old_to_new[row['anime_id']] = anime_id
        anime_id+=1
        anime_new_to_old.append(row['anime_id'])

user_new_to_old = np.array(user_new_to_old)
anime_new_to_old = np.array(anime_new_to_old)
with open('user_old_to_new.pkl','wb') as f:
    pickle.dump(user_old_to_new,f,pickle.HIGHEST_PROTOCOL)
print("1/4")
with open('anime_old_to_new.pkl','wb') as f:
    pickle.dump(anime_old_to_new,f,pickle.HIGHEST_PROTOCOL)
print("2/4")
np.save("user_new_to_old.npy",user_new_to_old)
print("3/4")
np.save("anime_new_to_old.npy",anime_new_to_old)
print("done")
'''


def get_anime_name(id):
    file = pd.read_csv('data/anime.csv')
    file = file[file['anime_id']==id]
    for index,row in file.iterrows():
        return row['name']


def get_user_like(id):
    file = pd.read_csv('data/rating.csv')
    #print(file.head(100))
    file = file[file['user_id']==id]
    file = file[file['rating']!=-1]
    #print(file.head(10))
    like_anime = []
    for index,row in file.iterrows():
        like_anime.append([row['anime_id'],row['rating']])
    like_anime = sorted(like_anime,key=lambda x:x[1],reverse=True)
    like_anime_name = [get_anime_name(i[0]) for i in like_anime]
    print("we find out that you like:",like_anime_name)
    return like_anime,like_anime_name


def get_anime_old_id(id):
    dict = np.load('data/anime_new_to_old.npy')
    return dict[id]


def get_user_old_id(id):
    dict = np.load('data/user_new_to_old.npy')
    return dict[id]


def isIn(id):
    with open('data/user_old_to_new.pkl','rb') as f:
        dict = pickle.load(f)
        return id in dict


def get_user_new_id(id):
    with open('data/user_old_to_new.pkl','rb') as f:
        dict = pickle.load(f)
        return dict[id]


def get_anime_new_id(id):
    with open('anime_old_to_new.pkl','rb') as f:
        dict = pickle.load(f)
        return dict[f]



