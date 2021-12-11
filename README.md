# Final-Project
We are team ML-Anime, Team members are Tiancheng Chen and Tianyi Wang.
The final ensemble model is in **ensemble_model.py**
## Data Description
The data is from Kaggle.
www.kaggle.com/CooperUnion/anime-recommendations-database
</br>
It contains two parts: one is anime.csv, which has the information of 12292 animes including anime's name, type, genre and etc..
</br>
The other one is rating.csv, it contains more than 7 million rating records, The rating is from 1 to 10, if there's a -1 in the file, it means the value is missing.
</br>
**Due to the file size limitation, we can't upload the rating file into github.**
## Recommender System
We need to first preprocess the data and then we explore different algorithms and generated the data we need(e.g. the predicted rating matrix) for the ensemble model. 
At last we implemented the ensemble model.
### Data preprocessing
#### Step 1: Generate rating matrix
see **rating_matrix.py**
</br>
In this file, it first ignore those rows with rating = -1. And then it reads the top 1 million rows. Considering the time and computing power we have, we reduce the sample size from over 7 million to 1 million.
After running this file, we save the rating matrix into a numpy form **rating_matrix1000000.npy**
</br>
#### Step 2: Save mapping information
see **save_dict.py**
After generating a rating matrix, we assign new id to both anime and user, so we need to keep those mapping information, we save those mapping information to **user_old_to_new.pkl, anime_old_to_new.pkl, user_new_to_old.npy,anime_new_to_old.npy**
#### Step 3: Generate anime attribute matrix and save the corresponding mapping.
see **model/content_based.py**
In this file, we vectorize the anime based on its type and genre, we also assign a new id to the anime according to its sequence of occurance in the file. We save the anime attribute in **anime_attribute.npy**, save the new mapping information in
** anime_old_to_new_content.pkl and anime_new_to_old_content.npy**
#### Step 4: Define Helper function
see **helper_func.py**
</br>
Helper function help us quickly find the mapping between new id and old id. Also, it reads the rating matrix and know what anime user like given the user id.
### Algorithm Exploration
After preprocessing the data and prepare the rating matrix and anime attribute matrix, we can start our exploration on different algorithms.
#### content-based recommendation
see **model/content_based_recommendation.py**
This file first read anime attribute, and ask for a input of user_id x. It call helper_func to get the index of the anime that user x like, and then compute the cosine similarity of it with each anime. Then 
return the 5 most similar anime.
#### Collabarotive filtering
##### SVD & NMF & KNN
see **surprise_nmf.py**
</br>
We implement these three methods using a python library scikit-surprise. and evaluate these three methods using RMSE and MAE.
##### Funk MF & Regularized MF
see **Tensorflow_MF.py**
</br>
We implement these two methods using tensorflow. After running for 50 epochs, we save the predicted rating matrix as **BestMFModel.npy**
#### Association Rule
##### FP-Growth
see **model/FP Growth.py**
It read the rating matrix but with only **top 30** anime which has the most rating records.(Since it is extremely time-comsuming to run fp-growth with more anime and we cannot get result)
we save the rules in **ruleBase.pkl**
### Ensemble model
The Ensemble can make recommendation based on Collaborative filtering by reading predicted rating matrix. It make recommendation based on content-based filtering by calling content_based_recommendation.
It can make recommendation based on association rule by searching rules in rule base.
User are asked to input his/her id, then we search if we have the previous rating record of this user.If yes, the model can make recommendation based on content-based filtering and collaborative filtering.If no, the user is required to first select some anime he/she like, then we can make recommendation based on content-based filtering and association rule.
**In other words, the model can make recommendation to both users with previous rating record and users without rating records**
