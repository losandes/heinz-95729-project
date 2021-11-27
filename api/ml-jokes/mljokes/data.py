# imports
import os
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
        temp = pd.read_excel(filename,header=None)
        ratings = pd.concat([ratings, temp], ignore_index=True)

    ratings.rename(columns= {0: 'count_rated'}, inplace=True)
    ratings.reset_index(inplace=True)
    ratings.rename(columns={'index': 'user_id'}, inplace=True)
    ratings.drop(columns='count_rated', inplace=True)
    ratings = pd.melt(ratings, 
                      id_vars=['user_id'],
                      var_name='joke_id',
                      value_vars=ratings.columns[1:],
                      value_name='rating')

    ratings.sort_values(by=['user_id', 'joke_id'], inplace=True)
    ratings.reset_index(drop=True, inplace=True)

    test_users = \
        [1229, 1231, 1237, 1249, 1259, 1277, 1279, 1283, 1289, 1291, 1297, 1301, 1303, 1307, 1319, 1321, 1327, 1361, 1367, 1373,
        1381, 1399, 1409, 1423, 1427, 1429, 1433, 1439, 1447, 1451, 1453, 1459, 1471, 1481, 1483, 1487, 1489, 1493, 1499, 1511,
        1523, 1531, 1543, 1549, 1553, 1559, 1567, 1571, 1579, 1583, 1597, 1601, 1607, 1609, 1613, 1619, 1621, 1627, 1637, 1657,
        1663, 1667, 1669, 1693, 1697, 1699, 1709, 1721, 1723, 1733, 1741, 1747, 1753, 1759, 1777, 1783, 1787, 1789, 1801, 1811,
        1823, 1831, 1847, 1861, 1867, 1871, 1873, 1877, 1879, 1889, 1901, 1907, 1913, 1931, 1933, 1949, 1951, 1973, 1979, 1987]

    ratings.insert(3, 'test_user', ratings.user_id.isin(test_users).astype(int))
    
    return ratings