'''
This file contains three collaborative filtering algorithm: SVD, NMF and KNN
it import the model from scikit-surprise and evaluate the model.
'''

from surprise import SVD
from surprise import NMF
from surprise import KNNBasic
from surprise.model_selection import cross_validate
from surprise import Dataset
from surprise import Reader
import pandas as pd

ratings_data = pd.read_csv('data/rating.csv')
anime_metadata = pd.read_csv('data/anime.csv')
ratings_data = ratings_data[ratings_data['rating']!=-1]
ratings_data = ratings_data.head(1000000)

reader = Reader(rating_scale=(1, 10))
data = Dataset.load_from_df(ratings_data[['user_id', 'anime_id', 'rating']], reader)


# SVD
svd = SVD(verbose=True, n_epochs=50)
cross_validate(svd, data, measures=['RMSE', 'MAE'], cv=3, verbose=True)

# NMF
nmf = NMF(verbose=True,n_epochs=50)
cross_validate(nmf,data,measures=['RMSE'],cv=3,verbose=True)

# KNN
knn = KNNBasic()
cross_validate(knn,data,measures=['RMSE'],cv=3,verbose=True)