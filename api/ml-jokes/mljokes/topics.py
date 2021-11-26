# imports
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer

# Get topic distribution per joke
def get_lda_topics(text, n_topics=5, random_state=0):
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(text)
    vectorizer.get_feature_names_out()

    # Find latent topics
    lda = LatentDirichletAllocation(n_components=n_topics,random_state=random_state)
    X_topics = lda.fit_transform(X)

    return X_topics