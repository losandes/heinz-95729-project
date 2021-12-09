<p style="align: center;font-size: 20px;"><b>Joke Recommender System</b></p>

## Intro

This [repository](https://github.com/alejandroxag/heinz-95729-project/tree/main/api/ml-jokes) hosts the code corresponding to the final project developed by Brenda Palma and Alejandro Alvarez, for the CMU's [E-Commerce Tech Course](https://github.com/losandes/heinz-95729).

The aim of this project is to explore different approaches for a joke recommender system, using the [Jester Datasets for Recommender Systems and Collaborative Filtering Research](http://eigentaste.berkeley.edu/dataset/).

Three differenc approaches were explored:

1. [Content-Based Filtering](https://github.com/alejandroxag/heinz-95729-project/blob/main/api/ml-jokes/nbs/cba_recommendation.ipynb)
2. [Collaborative Filtering](https://github.com/alejandroxag/heinz-95729-project/blob/main/api/ml-jokes/nbs/collaborative_filtering.ipynb)
3. [Ensemble](https://github.com/alejandroxag/heinz-95729-project/blob/main/api/ml-jokes/nbs/ensemble.ipynb)

This project was developed using `python 3.8.2`. To execute any piece of code contained in this repository, please do so within the [conda environment](https://github.com/alejandroxag/heinz-95729-project/blob/main/api/ml-jokes/environment.yml) that was preset for this purpose.

## Repository structure

This repository is integrated by three main directories:

1. [`data`](https://github.com/alejandroxag/heinz-95729-project/tree/main/api/ml-jokes/data): Raw files containing the [Jester Datasets for Recommender Systems and Collaborative Filtering Research](http://eigentaste.berkeley.edu/dataset/).
2. [`mljokes`](https://github.com/alejandroxag/heinz-95729-project/tree/main/api/ml-jokes/mljokes): Common-use python scripts (`.py`) that contain functions used by the different `git` branches, for different tasks.
3. [`nbs`](https://github.com/alejandroxag/heinz-95729-project/tree/main/api/ml-jokes/nbs): `Jupyter` notebooks (`.ipynb`) containing the modeling stages of the project.

### `data`

The data used for this project consists of:

1. 100 `.html` files containing the text of 100 jokes of the Jester Dataset.
2. 4M+ ratings given by each user from a group of 70K+ users, to a subset of the 100 jokes, stored in three `.xls` files. 

### `mljokes`

There are three `.py` files in this directory. [`cf_utils.py`](https://github.com/alejandroxag/heinz-95729-project/blob/main/api/ml-jokes/mljokes/cf_utils.py) contains the auxiliary functions to build the collaborative filtering system; [`topics.py`](https://github.com/alejandroxag/heinz-95729-project/blob/main/api/ml-jokes/mljokes/topics.py) contains the functions used to perform topic modelling analysis, which is used for the content-based system; and finally, [`data.py`](https://github.com/alejandroxag/heinz-95729-project/blob/main/api/ml-jokes/mljokes/data.py) has the code used to extract and clean the information from the `data` subdirectory.

### `nbs`

This subdirectory contains the following `Jupyter` notebooks:

* [`cba_recommendation.ipynb`](https://github.com/alejandroxag/heinz-95729-project/blob/main/api/ml-jokes/nbs/cba_recommendation.ipynb) notebook, used to preliminary explore the content-based approach, framed as a rating-prediction regression proble,

* [`collaborative_filtering.ipynb`](https://github.com/alejandroxag/heinz-95729-project/blob/main/api/ml-jokes/nbs/collaborative_filtering.ipynb) notebook, which contains all the modelling work related to de collaborative filtering approach.

* [`content_based_filtering_optuna.ipynb`](https://github.com/alejandroxag/heinz-95729-project/blob/main/api/ml-jokes/nbs/content_based_filtering_optuna.ipynb) notebook, in which a content-based final model is defined and tuned using the automatic parameter optimization software [Optuna](https://optuna.org/).

* [`ensemble.ipynb`](https://github.com/alejandroxag/heinz-95729-project/blob/main/api/ml-jokes/nbs/ensemble.ipynb) notebook, containing the work related to ensembling both content-based and collaborative filtering models.

## Recommender Systems

Three different approaches were used to build the joke recommender systems.

### Content-based filtering (CBF)

This content-based filtering approach consists in predicting each user <img src="https://render.githubusercontent.com/render/math?math=i"> gave to each joke <img src="https://render.githubusercontent.com/render/math?math=j">, using two types of features:

1. Joke <img src="https://render.githubusercontent.com/render/math?math=j"> topic distribution (topics extracted using LDA).
2. User preferences per topic, built as the average score given by each user to each topic. In particular, the preference of user <img src="https://render.githubusercontent.com/render/math?math=i"> for topic <img src="https://render.githubusercontent.com/render/math?math=k"> was calculated as 
   <p align="center"><img src="https://render.githubusercontent.com/render/math?math=\frac{1}{10\times \left|J_i\right|}\sum_{j\in J_i} r_{ji}\times t_{jk}"></p>

   where <img src="https://render.githubusercontent.com/render/math?math=i"> is the set of jokes that user <img src="https://render.githubusercontent.com/render/math?math=J_i"> rated, and that was used for the training stage; <img src="https://render.githubusercontent.com/render/math?math=i"> is the rating user <img src="https://render.githubusercontent.com/render/math?math=r_{ji}"> gave to joke <img src="https://render.githubusercontent.com/render/math?math=j"> within <img src="https://render.githubusercontent.com/render/math?math=J_i">; and, <img src="https://render.githubusercontent.com/render/math?math=t_{jk}"> is the LDA-score of joke <img src="https://render.githubusercontent.com/render/math?math=j"> corresponding to topic <img src="https://render.githubusercontent.com/render/math?math=k">.

With such inputs, the problem solved was predicting raitings <img src="https://render.githubusercontent.com/render/math?math=r_{ij}"> given by each user <img src="https://render.githubusercontent.com/render/math?math=i"> to each joke <img src="https://render.githubusercontent.com/render/math?math=j">. The algorithm used to address this problem was a [Histogram Gradient Boosting ensemble](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.HistGradientBoostingRegressor.html); the hyperparameter tuning stage was carried out using [Optuna](https://optuna.org/).

### Collaborative filtering (CF)

The collaborative filtering approach in this case was the Matrix Factorization algorithm known as [Singluar Value Decomposition](https://en.wikipedia.org/wiki/Singular_value_decomposition). This algorithm consists in the decomposition of the matrix <img src="https://render.githubusercontent.com/render/math?math=A_{n_i\times n_j}">, which maps the space of users to the space of jokes (in this case <img src="https://render.githubusercontent.com/render/math?math=n_i"> is the number of users [70K+] and <img src="https://render.githubusercontent.com/render/math?math=n_j"> is the number of jokes [100]) in three factors:

* <img src="https://render.githubusercontent.com/render/math?math=U">: singular matrix that maps users to the space of abstract 'concepts';
* <img src="https://render.githubusercontent.com/render/math?math=S">:  diagonal matrix containing the singular values (eigenvalues) of the matrix <img src="https://render.githubusercontent.com/render/math?math=A"> (each one representing a different 'concept'); and,
* <img src="https://render.githubusercontent.com/render/math?math=V">: singular matrix that abstract 'concepts' to the space of jokes.

In summary, the SVD model generates the singular value decomposition of <img src="https://render.githubusercontent.com/render/math?math=A"> as follows 
    <p align="center"><img src="https://render.githubusercontent.com/render/math?math=A=USV^T"></p>

### CBF-CF Ensemble

The predictions yielded by both content-based and collaborative filtering models were ensembled using an L2-regularized Linear model ([Ridge Regression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html)) without an intercept. The basic idea behind this choice was to build a weighted average of both approaches (using a single weight for each approach), regularizing with the euclidean norm of the weights to improve the model's generalization. Ensemble predictions were built as
    <p align="center"><img src="https://render.githubusercontent.com/render/math?math=r^{ensemble}_{ji} = w^{cb}r^{cb}_{ij} + w^{cf}r^{cf}_{ij}"></p>
    
where <img src="https://render.githubusercontent.com/render/math?math=w^{cb}, w^{cb}"> were estimated with the Ridge linear model.

## (Informal) References

* [Content-based Recommender Systems in Python](https://medium.com/analytics-vidhya/content-based-recommender-systems-in-python-2b330e01eb80)
* [Evaluate Topic Models: Latent Dirichlet Allocation (LDA)](https://towardsdatascience.com/evaluate-topic-model-in-python-latent-dirichlet-allocation-lda-7d57484bb5d0)
* [Histograms for efficient gradient boosting](https://robotenique.github.io/posts/gbm-histogram/)
* [Histogram Gradient Boosting Regressor](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.HistGradientBoostingRegressor.html)
* [How to build a content-based movie recommender system with Natural Language Processing](https://towardsdatascience.com/how-to-build-from-scratch-a-content-based-movie-recommender-with-natural-language-processing-25ad400eb243)
* [Latent Dirichlet Allocation](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.LatentDirichletAllocation.html)
* [NLTK](https://www.nltk.org/)
* [Optuna](https://optuna.org/)
* [Ridge Regression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html)
* [Singular Value Decomposition (SVD) & Its Application In Recommender System](https://surprise.readthedocs.io/en/stable/matrix_factorization.html#surprise.prediction_algorithms.matrix_factorization.SVD)
* [Singular Value decomposition (SVD) in recommender systems for Non-math-statistics-programming wizards](https://medium.com/@m_n_malaeb/singular-value-decomposition-svd-in-recommender-systems-for-non-math-statistics-programming-4a622de653e9)
* [scikit learn Text Feature Extraction](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.LatentDirichletAllocation.html)
* [Surprise](http://surpriselib.com/)
* [Surprise > Matrix Factorization-based algorithms > SVD](https://surprise.readthedocs.io/en/stable/matrix_factorization.html#surprise.prediction_algorithms.matrix_factorization.SVD)
* [Tuning Hyperparameters with Optuna](https://towardsdatascience.com/tuning-hyperparameters-with-optuna-af342facc549)
