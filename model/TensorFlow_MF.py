import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
import time
from sklearn import metrics
from sklearn.decomposition import NMF
tf.compat.v1.disable_eager_execution()


X_data = []
Y_data = []

rating_matrix = np.load("rating_matrix1000000.npy")
for i in range(len(rating_matrix)):
    for j in range(len(rating_matrix[0])):
        if rating_matrix[i][j] > 0:
            X_data.append([i,j])
            Y_data.append(rating_matrix[i][j])

X_train, X_test, y_train, y_test = train_test_split(X_data, Y_data, test_size=0.2,random_state=1)
X_train = np.array(X_train)
X_test = np.array(X_test)
y_train = np.array(y_train,dtype='float32')
y_test = np.array(y_test, dtype='float32')
y_test = y_test
y_train = y_train
y_test = y_test.reshape((-1,1))
y_train = y_train.reshape((-1,1))
# train set
R_train = np.hstack((X_train,y_train))
# test set
R_test = np.hstack((X_test,y_test))

rating_matrix_train = [[0 for _ in range(len(rating_matrix[0]))]for _ in range(len(rating_matrix))]
for i in range(len(R_train)):
    #print(R_train[i][0],R_train[i][1])
    rating_matrix_train[int(R_train[i][0])][int(R_train[i][1])] = R_train[i][2]

rating_matrix_train = np.array(rating_matrix_train)
mask = rating_matrix_train>0
mask = np.array(mask,dtype=int)
Ma = rating_matrix_train

K = 10
N=len(Ma[0])
M=len(Ma)

#print(Ma)

P = tf.Variable(tf.random.normal([M,K], stddev=0.35), dtype=tf.float32)
Q = tf.Variable(tf.random.normal([K,N], stddev=0.35), dtype=tf.float32)

R_pred = tf.matmul(P,Q)
loss1 = 1/2 * tf.reduce_sum(tf.square(tf.multiply(tf.matmul(P, Q) - Ma, mask))) +1/2*(tf.reduce_sum(tf.square(P))+tf.reduce_sum(tf.square(Q)))
funkloss = 1/2 * tf.reduce_sum(tf.square(tf.multiply(tf.matmul(P, Q) - Ma, mask)))

# loss function for regularized MF
def loss():
    return 1/2 * tf.reduce_sum(tf.square(tf.multiply(tf.matmul(P, Q) - Ma, mask))) +1/2*(tf.reduce_sum(tf.square(P))+tf.reduce_sum(tf.square(Q)))


# loss function for funk MF
def funk_loss():
    return 1/2 * tf.reduce_sum(tf.square(tf.multiply(tf.matmul(P, Q) - Ma, mask)))


optimizer = tf.optimizers.Adam(0.05)
train = optimizer.minimize(loss,var_list=[P,Q])

init = tf.compat.v1.global_variables_initializer()

sess = tf.compat.v1.Session()
sess.run(init)


Loss = []
Rse = []
time_start = time.time()
# save the best model
best_model = []
mini_rmse = 2**32

for step in range(200):
    sess.run(train)
    loss_function = sess.run(loss1)
    Loss.append(loss_function)
    print(step)
    nP = sess.run(P)
    nQ = sess.run(Q)
    R_MF = np.dot(nP, nQ)
    # less_than_one = R_MF < 1
    # more_than_ten = R_MF > 10
    # R_MF += (-R_MF)*less_than_one+less_than_one
    # R_MF += (-R_MF)*more_than_ten+more_than_ten*10
    y_pred = []
    for i in range(len(R_test)):
        y_pred.append(R_MF[int(R_test[i][0])][int(R_test[i][1])])
    y_pred = np.array(y_pred, dtype='float32')
    y_pred = y_pred.T
    rse = np.sqrt(metrics.mean_squared_error(y_test, y_pred))
    if rse<mini_rmse:
        best_model = R_MF
        mini_rmse = rse
    print("RMSE:", np.sqrt(metrics.mean_squared_error(y_test, y_pred)))
print(y_pred)
time_end = time.time()

best_model = np.array(best_model)
np.save("BestMFModel.npy",best_model)

print(time_end-time_start)






