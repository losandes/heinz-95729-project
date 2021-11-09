# Books

Books are an type of / extension of products (/src/lib/products). The Product and Books models are mostly identical with one exception: metadata.authors.

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
| metadata.authors  | array    | The authors of this book                       |

NOTE: The book routes are defined in /src/api/compose-domains.js.

Several examples in this file use [httpie](https://httpie.io/).

## Example Book

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

## Book.js

The Book module (/src/Book.js) extends the Product model (../products/src/Product.js).

## create-book.js

The create-book module exports koa middleware that can be assigned to a route.

## Create Book `POST`

To insert a new Book into the database, send a POST request to `http://localhost:3000/books`.

```Shell
http POST http://localhost:3000/books <<< '{ "title": "This Is Where I Leave You: A Novel", "uid": "where_i_leave_you", "description": "The death of Judd Foxman'"'"'s father marks the first time that the entire Foxman clan has congregated in years. There is, however, one conspicuous absence: Judd'"'"'s wife, Jen, whose affair with his radio- shock-jock boss has recently become painfully public. Simultaneously mourning the demise of his father and his marriage, Judd joins his dysfunctional family as they reluctantly sit shiva-and spend seven days and nights under the same roof. The week quickly spins out of control as longstanding grudges resurface, secrets are revealed and old passions are reawakened. Then Jen delivers the clincher: she'"'"'s pregnant.", "metadata": { "authors": [{ "name": "Jonathan Tropper" }], "keywords": ["funeral", "death", "comedy"] }, "price": 7.99, "thumbnailHref": "https://m.media-amazon.com/images/I/81hvdUSsatL._AC_UY436_QL65_.jpg", "type": "book" }'
```

### Example Request

```json
{
    "method": "POST",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/books",
		"body": {
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
}
```

### Example Response `201`

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

## Find Book `GET`

To search for books, send a GET request to `http://localhost:3000/books`. The search word or phrase should be set to the `q` property in the querystring.

```Shell
http http://localhost:3000/books?q=tropper
```

### Example Request

```json
{
    "method": "GET",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/books?q=Douglas%20Adams",
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

To retrieve a book by it's uid, send a GET request to `http://localhost:3000/books/:uid`, where `:uid` is the uid you wish to retrieve.

```
http http://localhost:3000/books/where_i_leave_you
```

### Parameters

Name | Type   | Description
---- | ------ | -----------
uid  | string | The human readable uid of the book you wish to retrieve


### Example Request

```json
{
    "method": "GET",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/books/hitchhikers_guide_galaxy",
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
