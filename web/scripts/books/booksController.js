module.exports = {
  scope: 'heinz',
  name: 'booksController',
  dependencies: ['router', 'bookComponent', 'Book', 'booksRepo'],
  factory: (router, bookComponent, Book, repo) => {
    'use strict'

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes (app) {
      router('/books/:uid', (context) => {
        repo.get(context.params.uid, (err, book) => {
          if (err) {
            console.log(err)
            // TODO: render error view
          }

          if (book) {
            bookComponent.setBook(new Book(book))
            app.currentView = 'book'
          } else {
            // TODO: route to a "none found" page
            router.navigate('/')
          }
        })
      })
    }

    return { registerRoutes }
  },
}
