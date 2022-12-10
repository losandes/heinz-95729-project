from flask import Flask, request, render_template,jsonify
import pandas as pd

app = Flask(__name__)

def readForm():
    df = pd.read_csv('data.csv')

def do_something(text1):
   df = pd.read_csv('~/pythonProject/data/AlcoholContent.csv')
   print(df)
   index = df[df['Name'] == str(text1)].index[0]
   print(index)

   output1 = df['Alcohol content'][index]
   return output1

def getInfo(text):
   df = pd.read_csv('~/pythonProject/data/instructions.csv')
   index = df[df['Name'] == str(text)].index[0]
   return df['Ingredients'][index], df['Instructions'][index], df['Image'][index]

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/getAlcoholContent', methods=['GET','POST'])
def my_form_post():
    text1 = request.form['text1']
    word = request.args.get('text1')
    combine = do_something(text1)
    result = {
        "output": combine
    }
    result = {str(key): value for key, value in result.items()}
    return jsonify(result=result)


@app.route('/getAlcoholInfo', methods=['GET','POST'])
def getAInfo():
    name = request.form['text2']
    ingredient, instruction, image = getInfo(name)
    result = {
        "ingredient": ingredient,
        "instruction": instruction,
        "image": image
    }
    result = {str(key): value for key, value in result.items()}
    return jsonify(result=result)

if __name__ == '__main__':
    app.run(debug=True)

