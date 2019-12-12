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
        const order_id = context.params.order_ids
        downloadRepo.download({ uid, order_id }, (err, blob) => {
         
          if (err) {
            console.log(err)
            return
          }
          if (blob) {
            
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = uid + '.pdf'
            link.click()
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
