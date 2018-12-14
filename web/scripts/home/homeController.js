module.exports = {
  scope: 'heinz',
  name: 'homeController',
  dependencies: ['router', 'homeComponent', 'Product', 'productsRepo', 'storage'],
  factory: (router, homeComponent, Product, repo, storage) => {
    'use strict'

    function capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }

    /**
     * Route binding (controller)
     */
    function registerRoutes (app) {
      router('/', () => {
        const user = storage.get('user')
        // If user is logged in, and they have at least 1 favorite category.
        if (user !== null && user.categories !== undefined) {
          app.currentView = 'loading'
          var userCategoryView = []
          for (let i = 0; i < user.categories.length; i++) {
            let currentCategory = user.categories[i]
            userCategoryView[i] = {}
            userCategoryView[i].category = capitalizeFirstLetter(currentCategory)
            userCategoryView[i].products = []
            repo.search(currentCategory, (err, products) => {
              if (err) {
                console.log(err)
              }
              userCategoryView[i].products = products.map(product => new Product(product))
            })
          }

          homeComponent.setProducts(userCategoryView)
          app.currentView = 'home'
        } else {
          // Handle case of user not being logged in or having no favorites.
          app.currentView = 'loading'
          homeComponent.setProducts([])
          app.currentView = 'home'
        }
      })
    }

    return { registerRoutes }
  }
}
