# Books

#### This section provides an example for documenting a data-type.

Books `/books` have the following schema:

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
| metadata.authors  | array    | The authors of this book                       |

> # Example Book

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

## Find Books `GET`

This endpoint searches for books `GET http://api.example.com/books/`.

> # Example Request

```endpoint
{
    "method": "GET",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/books?q=Douglas%20Adams",
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

## Get Book `GET`

This endpoint retrieves a single Book, by id `GET http://api.example.com/books/:uid`.

> # Parameters

| Name | Type   | Description                                             |
| ---- | ------ | ------------------------------------------------------- |
| uid  | string | The human readable uid of the book you wish to retrieve |


> # Example Request

```endpoint
{
    "method": "GET",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/books/hitchhikers_guide_galaxy",
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

# Book.js Source
The Book module demonstrates subtype polymorphism in JavaScript. Using `Object.assign`, or the spread operator, we can extend the schema of `Product`

```JavaScript
const Book = immutable('book', {
  // Inherit/Extend Product
  ...Product.blueprint,
  ...{
    metadata: {
      // Inherit Product.metadata
      ...Product.blueprint.metadata,
      // extend Product.metadata with a required array of authors
      ...{
        authors: 'Author[]'
      }
    }
  }
})
```
