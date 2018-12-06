/* global alert */
module.exports = {
  scope: 'heinz',
  name: 'profileComponent',
  dependencies: ['router', 'Vue', 'storage'],
  factory: (router, Vue, storage) => {
    'use strict'

    var state = { storage }
    const component = Vue.component('profile', {
      template: `
      <div id="user-profile">
        <div class="form-group">
          <label>Full Name</label></br>
          {{storage.get('user').name}}
        </div>
        <div class="form-group">
          <label>Email</label></br>
          {{storage.get('user').email}}
        </div>
        <button class="btn btn-primary" v-on:click="logout">Logout</button>
        <br />
        <br />
      </div>
    `,
      data: function () {
        return state
      },
      methods: {
        logout: function (event) {
          storage.clear()
          document.getElementById("username-view").innerHTML = ''
          
          return router.navigate('/')
        }
      }
    })

    return { component }
  }
}
