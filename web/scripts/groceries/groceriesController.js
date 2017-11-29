module.exports = {
  scope: 'heinz',
  name: 'groceriesController',
  dependencies: ['router', 'groceryComponent', 'Grocery', 'groceriesRepo'],
  factory: (router, groceryComponent, Grocery, repo) => {
    'use strict'

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes (app) {
      router('/groceries/:uid', (context, next) => {
        repo.get(context.params.uid, (err, grocery) => {
          if (err) {
            console.log(err)
            // TODO: render error view
          }

          if (grocery) {
            groceryComponent.setGrocery(new Grocery(grocery))
            app.currentView = 'grocery'
          } else {
            // TODO: route to a "none found" page
            router.navigate('/')
          }
        })
      })
    }

    return { registerRoutes }
  }
}
