/* global alert */
module.exports = {
  scope: 'heinz',
  name: 'profileComponent',
  dependencies: ['router', 'Vue', 'usersRepo', 'storage'],
  factory: (router, Vue, usersRepo, storage) => {
    'use strict'

    var state = { storage, newcat: null }
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
        </br>
        <div class="form-group">
          <label>Categories</label></br>
          <table class="category-table">
            <tr v-for="cat in storage.get('user').categories">
              <td>
                {{cat}}
              </td>
              <td>
              <button class="btn btn btn-danger btn-sm" v-on:click="removeCat(cat)">Remove</button>
              </td>
            </tr>
            <tr>
              <td><input v-model="newcat" name="newcat" class="form-control form-control-sm" type="text" placeholder="New Category"></td>
              <td>
              <button class="btn btn btn-success btn-sm" v-on:click="addCat">Add</button>
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
        },

        removeCat: function (cat) {
          console.log(cat)
          alert(cat)
        },

        addCat: function (event) {
          var { newcat } = this

          let user = storage.get('user')
          usersRepo.addCat(user.email, newcat, (err, res) => {
            if (err) {
              alert('Addcat failed')
              return
            } else {
              user.categories.push(newcat)
              storage.set('user', user)
              this.$forceUpdate()
              this.newcat = ""
            }
          })
        }
      }
    })

    return { component }
  }
}
