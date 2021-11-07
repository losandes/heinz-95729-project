# Choose Module Conventions

## Status

accepted

## Context

The nodejs community, as well as much of the browser community, use an anti-pattern when defining modules: [Service Location](https://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/). This leads to apps that are impossible to test without breaking the [Open/Closed Principle](https://code.tutsplus.com/tutorials/solid-part-2-the-openclosed-principle--net-36600).

> To isolate tests, _and_ produce negative paths, we have to rely on mocking libraries that modify the normal behavior of `require`, therefore rendering the output of our tests as questionable.

## Decision

To avoid the Service Location problem, we will use [Dependency Injection](https://code.tutsplus.com/tutorials/solid-part-4-the-dependency-inversion-principle--net-36872) as our means of defining modules, we will use [Poor Man's DI](https://github.com/losandes/heinz-95729/tree/master/exercises/321-poor-mans-di), along with a [Composition Root](https://blog.ploeh.dk/2011/07/28/CompositionRoot/).

We'll use a convention in which each module exports a name, it's dependencies, and a factory. This convention is designed to support both human, and machine readability:

```JavaScript
// Book.js
/**
 * @param {@polyn/blueprint} blueprint
 * @param {@polyn/immutable} immutable
 * @param {Product} Product
 */
function BookFactory (deps) {
  'use strict'

  const { registerBlueprint } = deps.blueprint
  const { immutable } = deps.immutable
  const { Product } = deps

  registerBlueprint('Author', {
    name: 'string',
  })

  const BookBlueprint = Product.blueprint
  BookBlueprint.metadata = {
    authors: 'object[]',
  }

  registerBlueprint('Book', BookBlueprint)
  const Book = immutable('Book', BookBlueprint)
  Book.blueprint = BookBlueprint

  return { Book }
}

module.exports = BookFactory

// -----------------------------------------------------------------------------
// index.js: our composition root
const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const ProductFactory = require('./Product.js')
const BookFactory = require('./Book.js')

const { Product } = ProductFactory({ blueprint, immutable })
const { Book } = BookFactory({ blueprint, immutable, Product })

module.exports = { Product, Book }
```

> Note that `require` will be used in 1 distributable module per package: index.js (the composition root). Tests may also use `require`, and are an exception to that rule because (a) they aren't distributable, and (b) we may compose modules many different ways in our tests, in order to verify all possible paths.
>
> Note that the module factory returns an object, instead of the User function directly. This is so it meets the Open/Closed Principle, as the module can be extended at a future time, without having to modify it.

The name, and dependencies may or may not be used programmatically. This convention is compatible with [hilary](https://github.com/losandes/hilaryjs#hilaryjs) should we decide to use an IoC Container. However, we should consider breaking a package into smaller libraries before deciding to use an IoC Container. Even if we never use these features programmatically, they can serve as developer documentation: especially in cases where we name a factory argument something other than the package/module we're depending on.

## Consequences

There is really no tangible benefit to using Service Location instead, but there are significant consequences in both complexity, and testability. This convention requires no additional technologies, but can optionally be supported by them. It's easier to understand the dependency graph of an application, as well as a single module using this convention as compared to the standard convention.

Some developers find Poor Man's DI to require repetitive mundane effort to produce composition.
