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
        <div class="form-group">
          <label>Categories</label></br>
          <table class="table">
            <tr>
              <td>
                Loren
              </td>
              <td>
                Ipsum
              </td>
            </tr>
            <tr>
              <td>
                Dolores
              </td>
              <td>
                Summere
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
              <button class="btn btn btn-light btn-sm" v-on:click="">Add</button>
              </td>
            </tr>
          </table>
        </div>
        <br/>
        <br/>
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
