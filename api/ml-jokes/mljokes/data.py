# imports
import os
import pickle
import pandas as pd
from bs4 import BeautifulSoup
import re
from nltk import word_tokenize
from nltk.corpus import stopwords, wordnet as wn
from nltk.stem.wordnet import WordNetLemmatizer

# Run the first time
# nltk.download('stopwords')
# nltk.download('punkt')
# nltk.download('wordnet')

stopwd = stopwords.words('english')

# Utils
def extract_joke(path):
    with open(path) as fp:
        soup = BeautifulSoup(fp, "html.parser")
        text = soup.find('table').get_text()
        text = re.sub('\n', ' ', text)
        text = re.sub('[\s]+', ' ', text)
        return text.strip()

def clean_text(text):
    lemmas = []
    tokens = word_tokenize(text)
    lemmas = [WordNetLemmatizer().lemmatize(token).lower() for token in tokens if token.lower() not in stopwd and re.match('^[\w\s]+$', token)]
    return ' '.join(lemmas)

# Read jokes
def read_jokes(path_jokes='./data/jokes'):
    jokes = []
    jokes_clean = []
    jokes_len = []


    for file in os.listdir(path_jokes):
        text = extract_joke(path_jokes+'/'+file)
        clean = clean_text(text) 
        jokes.append(text)
        jokes_clean.append(clean)
        jokes_len.append(len(text.split()))

    return pd.DataFrame({'text': jokes, 
                         'clean_text': jokes_clean, 
                         'len': jokes_len})

# Read ratings
def read_ratings(path_ratings='./data/ratings'):
    ratings = pd.DataFrame()
    
    for file in os.listdir(path_ratings):
        filename = path_ratings+'/' + file
        print(filename)
        temp = pd.read_excel(filename,header=None)
        ratings = pd.concat([ratings, temp], ignore_index=True)

    ratings.rename(columns= {0: 'count_rated'}, inplace=True)
    
    return ratings


def load_test_idx():
    with open('./data/test_idx.pkl', 'rb') as f:
        test_idx = pickle.load(f)
    return test_idx
