import pandas as pd
from sklearn.metrics.pairwise import linear_kernel


def get_matrix(df):
    df['features'] = df['features'].apply(lambda x: x.split(" "))
    s = df['features'].explode()
    df = df[['id', 'name', 'region']].join(pd.crosstab(s.index, s))
    return df


def get_similarity_matrix(dataset, citydata):
    cosine_similarities = linear_kernel(dataset, citydata)
    return pd.DataFrame(cosine_similarities)


def get_recommendation_matrix(cosine_similarities, dataset, citydata):
    lst = []
    for idx, row in cosine_similarities.iterrows():
        name = dataset.iloc[idx]['id']
        region = dataset.iloc[idx]['region']
        similar_indices = cosine_similarities.iloc[idx].argsort()[:-8:-1]
        similar_items = []
        for i in similar_indices.values:
            if region == 'chicago' and name == i:
                continue
            similar_items.append(citydata.iloc[i]['id'])
        lst.append([name, region, similar_items[0], similar_items[1], similar_items[2],
                                     similar_items[3], similar_items[4], similar_items[5]])
    results = pd.DataFrame(lst, columns=['id', 'region', 'res1', 'res2', 'res3', 'res4', 'res5', 'res6'])
    return results


if __name__=='__main__':
    atlanta = pd.read_csv("data/data/atlanta.txt", delimiter='\t', names=['id', 'name', 'features'])
    boston = pd.read_csv("data/data/boston.txt", delimiter='\t', names=['id', 'name', 'features'])
    chicago = pd.read_csv("data/data/chicago.txt", delimiter='\t', names=['id', 'name', 'features'])
    la = pd.read_csv("data/data/los_angeles.txt", delimiter='\t', names=['id', 'name', 'features'])
    no = pd.read_csv("data/data/new_orleans.txt", delimiter='\t', names=['id', 'name', 'features'])
    ny = pd.read_csv("data/data/new_york.txt", delimiter='\t', names=['id', 'name', 'features'])
    sf = pd.read_csv("data/data/san_francisco.txt", delimiter='\t', names=['id', 'name', 'features'])
    dc = pd.read_csv("data/data/washington_dc.txt", delimiter='\t', names=['id', 'name', 'features'])
    atlanta['region'] = 'atlanta'
    boston['region'] = 'boston'
    chicago['region'] = 'chicago'
    la['region'] = 'los_angeles'
    no['region'] = 'new_orleans'
    ny['region'] = 'new_york'
    sf['region'] = 'san_francisco'
    dc['region'] = 'washington_dc'
    df = pd.concat([atlanta, boston, chicago, la, no, ny, sf, dc], axis=0, ignore_index=True)
    data = get_matrix(df)
    citydata = data[data['region'] == 'chicago']
    matrix = get_similarity_matrix(data.iloc[:, 3:], citydata.iloc[:, 3:])
    results = get_recommendation_matrix(matrix, data, citydata)
    results.to_csv("res/content_based_chicago.csv", index=False)
    print("1")