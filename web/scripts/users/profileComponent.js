/* global alert */
module.exports = {
  scope: 'heinz',
  name: 'profileComponent',
  dependencies: ['router', 'Vue', 'usersRepo', 'storage'],
  factory: (router, Vue, usersRepo, storage) => {
    'use strict'

    var state = { user : storage.get('user') }
    const component = Vue.component('profile', {
      template: `
      <div id="user-profile">
        <div class="form-group">
          <label>Full Name</label></br>
          {{user.name}}
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
