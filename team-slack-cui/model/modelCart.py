import psycopg2
import sys

from pathlib import Path
from modelItem import modelItem

sys.path.append(str(Path(sys.path[0]).parent)+'\\model')

from Exceptions import ItemNotInCart, ValueRequestedIsInvalid, OutOfStock, ValueRequestedIsMoreThanAvailableInCart, ValueRequestedIsMoreThanAvailableInStock

conn = psycopg2.connect(dbname="testdb", user="johnkim", host="4.tcp.ngrok.io", port="18502")
cur = conn.cursor()



class modelCart:
    cart = {}

    def __init__(self):
        self.cart = {}
    
    def addItem(self, item, pricePerUnit, stock, unit, type, quantity):

        if stock == 0.0:
            raise OutOfStock
        if quantity <= 0.0:
            raise ValueRequestedIsInvalid
        if quantity > stock:
            raise ValueRequestedIsMoreThanAvailableInStock

        stock -= quantity
        #UPDATE STOCK IN DB
        cur.execute("UPDATE grocery_inventory SET stock = {0} WHERE item like '{1}'".format(stock, item.lower()))
        cur.execute("COMMIT")
        cur.execute("SELECT * FROM grocery_inventory")
        records = cur.fetchall()
        print("Post reduction:\n")
        print(records)

        if item in self.cart.keys():
            print("Item exists")
            existingPurchase = self.cart[item]
            existingPurchase.quantity += quantity
            purchase = modelItem(item, pricePerUnit, stock, unit, type, existingPurchase.quantity)
            self.cart[item] = purchase
            return self.cart
        
        print("Item does not exist")
        purchase = modelItem(item, pricePerUnit, stock, unit, type, quantity)
        self.cart[item] = purchase
        return self.cart

    def removeItem(self, item, pricePerUnit, stock, unit, type, quantity):
        if stock == 0.0:
            raise OutOfStock
        if quantity <= 0:
            raise ValueRequestedIsInvalid

        if item in self.cart.keys():
            stock += quantity

            existingPurchase = self.cart[item]
            if existingPurchase.quantity < quantity:
                return ValueRequestedIsMoreThanAvailableInCart

            #UPDATE STOCK IN DB
            cur.execute("UPDATE grocery_inventory SET stock = {0} WHERE item like '{1}'".format(stock, item.lower()))
            cur.execute("COMMIT")
            cur.execute("SELECT * FROM grocery_inventory")
            records = cur.fetchall()
            print("Post increase:\n")
            print(records)

            existingPurchase.quantity -= quantity
            purchase = modelItem(item, pricePerUnit, stock, unit, type, existingPurchase.quantity)
            self.cart[item] = purchase
            return self.cart

        return ItemNotInCart

        

    def cancelOrder(self):
        self.cart = {}