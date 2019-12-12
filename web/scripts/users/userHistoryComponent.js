module.exports = {
  scope: 'heinz',
  name: 'userHistoryComponent',
  dependencies: ['Vue', 'storage', 'router'],
  factory: (Vue, storage, router) => {
    'use strict'

    var state = {
      name: "",
      email: ""
    }

    const component = Vue.component('history', {
      template: `
        <div class="history-component">
          <div class="row text-center">
          <div class="heading"> <h2>User Profile</h2> </div>
          <div class ="details"><span class="label"><h3>Name:</h3></span> <h3>{{name}} </h3></div>
          <div class ="details"><span class="label"><h3>Email:</h3></span><h3> {{email}}</h3></div>
          <div class="btn-panel">
          <a class="btn btn-success view" href="/userproducts"> View History </a>
          <button class="btn btn-success logout" v-on:click="logout">Log out</button>
          </div>
          </div><!-- /row -->
        </div><!-- /component -->`,
      data: () => {
        return state
      },
      methods: {
        logout: function(event) {
          storage.remove('jwt')
          storage.remove('user')
          return router.navigate('/login')
        }
      }
    })

    const setUser = (user) => {
      state = user
    }

    return {
      component,
      setUser
    }
  }
}
