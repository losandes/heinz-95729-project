from flask import Flask
import pandas as pd
import json

app = Flask(__name__)

FILE_NAME = 'data_generated_with_links.csv'

def get_data():
    df = pd.read_csv(FILE_NAME, index_col=0)
    # df['link_1'] = df['link_1'].apply(json.loads)
    # df['link_2'] = df['link_2'].apply(json.loads)
    # df['link_3'] = df['link_3'].apply(json.loads)

    df = df[df['link_1'].notnull()]
    print(df)
    df2 = df.to_json(orient = 'records')
    # print(df2)
    parsed = json.loads(df2)
    # print(parsed)
    return parsed

@app.route("/get_all_products")
def get_all_products():
    data = get_data()
    return data

if __name__ == '__main__':
    data = get_data()
    print(data)