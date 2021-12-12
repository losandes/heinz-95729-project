import pandas as pd

def read_data(filename):
    df = pd.read_csv(filename, delimiter='\n', names=['content'])
    data = []
    for idx, row in df.iterrows():
        tmp = row['content'].split('\t')
        data.append([tmp[1], tmp[-1]])
    data = pd.DataFrame(data, columns=['user_name', 'res_id'])
    data = data[data['res_id'] != '-1'].dropna(how='any', axis=0)
    return data

def gen_score(data):
    lis = []
    i = 0
    user_lst = data['user_id'].unique().tolist()
    for user in user_lst:
        tmp = data[data['user_id'] == user]
        tmp['rating'] = pd.cut(tmp['count'], bins=5, labels=False) + 1
        lis.insert(i, tmp)
        i += 1
    final_data = pd.concat(lis)
    return final_data

if __name__ == "__main__":
    data1 = read_data('data/session/session.1996-Q3')
    data2 = read_data('data/session/session.1996-Q4')
    data3 = read_data('data/session/session.1997-Q1')
    data4 = read_data('data/session/session.1997-Q2')
    data5 = read_data('data/session/session.1997-Q3')
    data6 = read_data('data/session/session.1997-Q4')
    data7 = read_data('data/session/session.1998-Q1')
    data8 = read_data('data/session/session.1998-Q2')
    data9 = read_data('data/session/session.1998-Q3')
    data10 = read_data('data/session/session.1998-Q4')
    data11 = read_data('data/session/session.1999-Q1')
    data12 = read_data('data/session/session.1999-Q2')

    data = pd.concat([data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12])
    data = pd.DataFrame({'count': data.groupby(['user_name', 'res_id']).res_id.count()}).reset_index()
    data['user_id'] = data.groupby(['user_name']).ngroup()

    data = gen_score(data)
    data.to_csv("../res/session_data_concat.csv", index=False)
