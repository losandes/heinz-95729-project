import pandas as pd
import numpy as np
import pickle



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
