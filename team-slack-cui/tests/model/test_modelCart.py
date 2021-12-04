import pytest
import sys

from pathlib import Path

sys.path.append(str(Path(sys.path[0]).parent.parent)+'\\model')
sys.path.append(str(Path(sys.path[0]).parent.parent)+'\\src')

from modelCart import modelCart
from Exceptions import OutOfStock, ValueRequestedIsInvalid, ValueRequestedIsMoreThanAvailableInCart, ValueRequestedIsMoreThanAvailableInStock, ItemNotInCart

# TESTS FOR ADDING AND ITEM

def test_modelCart_instance():
    userCart = modelCart()

    assert userCart.cart == {}

def test_modelCart_addItem():
    userCart = modelCart()
    userCart.addItem('whole milk', 1, 2, 'carton', 'milk', 2)

    assert userCart.cart == {'whole milk' : userCart.cart['whole milk']}

def test_modelCart_addItem_stockIsZero():
    userCart = modelCart()

    with pytest.raises(OutOfStock):
        userCart.addItem('whole milk', 1, 0, 'carton', 'milk', 2)

def test_modelCart_addItem_invalidQuantity():
    userCart = modelCart()

    with pytest.raises(ValueRequestedIsInvalid):
        userCart.addItem('whole milk', 1, 10, 'carton', 'milk', -2)

def test_modelCart_addItem_moreThanStock():
    userCart = modelCart()

    with pytest.raises(ValueRequestedIsMoreThanAvailableInStock):
        userCart.addItem('whole milk', 1, 1, 'carton', 'milk', 2)

def test_modelCart_addItem_stockDecreases():
    userCart = modelCart()
    userCart.addItem('whole milk', 1, 7, 'carton', 'milk', 2)

    assert userCart.cart['whole milk'].stock == 5

def test_modelCart_addItem_existingItemUpdate():
    userCart = modelCart()
    userCart.addItem('whole milk', 1, 7, 'carton', 'milk', 2)
    userCart.addItem('whole milk', 1, 7, 'carton', 'milk', 3)

    assert userCart.cart['whole milk'].quantity == 5

def test_modelCart_addItem_existingItemCount():
    userCart = modelCart()
    userCart.addItem('whole milk', 1, 7, 'carton', 'milk', 2)
    userCart.addItem('whole milk', 1, 7, 'carton', 'milk', 3)

    assert len(userCart.cart) == 1

def test_modelCart_addItem_newItemCount():
    userCart = modelCart()
    userCart.addItem('whole milk', 1, 7, 'carton', 'milk', 2)
    userCart.addItem('vanilla curd', 1, 7, 'carton', 'curd', 3)

    assert len(userCart.cart) == 2


#TESTS FOR REMOVING AN ITEM

def test_modelCart_removeItem():
    userCart = modelCart()
    userCart.addItem('whole milk', 1, 2, 'carton', 'milk', 2)
    userCart.removeItem('whole milk', 1, 1, 'carton', 'milk', 1)

    assert userCart.cart == {'whole milk' : userCart.cart['whole milk']}

def test_modelCart_removeItem_invalidQuantity():
    userCart = modelCart()

    with pytest.raises(ValueRequestedIsInvalid):
        userCart.removeItem('whole milk', 1, 10, 'carton', 'milk', -2)

def test_modelCart_removeItem_moreThanCart():
    userCart = modelCart()
    userCart.addItem('whole milk', 1, 3, 'carton', 'milk', 2)

    with pytest.raises(ValueRequestedIsMoreThanAvailableInCart):
        userCart.removeItem('whole milk', 1, 1, 'carton', 'milk', 1000)

def test_modelCart_removeItem_itemNotCart():
    userCart = modelCart()

    with pytest.raises(ItemNotInCart):
        userCart.removeItem('abc', 1, 1, 'carton', 'milk', 3)

def test_modelCart_removeItem_stockIncreases():
    userCart = modelCart()
    userCart.addItem('whole milk', 1, 7, 'carton', 'milk', 2)
    userCart.removeItem('whole milk', 1, 5, 'carton', 'milk', 1)

    assert userCart.cart['whole milk'].stock == 6

def test_modelCart_removeItem_existingItemUpdate():
    userCart = modelCart()
    userCart.addItem('whole milk', 1, 7, 'carton', 'milk', 5)
    userCart.removeItem('whole milk', 1, 2, 'carton', 'milk', 3)

    assert userCart.cart['whole milk'].quantity == 2

def test_modelCart_removeItem_existingItemCount():
    userCart = modelCart()
    userCart.addItem('whole milk', 1, 7, 'carton', 'milk', 5)
    userCart.removeItem('whole milk', 1, 2, 'carton', 'milk', 3)

    assert len(userCart.cart) == 1


#TESTS FOR CANCELING ORDER

def test_modelCart_cancelOrder():
    userCart = modelCart()
    userCart.addItem('whole milk', 1, 2, 'carton', 'milk', 2)
    assert len(userCart.cart) == 1

    userCart.cancelOrder()

    assert len(userCart.cart) == 0