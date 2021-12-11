"""
deprecated
"""

#from sklearn.decomposition import NMF
import numpy as np
from surprise.prediction_algorithms.matrix_factorization import NMF


X = np.load('rating_matrix_reduce10.npy')
'''
print(X)
less_than_zero = X<0
X = X+less_than_zero
print(X)
model = NMF(n_components=10)
W = model.fit_transform(X)
H = model.components_
result = np.dot(W,H)
print(result)
'''
model_surprise = NMF()
model_surprise.fit(X)
W = model_surprise.pu
H = model_surprise.qi
Bu = model_surprise.bu
Bi = model_surprise.bi
print(H.shape,W.shape,Bu.shape,Bi.shape)
#print(W)
