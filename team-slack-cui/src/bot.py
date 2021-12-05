import slack
import os
import sys
import json
import psycopg2

from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, request, Response, jsonify
from slackeventsapi import SlackEventAdapter

sys.path.append(str(Path(sys.path[0]).parent)+'\\model')
from modelCart import modelCart
from user import user
from Exceptions import ItemNotInCart, ValueRequestedIsInvalid, OutOfStock, ValueRequestedIsMoreThanAvailableInCart, ValueRequestedIsMoreThanAvailableInStock,ItemNotInPantry

env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
slack_event_adapter = SlackEventAdapter(os.environ['SIGNING_SECRET'] ,'/slack/events', app)

conn = psycopg2.connect(dbname="testdb", user="johnkim", host="4.tcp.ngrok.io", port="18502")
cur = conn.cursor()


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


@app.route('/addItem' , methods=['POST'])
def add():
    user_id = request.form.get('user_id')
    channel_id = request.form.get('channel_id')

    if user_id not in userDict:
        newUser = user()
        userDict[user_id] = newUser

    command_text = request.form.get('text')
    command_text = command_text.split(' ')
    
    reply = ""
    # if user does not specify item, unit or quantity to add
    if len(command_text) < 3 or command_text[0].isdigit() != True:
        reply = {'text': 'Please mention the correct input format.\nFor example: /add 2 dozen green apples'}

    # if user specifies items, unit and quantity to add
    elif len(command_text) > 1:
        try:
            quantity = command_text[0]
            unit = command_text[1]
            item = categorize(command_text)

            itemDetails = fetchItemDetails(item)
                
            stock = itemDetails[0]
            pricePerUnit = itemDetails[1]
            type = itemDetails[2]

            userDict[user_id].userCart.addItem(item, pricePerUnit, stock, unit, type, int(quantity))

            reply = {'action': 'ADD', 'item': item, 'quantity': quantity, 'unit': unit}

        except ValueRequestedIsInvalid:
            reply = "Please enter a valid input."
    
        except OutOfStock:
            reply = "Sorry, but the requested item is currently out of stock. Please try again later!"

        except ItemNotInCart:
            reply = "Sorry, but the requested item is not in your cart. Please view your cart again!"

        except ValueRequestedIsMoreThanAvailableInStock:
            reply = "Sorry, but the value requested item is more than the items present in stock. Please enter a smaller value!"
        
        except ItemNotInPantry:
            reply = "Sorry, but either the spelling is wrong or the item is currently unavailable.\nPlease view items in the pantry to check."


    client.chat_postMessage(channel=channel_id, text=reply)
    return Response(), 200


@app.route('/removeItem' , methods=['POST'])
def remove():
    user_id = request.form.get('user_id')
    channel_id = request.form.get('channel_id')

    if user_id not in userDict:
        newUser = user()
        userDict[user_id] = newUser

    command_text = request.form.get('text')
    command_text = command_text.split(' ')

    reply = ""

    # if user does not specify item, unit or quantity to remove
    if len(command_text) < 3 or command_text[0].isdigit() != True:
        reply = {'text': 'Please mention the correct input format.\nFor example: /add 2 dozen green apples'}

    # if user specifies items, unit and quantity to remove
    elif len(command_text) > 1:
        try:
            quantity = command_text[0]
            unit = command_text[1]
            item = categorize(command_text)

            itemDetails = fetchItemDetails(item)
                
            stock = itemDetails[0]
            pricePerUnit = itemDetails[1]
            type = itemDetails[2]

            userDict[user_id].userCart.removeItem(item, pricePerUnit, stock, unit, type, int(quantity))

            reply = {'action': 'REMOVE', 'item': item, 'quantity': quantity, 'unit': unit}
        
        except ValueRequestedIsInvalid:
            reply = "Please enter a valid input."

        except ItemNotInCart:
            reply = "Sorry, but the requested item is not in your cart. Please view your cart again!"

        except ValueRequestedIsMoreThanAvailableInCart:
            reply = "Sorry, but the value requested item is more than the value present in your cart. Please view your cart again!"
        
        except ItemNotInPantry:
            reply = "Sorry, but either the spelling is wrong or the item is currently unavailable.\nPlease view items in the pantry to check."


    client.chat_postMessage(channel=channel_id, text=reply)
    return Response(), 200


def categorize(text_arr):
    item = ""
    for i in range(2, len(text_arr)-1):
        item += text_arr[i] + " "

    item += text_arr[len(text_arr)-1]
    return item

@app.route('/cancelOrder' , methods=['POST'])
def delete():
    user_id = request.form.get('user_id')
    channel_id = request.form.get('channel_id')

    if user_id not in userDict:
        newUser = user()
        userDict[user_id] = newUser

    userDict[user_id].userCart.cancelOrder()
    reply = "Your order has been cancelled"

    client.chat_postMessage(channel=channel_id, text=reply)
    return Response(), 200

@app.route('/viewCart' , methods=['POST'])
def viewCart():
    user_id = request.form.get('user_id')
    channel_id = request.form.get('channel_id')

    if user_id not in userDict:
        newUser = user()
        userDict[user_id] = newUser

    reply = viewCart(user_id)

    client.chat_postMessage(channel=channel_id, text=reply)
    return Response(), 200

@app.route('/viewTypes' , methods=['POST'])
def viewTypes():
    user_id = request.form.get('user_id')
    channel_id = request.form.get('channel_id')

    if user_id not in userDict:
        newUser = user()
        userDict[user_id] = newUser

    itemType = request.form.get('text')

    reply = viewTypes(itemType)

    client.chat_postMessage(channel=channel_id, text=reply)
    return Response(), 200

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
    reply = ""
    
    try:

        if parameters['action'].casefold() == 'add'.casefold() or parameters['action'].casefold() == 'remove'.casefold():
            reply = req['queryResult']['fulfillmentText']

            item = parameters['itemType']
            unit = parameters['unit']
            quantity = parameters['number']
            
            itemDetails = fetchItemDetails(item)
            
            stock = itemDetails[0]
            pricePerUnit = itemDetails[1]
            type = itemDetails[2]

            print("Request: " + item+"\t"+ str(pricePerUnit)+"\t"+ str(stock)+"\t"+ unit+"\t"+ type+"\t"+ str(quantity)+"\n\n")

            if parameters['action'].casefold() == 'add'.casefold():
                userDict[user_id].userCart.addItem(item, pricePerUnit, stock, unit, type, quantity)

                print( "Added: "+ userDict[user_id].userCart.cart[item].item+"\t"+ str(userDict[user_id].userCart.cart[item].pricePerUnit)+"\t"+
                str(userDict[user_id].userCart.cart[item].stock)+"\t"+ userDict[user_id].userCart.cart[item].unit+"\t"+ userDict[user_id].userCart.cart[item].type
                +"\t"+ str(userDict[user_id].userCart.cart[item].quantity)+"\n\n")

            elif parameters['action'].casefold() == 'remove'.casefold():
                if parameters['target'].casefold() == 'cart'.casefold():
                    userDict[user_id].userCart.cancelOrder()
                    reply += "Your order has been cancelled"

                else:
                    userDict[user_id].userCart.removeItem(item, pricePerUnit, stock, unit, type, quantity)

                    print( "Removed: "+ userDict[user_id].userCart.cart[item].item+"\t"+ str(userDict[user_id].userCart.cart[item].pricePerUnit)+"\t"+
                    str(userDict[user_id].userCart.cart[item].stock)+"\t"+ userDict[user_id].userCart.cart[item].unit+"\t"+ userDict[user_id].userCart.cart[item].type
                    +"\t"+ str(userDict[user_id].userCart.cart[item].quantity)+"\n\n")

        elif parameters['action'].casefold() == 'view'.casefold() or parameters['action'].casefold() == 'show'.casefold() or parameters['action'].casefold() == 'list'.casefold() or parameters['action'].casefold() == 'display'.casefold():

            if not parameters['itemType'] or parameters['target'].casefold() == 'cart'.casefold():
                reply += viewCart(user_id)
            
            else:
                reply += viewTypes(parameters['itemType'])

        elif parameters['action'].casefold() == 'cancel'.casefold() or parameters['action'].casefold() == 'delete'.casefold():
            if parameters['target'].casefold() == 'cart'.casefold():
                userDict[user_id].userCart.cancelOrder()
                reply += "Your order has been cancelled"

    except ValueRequestedIsInvalid:
        reply = "Please enter a valid input."
    
    except OutOfStock:
        reply = "Sorry, but the requested item is currently out of stock. Please try again later!"

    except ItemNotInCart:
        reply = "Sorry, but the requested item is not in your cart. Please view your cart again!"

    except ValueRequestedIsMoreThanAvailableInStock:
        reply = "Sorry, but the value requested item is more than the items present in stock. Please enter a smaller value!"

    except ValueRequestedIsMoreThanAvailableInCart:
        reply = "Sorry, but the value requested item is more than the value present in your cart. Please view your cart again!"
    
    except ItemNotInPantry:
        reply = "Sorry, but either the spelling is wrong or the item is currently unavailable.\nPlease view items in the pantry to check."

    return {
        'fulfillmentText': reply + "\n" + json.dumps(parameters)
    }

def fetchItemDetails(item):
    value = item.lower()
    cur.execute("SELECT stock, price, type FROM grocery_inventory WHERE item like '{0}'".format(str(value)))
    stockResult = cur.fetchall()
    if(len(stockResult) == 0):
        raise ItemNotInPantry

    print(stockResult)
    print(len(stockResult))
            
    stock = stockResult[0][0]
    pricePerUnit = stockResult[0][1]
    type = stockResult[0][2]

    return [stock, pricePerUnit, type]

def viewCart(user_id):
    reply = "Items you have added to your cart:\n"

    for key, value in userDict[user_id].userCart.cart.items():
        reply += value.item
        reply += "\t" + str(value.quantity)
        reply += "\t" + value.unit
        reply += "\n"

    return reply 

def viewTypes(itemType):
    reply = "Types of " + itemType + " available:\n"

    value = itemType.lower()
    cur.execute("SELECT item FROM grocery_inventory WHERE type like '{0}' AND stock <> 0".format(str(value)))
    stockResult = cur.fetchall()
    if(len(stockResult) == 0):
        raise ItemNotInPantry

    for x in stockResult:
        reply += x[0] + "\n"

    return reply

cur.execute("UPDATE grocery_inventory SET stock = 50 WHERE id = 16")
cur.execute("UPDATE grocery_inventory SET stock = 100 WHERE id = 17")
cur.execute("UPDATE grocery_inventory SET stock = 30 WHERE id = 18")
cur.execute("UPDATE grocery_inventory SET stock = 40 WHERE id = 19")
cur.execute("UPDATE grocery_inventory SET stock = 80 WHERE id = 20")
cur.execute("UPDATE grocery_inventory SET stock = 20 WHERE id = 21")
cur.execute("UPDATE grocery_inventory SET stock = 70 WHERE id = 22")
cur.execute("UPDATE grocery_inventory SET stock = 30 WHERE id = 23")
cur.execute("UPDATE grocery_inventory SET stock = 20 WHERE id = 24")
cur.execute("UPDATE grocery_inventory SET stock = 130 WHERE id = 25")
cur.execute("UPDATE grocery_inventory SET stock = 150 WHERE id = 26")
cur.execute("UPDATE grocery_inventory SET stock = 20 WHERE id = 27")
cur.execute("UPDATE grocery_inventory SET stock = 40 WHERE id = 28")
cur.execute("UPDATE grocery_inventory SET stock = 50 WHERE id = 29")
cur.execute("COMMIT")

#Execute a query
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'grocery_inventory'")
records = cur.fetchall()

print(records)

cur.execute("SELECT * FROM grocery_inventory")
#Retrieve query results
records = cur.fetchall()

print(records)

if __name__ == "__main__":
    app.run(debug=True)