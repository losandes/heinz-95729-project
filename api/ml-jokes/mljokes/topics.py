# imports
import pandas as pd
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer

# Get topic distribution per joke
def get_lda_topics(text, ids, n_topics=5, random_state=0):
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(text)
    vectorizer.get_feature_names_out()

    # Find latent topics
    lda = LatentDirichletAllocation(n_components=n_topics,random_state=random_state)
    X_topics = lda.fit_transform(X)
    X_topics = pd.DataFrame(X_topics)
    X_topics.insert(0, 'id', ids)

    return X_topics