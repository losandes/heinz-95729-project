from modelItem import modelItem

class OutOfStock(Exception):
    """Raised when the item requested is out of stock"""
    pass

class ValueRequestedIsInvalid(Exception):
    """Raised when the quantity of item requested is more than the 
    amount present in stock"""
    pass

class modelCart:
    cart = {}

    def __init__(self):
        self.cart = {}
    
    def addItem(self, item, pricePerUnit, stock, unit, type, quantity):

        if quantity <= 0.0:
            raise ValueRequestedIsInvalid
        if quantity > stock:
            raise OutOfStock

        stock -= quantity
        #UPDATE STOCK IN DB

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
        if quantity <= 0:
            raise ValueRequestedIsInvalid

        if '{item}' in self.cart.keys():
            stock += quantity
            #UPDATE STOCK IN DB

            existingPurchase = self.cart['{item}']
            if existingPurchase.quantity < quantity:
                return ValueRequestedIsInvalid
            existingPurchase.quantity -= quantity
            purchase = modelItem(item, pricePerUnit, stock, unit, type, existingPurchase.quantity)
            self.cart['{item}'] = purchase
            return self.cart

        return ValueRequestedIsInvalid

        

    def cancelOrder(self):
        self.cart = {}