from modelItem import modelItem

class modelCart:
    cart = {}

    def __init__(self):
        self.cart = {}
    
    def addItem(self, item, pricePerUnit, stock, unit, type, quantity):

        if quantity <= 0.0:
            return None
        if quantity > stock:
            return None

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
            return None

        if '{item}' in self.cart.keys():
            stock += quantity
            #UPDATE STOCK IN DB

            existingPurchase = self.cart['{item}']
            if existingPurchase.quantity < quantity:
                return None
            existingPurchase.quantity -= quantity
            purchase = modelItem(item, pricePerUnit, stock, unit, type, existingPurchase.quantity)
            self.cart['{item}'] = purchase
            return self.cart

        return None

        

    def cancelOrder(self):
        self.cart = {}