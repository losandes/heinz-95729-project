const ProductsDomain = require('@heinz-95729-api/products')
const BooksDomain = require('@heinz-95729-api/books')
const UsersDomain = require('@heinz-95729-api/users')
const StartupError = require('./StartupError.js')

/**
 * Composes the dependency graph
 * @param context the context produced by `bootstrap`
 */
const compose = async (context) => {
  try {
    context.migrations = []
    context.routes = []

    // PRODUCTS
    // =========================================================================
    context.domains.products = new ProductsDomain({
      knex: context.knex,
    })
    context.migrations.push({ domain: 'products', migrate: context.domains.products.migrate })
    context.routes.push((router) => router.get('/products', context.domains.products.findProduct))     // 2. http http://localhost:3000/products?q=tropper
    context.routes.push((router) => router.get('/products/:uid', context.domains.products.getProduct)) // 3. http http://localhost:3000/products/where_i_leave_you

    // BOOKS
    // =========================================================================
    context.domains.books = new BooksDomain({
      knex: context.knex,
      Product: context.domains.products.Product,
      productRepo: context.domains.products.productRepo,
    })
    context.migrations.push({ domain: 'books', migrate: context.domains.books.migrate })
    context.routes.push((router) => router.post('/books', context.domains.books.createBook))           // 1. http POST http://localhost:3000/books <<< '{ "title": "This Is Where I Leave You: A Novel", "uid": "where_i_leave_you", "description": "The death of Judd Foxman'"'"'s father marks the first time that the entire Foxman clan has congregated in years. There is, however, one conspicuous absence: Judd'"'"'s wife, Jen, whose affair with his radio- shock-jock boss has recently become painfully public. Simultaneously mourning the demise of his father and his marriage, Judd joins his dysfunctional family as they reluctantly sit shiva-and spend seven days and nights under the same roof. The week quickly spins out of control as longstanding grudges resurface, secrets are revealed and old passions are reawakened. Then Jen delivers the clincher: she'"'"'s pregnant.", "metadata": { "authors": [{ "name": "Jonathan Tropper" }], "keywords": ["funeral", "death", "comedy"] }, "price": 7.99, "thumbnailHref": "https://m.media-amazon.com/images/I/81hvdUSsatL._AC_UY436_QL65_.jpg", "type": "book" }'
    context.routes.push((router) => router.get('/books', context.domains.products.findProduct))        // 2. http http://localhost:3000/books?q=tropper
    context.routes.push((router) => router.get('/books/:uid', context.domains.products.getProduct))    // 4. http http://localhost:3000/books/where_i_leave_you

    // USERS
    // =========================================================================
    context.domains.users = new UsersDomain({
      knex: context.knex,
      env: context.env,
    })
    context.migrations.push({ domain: 'users', migrate: context.domains.users.migrate })

    const loginRedirectRoute = (ctx) => `${ctx.origin}/users/authorize`

    context.routes.push((router) =>                                                                    // http POST http://localhost:3000/users <<< '{ "email": "shopper5@95729.com", "name": "Shopper 5" }'
      router.post('/users', context.domains.users.register(loginRedirectRoute)),
    )
    context.routes.push((router) =>                                                                    // http POST http://localhost:3000/users/login <<< '{ "email": "shopper5@95729.com" }'
      router.post('/users/login', context.domains.users.login(loginRedirectRoute)),
    )
    context.routes.push((router) => router.get('/users/authorize', context.domains.users.authorize(context.env.WEB_APP_ORIGIN)))
    context.routes.push((router) => router.get('/users/me', context.domains.users.getProfile))

    context.logger.emit('compose_domains_complete', 'trace', 'compose_domains_complete')
    return context
  } catch (e) {
    throw new StartupError('compose_domains_failed', e)
  }
} // /compose.domains

module.exports = compose
