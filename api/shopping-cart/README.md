# Cart

#### This section provides an example for documenting a cart data-type.

Shopping-cart `/carts` of any type have the following schema:

| Property          | Type     | Description                                    |
|-------------------|----------|------------------------------------------------|
| _id               | ObjectID | The unique identifier                          |
| uid               | string   | A unique human-readable identifier             |
| item             | array of Json object | An item object to tract each item in the cart (item name, quantity, price and item_uid) |
| total       | number   | Total price of the cart (decimal to 2 places)  |


> # Example Cart

```json
[{
   "_id": "5de0a549186fb55897f67fdd",
   "uid": "some_complex_uid3",
   "total": "80.92",
   "items": [
       {
           "name": "new book 11",
           "quantity": 2,
           "price": 20.23,
           "item_uid": "some_item_uid_63"
       },
       {
           "name": "new book 11",
           "quantity": 2,
           "price": 20.23,
           "item_uid": "some_item_uid"
       }
   ]
}]
```



## Add To Cart `POST`

This endpoint add to cart: `/carts/add`.

> # Example Request

```endpoint
Method => POST
Payload => {
	"name": "new book 11",
	"quantity": 2,
	"price": 20.23,
	"uid": "some_complex_uid3",
	"item_uid": "some_item_uid"
}
```

> # Example Response `200`

```json
[{
   "_id": "5de0a549186fb55897f67fdd",
   "uid": "some_complex_uid3",
   "total": "80.92",
   "items": [
       {
           "name": "new book 11",
           "quantity": 2,
           "price": 20.23,
           "item_uid": "some_item_uid_63"
       },
       {
           "name": "new book 11",
           "quantity": 2,
           "price": 20.23,
           "item_uid": "some_item_uid"
       }
   ]
}]
```



## Update Cart 

### Update Item Quantity `PUT`

This endpoint update item quantity: ` /carts/update-quantity`.

> ## Example Request

```endpoint
Method => PUT
Payload => {
	"quantity": 4,
	"uid": "some_complex_uid3",
	"item_uid": "some_item_uid_63"
}

```

> ## Example Response `200`

```json
[{
   "_id": "5de0a549186fb55897f67fdd",
   "uid": "some_complex_uid3",
   "total": "121.38",
   "items": [
       {
           "name": "new book 11",
           "quantity": 4,
           "price": 20.23,
           "item_uid": "some_item_uid_63"
       },
       {
           "name": "new book 11",
           "quantity": 2,
           "price": 20.23,
           "item_uid": "some_item_uid"
       }
   ]
}]
```

### Delete Cart Item `POST`

This endpoint deletes item: ` /carts/delete-item`.

> ## Example Request

```endpoint
Method => POST
Payload => {
	"uid": "some_complex_uid",
	"item_uid": "some_item_uid_43"
}
```

> ## Example Response `200`

```json
[{
   "_id": "5de0a549186fb55897f67fdd",
   "uid": "some_complex_uid3",
   "total": "40.46",
   "items": [
       {
           "name": "new book 11",
           "quantity": 2,
           "price": 20.23,
           "item_uid": "some_item_uid"
       }
   ]
}]
```

### Delete Entire Cart  `DELETE`

This endpoint delete the whole cart, by user id ` /carts/delete/:user_id
`.

> ## Parameters

| Name    | Type   | Description                        |
| ------- | ------ | ---------------------------------- |
| user_id | string | The human readable uid of the user |

> ## Example Response `200`

```json
{
   "messages": [
       "Cart deleted successfully"
   ]
}
```



## Get Cart `GET`

This endpoint retrieves carts , by user id ` /carts/:user_id`.

> # Parameters

| Name    | Type   | Description                        |
| ------- | ------ | ---------------------------------- |
| user_id | string | The human readable uid of the user |

> # Example Response `200`

```json
 [{
   "_id": "5de0a549186fb55897f67fdd",
   "uid": "some_complex_uid3",
   "total": "40.46",
   "items": [
       {
           "name": "new book 11",
           "quantity": 2,
           "price": 20.23,
           "item_uid": "some_item_uid"
       }
   ]
}]
```



# Cart.js Source

The Cart module is a base/generic object to represent carts. The Order module is a subtype polymorphism example for Cart.

In Cart Module, a `db` property on the `Cart` constructor. Note that `Cart.db` is static.

The `db` property on the `Cart` provides instructions to our repository module, so it knows what collection to store the data in (`Cart.db.collection`), and what properties should be indexed, to improve query performance (`Cart.db.indexes`). Collections are to MongoDB what tables are to SQL Server.



# cartsRepo.js
The productRepo is a service module that can be used to query the database. It is set up to query a single collection: carts.
