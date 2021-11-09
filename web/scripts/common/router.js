/* global scroll */
module.exports = {
  scope: 'heinz',
  name: 'router',
  dependencies: ['page', 'app'],
  factory: function (page, app) {
    'use strict'

    function router (path, handler) {
      page(path, function (context, next) {
        // scroll to the top of the page
        scroll(0, 0)
        // switch to the loading screen, to force the component
        // to update, if only the query string changes
        app.currentView = 'loading'
        // TODO: is this the right place to update the document title?
        // document.title = options.title;
        handler({
          canonicalPath: context.canonicalPath,
          query: makeQuery(context.querystring),
          hash: context.hash,
          path: context.path,
          pathName: context.pathname,
          params: context.params,
          title: context.title,
          state: context.state,
        }, next)
      })

      function makeQuery (queryString) {
        const query = {}

        if (!queryString) {
          return query
        }

        // TODO: this is crude and not standards compliant

        queryString.split('&').forEach(function (kvp) {
          const split = kvp.split('=')
          query[split[0]] = split[1]
        })

        return query
      }
    }

    router.navigate = function (path) {
      page(path)
    }

    return router
  },
}
