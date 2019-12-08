module.exports = {
  scope: 'heinz',
  name: 'downloadComponent',
  dependencies: ['Vue', 'downloadRepo'],
  factory: (Vue, downloadRepo) => {
    'use strict'

    const state = {
      uid: null,
      order_id: null
    }

    const component = Vue.component('download', {
      template: `
        <div>
          <h2> Download successful. Thank you for your purchase. </h2>
        </div>`,
      // data: () => {
      //   return state
      // },
      // methods: {
      //   download: function(event) {
      //     const {uid, order_id} = this

      //     console.log({uid, order_id})

      //     downloadRepo.download({uid, order_id}, (err,res) => {
      //       if (err){
      //         alert("Download failed.")
      //         return
      //       }
      //       console.log(res)

      //     })
      //   }
      // }
    })

    return {
      component
    }
  }
}
