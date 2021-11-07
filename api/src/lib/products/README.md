# Products

Products are a subtype/basetype in this application. They are meant to be inherited. Check out the books domain to see an example that inherits product.

| Property          | Type     | Description                                    |
|-------------------|----------|------------------------------------------------|
| id                | UUID     | The unique identifier                          |
| uid               | string   | A unique human-readable identifier             |
| title             | string   | The title of the product                       |
| description       | string   | A description of the product                   |
| price             | number   | The price of the product (decimal to 2 places) |
| thumbnailLink     | string   | the URL for the thumbnail                      |
| type              | string   | the product type: "product"                    |
| metadata.keywords | array    | Terms to improve searching                     |

NOTE: The product routes are defined in /src/api/compose-domains.js.

Several examples in this file use [httpie](https://httpie.io/).

## Example Product

```json
{
	"id": "24d9f113-37ea-47ab-9f40-4201dc5f4ca4",
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

## index.js

The index is the composition root for this domain. It is the only file that uses `require`. All of the modules in the src directory export a factory that accepts the dependencies they require to operate.

Some of the modules are composed by this package, while others are composed by the consumer of this package (/src/api in this project). This package attempts to compose everything it can on it's own so the consumer only need inject configurable dependencies, such as knex.

## testing

The test.js file exists to execute the tests when you navigate to this directory in your terminal. The test-plan.js is the composition root for test execution, and exists in a separate file so it can be aggregated with other test-plans in this mono-repo. The test-plan.js file is used by this test.js file, as well as by the test.js file in the root directory for this project.

## Product.js

The Product module is a base/generic object to represent products. It has a metadata property that can be used for, among other things, properties that are unique to a given type of product. See _src/Product.js_ in this domain, and _/src/Book.js_ in the books domain for an example of subtype polymorphism using _@polyn/blueprint_.

## productsRepo.js

The productRepo is a service module that can be used to query the database. It is set up to query a single table: products.

## Find Product `GET`

To search for products, send a GET request to `http://localhost:3000/products`. The search word or phrase should be set to the `q` property in the querystring.

```Shell
http http://localhost:3000/products?q=tropper
```

### Example Request

```json
{
    "method": "GET",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/products?q=Douglas%20Adams",
}
```

### Example Response `200`

```json
[{
	"id": "24d9f113-37ea-47ab-9f40-4201dc5f4ca4",
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

## Get Product by uid `GET`

To retrieve a product by it's uid, send a GET request to `http://localhost:3000/products/:uid`, where `:uid` is the uid you wish to retrieve.

```
http http://localhost:3000/products/where_i_leave_you
```

### Parameters

Name | Type   | Description
---- | ------ | -----------
uid  | string | The human readable uid of the product you wish to retrieve


### Example Request

```json
{
    "method": "GET",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/products/hitchhikers_guide_galaxy",
}
```

### Example Response `200`

```json
{
	"id": "24d9f113-37ea-47ab-9f40-4201dc5f4ca4",
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
