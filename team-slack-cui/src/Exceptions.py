class OutOfStock(Exception):
    """Raised when the item requested is out of stock"""
    pass

class ValueRequestedIsInvalid(Exception):
    """Raised when the quantity of item requested is invalid"""
    pass

class ValueRequestedIsMoreThanAvailableInStock(Exception):
    """Raised when the quantity of item requested is more than the 
    amount present in stock"""
    pass

class ValueRequestedIsMoreThanAvailableInCart(Exception):
    """Raised when the quantity of item requested is more than the 
    amount present in stock"""
    pass

class ItemNotInCart(Exception):
    """Raised when the quantity of item requested is more than the 
    amount present in stock"""
    pass