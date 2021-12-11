import numpy as np
import pyfpgrowth
import pickle


rating_matrix = np.load('../data/rating_matrix_reduce_anime30.npy')
rating_matrix = rating_matrix[:100]
row = len(rating_matrix)
col = len(rating_matrix[0])

transaction = []

for i in range(row):
    tmp = []
    for j in range(col):
        # we think user like this anime if rating is higher or equal to 8
        if rating_matrix[i][j] >= 8:
            tmp.append(j)
    transaction.append(tmp)

print(transaction)
patterns = pyfpgrowth.find_frequent_patterns(transaction, 3)
rules = pyfpgrowth.generate_association_rules(patterns, 0.85)


with open('ruleBase.pkl','wb') as f:
    pickle.dump(rules,f,pickle.HIGHEST_PROTOCOL)


