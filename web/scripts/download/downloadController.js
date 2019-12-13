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
      router('/books/download/:uid/:order_id', (context) => {

        const uid = context.params.uid
        const order_id = context.params.order_id
        downloadRepo.download({ uid, order_id }, (err, blob) => {
         
          if (err) {
            console.log(err)
            return
          }
          if (blob.type == "application/pdf") {
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = uid + '.pdf'
            link.click()
            app.currentView = 'download'
          }else{
            // doesn't download when user has exceed download limit
            // show appropriate message to user here
            app.currentView = 'limit'
          }
        })
      })
      // Route for error page
      router('/error', () => {
        app.currentView = 'error'
      })
    }

    return { registerRoutes }
  }
}
