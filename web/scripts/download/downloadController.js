module.exports = {
  scope: 'heinz',
  name: 'downloadController',
  dependencies: ['router', 'downloadRepo'],
  factory: (router, downloadRepo) => {
    'use strict'

    /**
     * Route binding (controller)
     */
    function registerRoutes(app) {
      router('/download/:uid/:order_id', (context) => {

        const uid = context.params.uid
        const order_id = context.params.order_id

        console.log(uid, order_id)

        downloadRepo.download({ uid, order_id }, (err, download) => {
          if (err) {
            console.log(err)
            alert('Cannot download.')
            return
          }

          if (download) {
            app.currentView = 'download'
          }
        })
      })
      //Route for error page
      router('/error', () => {
        app.currentView = 'error'
      })
    }

    return { registerRoutes }
  }
}
