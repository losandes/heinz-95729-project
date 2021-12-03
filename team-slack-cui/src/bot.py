import slack
import os
import sys
import json
import psycopg2

from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, request, Response
from slackeventsapi import SlackEventAdapter
from pathlib import Path

sys.path.append(str(Path(sys.path[0]).parent)+'\\model')
from modelCart import modelCart
from user import user

env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
slack_event_adapter = SlackEventAdapter(os.environ['SIGNING_SECRET'] ,'/slack/events', app)

#conn = psycopg2.connect(dbname="testdb", user="johnkim", port="5433")
#cur = conn.cursor()


client = slack.WebClient(token=os.environ['SLACK_TOKEN'])

userDict = {}

#AN EXAMPLE CODE TO POST MESSAGES THROUGH SLACK BOT
#client.chat_postMessage(channel = '#slack-cui', text = "Hello World!")

#AN EXAMPLE CODE TO HANDLE END POINTS FOR SLASH COMMANDS THROUGH SLACK BOT
@app.route('/start', methods=['POST'])
def start_bot():
    data = request.form
    
    user_id = data.get('user_id')
    channel_id = data.get('channel_id')

    client.chat_postEphemeral(channel=channel_id, text=f"Hello!", user=user_id)
    #client.chat_postMessage(channel=channel_id, text=f"Hello {user_id}!")

    if user_id not in userDict:
        newUser = user()
        userDict[user_id] = newUser
    return Response(), 200


@app.route('/add' , methods=['POST'])
def add():
    user_id = request.data.get('user_id')
    if user_id not in userDict:
        newUser = user()
        userDict[user_id] = newUser

    command_text = request.data.get('text')
    command_text = command_text.split(' ')

    # if user does not specify item or quantity to add
    if len(command_text) == 1:
      # mentions the quantity first
      if isinstance(command_text[0], int):
          response_body = {'text': 'Please specify the items you want to add'}

      # mentions the item first
      elif isinstance(command_text[0], str):
          response_body = {'text': 'Please specify the amount you want to add'}

    # if user specifies both items and quantity to add
    elif len(command_text) > 1:
        arr = categorize(command_text)
        item, quantity = arr[0], arr[1]

    response = jsonify(response_body)
    response.status_code = 200
    return response


def categorize(text_arr):
    quantity = 0
    item = ""
    for specific in text_arr:
        if isinstance(specific, int):
            quantity = specific
        else:
            item += specific
    return [item, quantity]


@app.route('/webhook', methods=['POST'])
def webhook():
    req = request.get_json(force=True)

    user_id = req['originalDetectIntentRequest']['payload']['data']['event']['user']

    if user_id not in userDict:
        print("New User: "+user_id)
        newUser = user()
        userDict[user_id] = newUser

    else:
        print("User: "+user_id)

    parameters = req['queryResult']['parameters']
    reply = req['queryResult']['fulfillmentText']

    if parameters['action'].casefold() == 'add'.casefold() or parameters['action'].casefold() == 'remove'.casefold():
        item = parameters['itemType']
        pricePerUnit = 2.0 
        stock = 20.0
        unit = parameters['unit']
        type = 'milk' 
        quantity = parameters['number']
        print("Request: " + item+"\t"+ str(pricePerUnit)+"\t"+ str(stock)+"\t"+ unit+"\t"+ type+"\t"+ str(quantity)+"\n\n")

        if parameters['action'].casefold() == 'add'.casefold():
            userDict[user_id].userCart.addItem(item, pricePerUnit, stock, unit, type, quantity)

            print( "Added: "+ userDict[user_id].userCart.cart[item].item+"\t"+ str(userDict[user_id].userCart.cart[item].pricePerUnit)+"\t"+
            str(userDict[user_id].userCart.cart[item].stock)+"\t"+ userDict[user_id].userCart.cart[item].unit+"\t"+ userDict[user_id].userCart.cart[item].type
            +"\t"+ str(userDict[user_id].userCart.cart[item].quantity)+"\n\n")

        elif parameters['action'].casefold() == 'remove'.casefold():
            userDict[user_id].userCart.removeItem(item, pricePerUnit, stock, unit, type, quantity)

            print( "Removed: "+ userDict[user_id].userCart.cart[item].item+"\t"+ str(userDict[user_id].userCart.cart[item].pricePerUnit)+"\t"+
            str(userDict[user_id].userCart.cart[item].stock)+"\t"+ userDict[user_id].userCart.cart[item].unit+"\t"+ userDict[user_id].userCart.cart[item].type
            +"\t"+ str(userDict[user_id].userCart.cart[item].quantity)+"\n\n")


    return {
        'fulfillmentText': reply + "\n" + json.dumps(parameters)
    }


# Execute a query
# cur.execute("SELECT * FROM my_data")

# Retrieve query results
# records = cur.fetchall()


if __name__ == "__main__":
    app.run(debug=True)