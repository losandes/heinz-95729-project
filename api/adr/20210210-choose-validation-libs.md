# Choose Validation Libraries

## Status

accepted

## Context

When constructing models, we need to validate the inputs to ensure quality, as well as produce error messages other developers, or users can understand, so they can fix the data they are presenting to us. Validation can also help us mitigate adversarial techniques, such as property pollution.

In addition to validation, immutability can help developers avoid unintended bugs that can be caused when multiple functions act upon a reference/pointer.

Many validation libraries exist, as well as formats for defining schemas. Not being satisfied with any validation libraries in the node community in 2014, I wrote [@polyn/blueprint](https://github.com/losandes/polyn-blueprint#polynblueprint).

JavaScript supports immutability to a degree, however true immutability requires careful, and verbose use of `Object.freeze`. Of the libraries I've reviewed that help mitigate this complexity, none did so without introducing significant complexities themselves. I built [@polyn/immutable](https://github.com/losandes/polyn-immutable#polynimmutable) to both solve the problem of immutability in JavaScript, _and_ further reduce the amount of code necessary to validate an object, at the same time.

I've continued to maintain these libraries over the years. I rewrote them as new libraries to use at Slack in 2019. They now support TypeScript. Blueprint schema's are designed to look like TypeScript where possible to reduce the cognitive overhead when being used in concert with TypeScript.

@polyn/blueprint & immutable supports JSON Schema, which can be a better option when we intend to export our schema's to 3rd party developers for their own testing, however JSON Schema is much more complex and limited when compared to native blueprint schemas.

In addition to the TypeScript style type definitions, blueprint supports functional validation. This allows it to go beyond type validation, and into comprehensive, and proprietary validation very easily. It supports object oriented type definitions, regular expressions, and can be used for ETL without defining multiple models (there is no requirement that the input data match the output schema, and blueprint has tools to help you map from one to the other).

When developers consume the output of blueprint or immutable, instead of the original input, the libraries help mitigate a common adversarial technique: property pollution.

An example blueprint, using immutable:

```JavaScript
const { optional, range, registerBlueprint } = require('@polyn/blueprint')
const { immutable } = require('@polyn/immutable')
const { randomBytes } = require('crypto')

registerBlueprint('Movie', {
  title: 'string',
  director: 'string',
  year: range({ gte: 1895, lte: new Date().getFullYear() })
})

const User = immutable('User', {
  id: optional('string').withDefault(`U${randomBytes(4).toString('hex')}`),
  name: 'string',
  age: range({ gt: 0, lte: 130 }),
  role: /^admin|user$/,
  favoriteMovies: 'Movie[]?'
})
```

Blueprint also exports a module called, `is`, which can be used as part of an assertion strategy (i.e. `is.number(42)`, and `is.not.number('fourty-two')`)

I evaluated Walmart's [Joi](https://github.com/hapijs/joi) library while writing this ADR. I think it solves a subset of the problems that blueprint solves, and none of the problems immutable solves. Joi is more verbose to use, and to read, unless we use JSON Schema. The breaking changes introduced to Joi year after year indicates that it's less stable than blueprint and immutable.

## Decision

Use [@polyn/blueprint](https://github.com/losandes/polyn-blueprint#polynblueprint), and [@polyn/immutable](https://github.com/losandes/polyn-immutable#polynimmutable) for validation and immutability.

## Consequences

Using blueprint's proprietary schema's mean that we tightly couple our models to these libraries. We can use JSON Schema instead, to avoid that coupling, however, I did not identify evidence that supports that as the better option.
