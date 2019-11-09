# Products

#### This section provides an example for documenting a data-type.

Products `/products` of any type have the following schema:

| Property          | Type     | Description                                    |
|-------------------|----------|------------------------------------------------|
| _id               | ObjectID | The unique identifier                          |
| uid               | string   | A unique human-readable identifier             |
| title             | string   | The title of the product                       |
| description       | string   | A description of the product                   |
| price             | number   | The price of the product (decimal to 2 places) |
| thumbnailLink     | string   | the URL for the thumbnail                      |
| type              | string   | the product type: "product"                    |
| metadata.keywords | array    | Terms to improve searching                     |

> # Example Product

```json
{
	"_id": "5623c1263b952eb796d79dfc",
	"uid": "hitchhikers_guide_galaxy",
	"title": "The Hitchhiker's Guide to the Galaxy",
	"description": "Seconds before the Earth is demolished to make way for a galactic freeway, Arthur Dent is plucked off the planet by his friend Ford Prefect, a researcher for the revised edition of The Hitchhiker's Guide to the Galaxy who, for the last fifteen years, has been posing as an out-of-work actor. Together this dynamic pair begin a journey through space aided by quotes from The Hitchhiker's ",
	"metadata": {
		"authors": [{
			"name": "Douglas Adams"
        }],
		"keywords": [
			"hitchhiker"
		]
	},
	"price": 4.59,
	"thumbnailLink": "/images/books/hitchiker.jpeg",
	"type": "book"
}
```

## Find Product `GET`

This endpoint searches for products `GET http://api.example.com/products/`.

> # Example Request

```endpoint
{
    "method": "GET",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/products?q=Douglas%20Adams",
    "headers": {
        "Accept": "application/json;version=20150828",
        "Cache-Control": "no-cache"
    }
}
```

> # Example Response `200`

```json
[{
	"_id": "5623c1263b952eb796d79dfc",
	"uid": "hitchhikers_guide_galaxy",
	"title": "The Hitchhiker's Guide to the Galaxy",
	"description": "Seconds before the Earth is demolished to make way for a galactic freeway, Arthur Dent is plucked off the planet by his friend Ford Prefect, a researcher for the revised edition of The Hitchhiker's Guide to the Galaxy who, for the last fifteen years, has been posing as an out-of-work actor. Together this dynamic pair begin a journey through space aided by quotes from The Hitchhiker's ",
	"metadata": {
		"authors": [{
			"name": "Douglas Adams"
        }],
		"keywords": [
			"hitchhiker"
		]
	},
	"price": 4.59,
	"thumbnailLink": "/images/books/hitchiker.jpeg",
	"type": "book"
}]
```

## Get Product `GET`

This endpoint retrieves a single Product, by id `GET http://api.example.com/products/:uid`.

> # Parameters

Name | Type | Description
---- | ---- | -----------
uid | string | The human readable uid of the product you wish to retrieve


> # Example Request

```endpoint
{
    "method": "GET",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/products/hitchhikers_guide_galaxy",
    "headers": {
        "Accept": "application/json;version=20150828",
        "Cache-Control": "no-cache"
    }
}
```

> # Example Response `200`

```json
{
	"_id": "5623c1263b952eb796d79dfc",
	"uid": "hitchhikers_guide_galaxy",
	"title": "The Hitchhiker's Guide to the Galaxy",
	"description": "Seconds before the Earth is demolished to make way for a galactic freeway, Arthur Dent is plucked off the planet by his friend Ford Prefect, a researcher for the revised edition of The Hitchhiker's Guide to the Galaxy who, for the last fifteen years, has been posing as an out-of-work actor. Together this dynamic pair begin a journey through space aided by quotes from The Hitchhiker's ",
	"metadata": {
		"authors": [{
			"name": "Douglas Adams"
        }],
		"keywords": [
			"hitchhiker"
		]
	},
	"price": 4.59,
	"thumbnailLink": "/images/books/hitchiker.jpeg",
	"type": "book"
}
```

# Product.js Source
The Product module is a base/generic object to represent products. It has a metadata property that can be used for, among other things, properties that are unique to a given type of product. See the Book module for a subtype polymorphism example.

In JavaScript, you can add properties to objects you might not expect you could. In our Product Module, we define a `db` property on the `Product` constructor. Note that `Product.db` is static, while the result of constructing a `Product` is not.

The `db` property on the `Product` provides instructions to our repository module, so it knows what collection to store the data in (`Product.db.collection`), and what properties should be indexed, to improve query performance (`Product.db.indexes`). Collections are to MongoDB what tables are to SQL Server.

## Casting to self
Notice that we create an object called self, and that we cast the `product` argument to it.

> Question: Why do you think we cast the product to self, instead of just returning the product if it passes the blueprint check?

# productsRepo.js
The productRepo is a service module that can be used to query the database. It is set up to query a single collection: products.

> Question: How might we adapt this module to allow it to support querying other collections?
