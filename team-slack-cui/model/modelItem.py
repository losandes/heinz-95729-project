class modelItem:
    item = ""
    pricePerUnit = 0
    stock = 0
    unit = ""
    type = ""
    quantity = ""

    def __init__(self, item, pricePerUnit, stock, unit, type, quantity):
        self.item = item
        self.pricePerUnit = pricePerUnit
        self.stock = stock
        self.unit = unit
        self.type = type
        self.quantity = quantity