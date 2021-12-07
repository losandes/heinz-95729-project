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
from Exceptions import ItemNotInCart, ValueRequestedIsInvalid, OutOfStock, ValueRequestedIsMoreThanAvailableInCart, ValueRequestedIsMoreThanAvailableInStock,ItemNotInPantry, UnitNotFound, InvalidUnit, CardNotFound
from blocks import additemProvideadetailsBlock, startBlock, additemBlock, itemExceptionBlock, removeitemBlock, cancelOrderBlock, viewCartBlock, viewTypesItemBlock, removeitemProvideadetailsBlock, checkoutSuccessfulBlock, checkoutEmptyCartBlock, checkoutNoDebitcardBlock

env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
slack_event_adapter = SlackEventAdapter(os.environ['SIGNING_SECRET'] ,'/slack/events', app)

conn = psycopg2.connect(dbname="testdb", user="johnkim", host="4.tcp.ngrok.io", port="18502")
cur = conn.cursor()

client = slack.WebClient(token=os.environ['SLACK_TOKEN'])

userDict = {}

def checkUser(user_id):
    """Check whether a new session of the user"""
    if user_id not in userDict:
        newUser = user()
        userDict[user_id] = newUser


def getUserData(data):
    """Fetch data from request"""
    return (data.get('user_id'), data.get('user_name'), data.get('channel_id'))


def fetchItemDetails(item):
    """Fetch details of the item from pantry"""
    value = item.lower()
    cur.execute("SELECT stock, price, type, item FROM grocery_inventory WHERE item like '{0}%'".format(str(value)))
    stockResult = cur.fetchall()
    if(len(stockResult) == 0):
        raise ItemNotInPantry

    return (stockResult[0][0], stockResult[0][1], stockResult[0][2], stockResult[0][3])


def viewCartItems(user_id):
    """View items present in the cart"""
    reply = ""

    for key, value in userDict[user_id].userCart.cart.items():
        reply += value.item
        reply += "\t" + str(value.quantity)
        reply += "\t" + value.unit
        reply += "\n"

    return reply 


def viewTypesItems(itemType):
    """View types of a particular item in the pantry"""
    reply = "Types of " + itemType + " available:\n"

    value = itemType.lower()
    cur.execute("SELECT item FROM grocery_inventory WHERE type like '{0}%' AND stock <> 0".format(str(value)))
    stockResult = cur.fetchall()
    if(len(stockResult) == 0):
        raise ItemNotInPantry

    for x in stockResult:
        reply += x[0] + "\n"

    return reply


def categorize(text_arr):
    """Get item name"""
    item = ""
    for i in range(2, len(text_arr)-1):
        item += text_arr[i] + " "

    item += text_arr[len(text_arr)-1]
    return item


def checkUnit(unit, item):
    """Check if the unit mentioned exists"""
    cur.execute("SELECT unit FROM grocery_inventory WHERE item like '{0}%'".format(item.lower()))
    unitResult1 = cur.fetchall()

    if len(unitResult1) != 0 and unit in unitResult1[0][0]:
        return

    cur.execute("SELECT unit FROM grocery_inventory WHERE unit like '{0}%'".format(unit.lower()))
    unitResult2 = cur.fetchall()

    if len(unitResult2) == 0 and len(unitResult1) == 0:
        raise InvalidUnit

    if len(unitResult1) == 0:
        raise ItemNotInPantry

    print(item)
    raise UnitNotFound


def checkCard(user_id):
    """Check if user has a card or not"""
    cur.execute("SELECT * FROM users WHERE username like '{0}'".format(user_id))
    userResult = cur.fetchall()

    if len(userResult) != 1:
        raise CardNotFound


def DBcardupdate(user_id, cardNumber):
    """Updates existing user card details"""
    cur.execute("UPDATE users SET card_num = '"+cardNumber+"' WHERE username = '"+user_id+"'")
    cur.execute("COMMIT")


def DBcardcreate(user_id, cardNumber):
    """Creates card details for a new user"""
    cur.execute("INSERT INTO users (username, card_num) VALUES ('"+user_id+"',  '"+cardNumber+"')")
    cur.execute("COMMIT")


def fetchurl(item):
    cur.execute("SELECT url FROM grocery_inventory WHERE item like '{0}%'".format(item))
    urlResult = cur.fetchall()

    return urlResult[0][0]


@app.route('/start', methods=['POST'])
def start_bot():
    """To test if bot is working or not"""
    user_id, user_name, channel_id = getUserData(request.form)
    checkUser(user_id)

    #client.chat_postEphemeral(channel=channel_id, text=f"Hello!", user=user_id)

    reply =  startBlock(user_name)
        
    client.chat_postMessage(channel=channel_id, blocks = reply)
    return Response(), 200


@app.route('/addItem' , methods=['POST'])
def add():
    """Adds item when sent through slash command"""
    user_id, user_name, channel_id = getUserData(request.form)
    checkUser(user_id)

    command_text = request.form.get('text')
    command_text = command_text.split(' ')
    reply = ""

    # if user does not specify item, unit or quantity to add
    if len(command_text) < 3 or command_text[0].isdigit() != True:
        reply = additemProvideadetailsBlock()

        client.chat_postMessage(channel=channel_id, blocks = reply)
        return Response(), 200

    # if user specifies items, unit and quantity to add
    elif len(command_text) > 2:
        try:
            quantity = command_text[0]
            unit = command_text[1]
            item = categorize(command_text)
            checkUnit(unit, item)
            stock, pricePerUnit, type, item = fetchItemDetails(item)

            userDict[user_id].userCart.addItem(item, pricePerUnit, stock, unit, type, int(quantity))
            url = fetchurl(item)
            reply = additemBlock(quantity, unit, item, url)

            client.chat_postMessage(channel=channel_id, blocks = reply)
            return Response(), 200

        except ValueRequestedIsInvalid:
            reply = "Please enter a valid input."
    
        except OutOfStock:
            reply = "Sorry "+user_name+"! We are out of "+item

        except ItemNotInCart:
            reply = "Sorry "+user_name+"! But the requested item is not in your cart. Please view your cart again!"

        except ValueRequestedIsMoreThanAvailableInStock:
            reply = "Sorry "+user_name+"! But the value requested item is more than the items present in stock. Please enter a smaller value!"
        
        except ItemNotInPantry:
            reply = "Sorry "+user_name+"! But either the spelling is wrong or the item is currently unavailable.\nPlease view types of items you want to check."

        except UnitNotFound:
            cur.execute("SELECT unit FROM grocery_inventory WHERE item like '{0}%'".format(item.lower()))
            reply = "Sorry "+user_name+"! But please mention "+item+" in "+cur.fetchall()[0][0]

        except InvalidUnit:
            reply = "Sorry "+user_name+"! But please mention a valid unit."

    client.chat_postMessage(channel=channel_id, blocks=itemExceptionBlock(reply))
    return Response(), 200


@app.route('/removeItem' , methods=['POST'])
def remove():
    """Removes item when sent through slash command"""
    user_id, user_name, channel_id = getUserData(request.form)
    checkUser(user_id)

    command_text = request.form.get('text')
    command_text = command_text.split(' ')
    reply = ""

    # if user does not specify item, unit or quantity to remove
    if len(command_text) < 3 or command_text[0].isdigit() != True:
        reply = removeitemProvideadetailsBlock()

        client.chat_postMessage(channel=channel_id, blocks = reply)
        return Response(), 200

    # if user specifies items, unit and quantity to remove
    elif len(command_text) > 2:
        try:
            quantity = command_text[0]
            unit = command_text[1]
            item = categorize(command_text)
            checkUnit(unit, item)
            stock, pricePerUnit, type, item = fetchItemDetails(item)

            userDict[user_id].userCart.removeItem(item, pricePerUnit, stock, unit, type, int(quantity))
            url = fetchurl(item)
            client.chat_postMessage(channel=channel_id, blocks = removeitemBlock(quantity, unit, item, url))
            return Response(), 200
        
        except ValueRequestedIsInvalid:
            reply = "Please enter a valid input."

        except ItemNotInCart:
            reply = "Sorry "+user_name+"! But the requested item is not in your cart. Please view your cart again!"

        except ValueRequestedIsMoreThanAvailableInCart:
            reply = "Sorry "+user_name+"! But the value requested is more than the value present in your cart. Please view your cart again!"
        
        except ItemNotInPantry:
            reply = "Sorry "+user_name+"! But either the spelling is wrong or the item is currently unavailable.\nPlease view types of items you want to check."

        except UnitNotFound:
            cur.execute("SELECT unit FROM grocery_inventory WHERE item like '{0}%'".format(item.lower()))
            reply = "Sorry "+user_name+"! But please mention "+item+" in "+cur.fetchall()[0][0]
        
        except InvalidUnit:
            reply = "Sorry "+user_name+"! But please mention a valid unit."


    client.chat_postMessage(channel=channel_id, blocks=itemExceptionBlock(reply))
    return Response(), 200


@app.route('/cancelOrder' , methods=['POST'])
def delete():
    """Cancels order when sent through slash command"""
    user_id, user_name, channel_id = getUserData(request.form)
    checkUser(user_id)

    userDict[user_id].userCart.cancelOrder()

    client.chat_postMessage(channel=channel_id, blocks=cancelOrderBlock())
    return Response(), 200


@app.route('/viewCart' , methods=['POST'])
def viewCart():
    """View cart when sent through slash command"""
    user_id, user_name, channel_id = getUserData(request.form)
    checkUser(user_id)

    text = viewCartItems(user_id)

    client.chat_postMessage(channel=channel_id, blocks=viewCartBlock(text))
    return Response(), 200


@app.route('/viewTypes' , methods=['POST'])
def viewTypes():
    """View types of item when sent through slash command"""
    user_id, user_name, channel_id = getUserData(request.form)
    checkUser(user_id)

    itemType = request.form.get('text')

    try:
        text = viewTypesItems(itemType)

    except ItemNotInPantry:
        reply = "Sorry! But either the spelling is wrong or the item is currently unavailable.\nPlease view items in the pantry to check."
        client.chat_postMessage(channel=channel_id, blocks=itemExceptionBlock(reply))
        return Response(), 200

    client.chat_postMessage(channel=channel_id, blocks=viewTypesItemBlock(text))
    return Response(), 200


@app.route('/checkout' , methods=['POST'])
def checkout():
    """checkout items when sent through slash command"""
    user_id, user_name, channel_id = getUserData(request.form)
    checkUser(user_id)
    if len(userDict[user_id].userCart.cart) == 0:
        client.chat_postMessage(channel=channel_id, blocks=checkoutEmptyCartBlock())
        return Response(), 200

    try:
        checkCard(user_id)
    
    except CardNotFound:
        client.chat_postMessage(channel=channel_id, blocks=checkoutNoDebitcardBlock())
        return Response(), 200

    client.chat_postMessage(channel=channel_id, blocks=checkoutSuccessfulBlock())
    userDict[user_id].userCart = modelCart()
    return Response(), 200


@app.route('/addcarddetails' , methods=['POST'])
def addCardDetails():
    """Adds card details to Database"""
    user_id, user_name, channel_id = getUserData(request.form)
    checkUser(user_id)

    cardNumber = request.form.get('text')
    try:
        checkCard(user_id)
    
    except CardNotFound:
        DBcardcreate(user_id, cardNumber)
        client.chat_postMessage(channel=channel_id, text="Card updated successfully!\nPlease proceed to checkout.")
        return Response(), 200

    DBcardupdate(user_id, cardNumber)
    client.chat_postMessage(channel=channel_id, text="Card updated successfully!\nPlease proceed to checkout.")
    return Response(), 200


@app.route('/webhook', methods=['POST'])
def webhook():
    """Handles requests from dialogFlow"""
    req = request.get_json(force=True)

    user_id = req['originalDetectIntentRequest']['payload']['data']['event']['user']
    channel_id = req['originalDetectIntentRequest']['payload']['data']['event']['channel']
    parameters = req['queryResult']['parameters']
    if 'itemType' in parameters.keys():
        item = parameters['itemType']
    
    checkUser(user_id)

    reply = ""
    
    try:

        if parameters['action'].casefold() == 'add'.casefold() or parameters['action'].casefold() == 'remove'.casefold():
            webhookAddRemove(parameters, user_id, channel_id)
            return Response(), 200

        elif parameters['action'].casefold() == 'view'.casefold() or parameters['action'].casefold() == 'show'.casefold() or parameters['action'].casefold() == 'list'.casefold() or parameters['action'].casefold() == 'display'.casefold():
            webhookView(parameters, user_id, channel_id)
            return Response(), 200

        elif parameters['action'].casefold() == 'cancel'.casefold() or parameters['action'].casefold() == 'delete'.casefold():
            if parameters['target'].casefold() == 'cart'.casefold():
                userDict[user_id].userCart.cancelOrder()
                client.chat_postMessage(channel=channel_id, blocks=cancelOrderBlock())
                return Response(), 200
        elif parameters['action'].casefold() == 'checkout'.casefold():
            webhookCheckout(user_id, channel_id)
            return Response(), 200

    except ValueRequestedIsInvalid:
        reply = "Please enter a valid input."
    
    except OutOfStock:
        reply = "Sorry! We are out of "+item

    except ItemNotInCart:
        reply = "Sorry! But the requested item is not in your cart. Please view your cart again!"

    except ValueRequestedIsMoreThanAvailableInStock:
        reply = "Sorry! But the value requested item is more than the items present in stock. Please enter a smaller value!"
        
    except ItemNotInPantry:
        reply = "Sorry! But either the spelling is wrong or the item is currently unavailable.\nPlease view types of items you want to check."

    except ValueRequestedIsMoreThanAvailableInCart:
        reply = "Sorry! But the value requested is more than the value present in your cart. Please view your cart again!"
    
    except UnitNotFound:
        cur.execute("SELECT unit FROM grocery_inventory WHERE item like '{0}%'".format(item.lower()))
        reply = "Sorry! But please mention "+item+" in "+cur.fetchall()[0][0]

    except InvalidUnit:
        reply = "Sorry! But please mention a valid unit."
        
    client.chat_postMessage(channel=channel_id, blocks=itemExceptionBlock(reply))
    return Response(), 200


def webhookAddRemove(parameters, user_id, channel_id):
    """Add and remove commands through dialogFlow"""
    if 'target' not in parameters.keys():
        item = parameters['itemType']
        unit = parameters['unit']

        checkUnit(unit, item)
        quantity = parameters['number']
        stock, pricePerUnit, type, item = fetchItemDetails(item)

    if parameters['action'].casefold() == 'add'.casefold():
        userDict[user_id].userCart.addItem(item, pricePerUnit, stock, unit, type, quantity)
        url = fetchurl(item)
        block = additemBlock(str(int(quantity)), unit, item, url)

    elif parameters['action'].casefold() == 'remove'.casefold():
        if 'target' in parameters.keys() and parameters['target'].casefold() == 'cart'.casefold():
            userDict[user_id].userCart.cancelOrder()
            block = cancelOrderBlock()

        else:
            userDict[user_id].userCart.removeItem(item, pricePerUnit, stock, unit, type, quantity)
            url = fetchurl(item)
            block = removeitemBlock(str(int(quantity)), unit, item, url)

    client.chat_postMessage(channel=channel_id, blocks = block)
    


def webhookView(parameters, user_id, channel_id):
    """View commands through dialogFlow"""
    if not parameters['itemType'] or parameters['target'].casefold() == 'cart'.casefold():
        text = viewCartItems(user_id)
        block = viewCartBlock(text)
            
    else:
        text = viewTypesItems(parameters['itemType'])
        block = viewTypesItemBlock(text)
    
    client.chat_postMessage(channel=channel_id, blocks = block)
    

def webhookCheckout(user_id, channel_id):
    """checkout items when sent through slash command"""
    checkUser(user_id)
    if len(userDict[user_id].userCart.cart) == 0:
        client.chat_postMessage(channel=channel_id, blocks=checkoutEmptyCartBlock())
        return Response(), 200

    client.chat_postMessage(channel=channel_id, blocks=checkoutSuccessfulBlock())
    userDict[user_id].userCart = modelCart()
    return Response(), 200


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

#Execute a query
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'")
records = cur.fetchall()

print(records)

cur.execute("SELECT * FROM users")
#Retrieve query results
records = cur.fetchall()

print(records)

if __name__ == "__main__":
    app.run(debug=True)