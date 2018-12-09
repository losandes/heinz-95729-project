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
              <td class="td">
                {{cat}}
              </td>
              <td class = "td">
              <button class="btn btn btn-danger btn-sm" v-on:click="removeCat(cat)">Remove</button>
              </td>
            </tr>
            <tr>
              <td class = "td"><input v-model="newcat" name="newcat" class="form-control form-control-sm" type="text" placeholder="New Category"></td>
              <td class = "td">
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
          let user = storage.get('user')

          usersRepo.remCat(user.email, cat, (err, res) => {
            if (err) {
              alert('Unable to remove category: check connection')
              return
            } else {
              user.categories.splice(user.categories.indexOf(cat), 1)
              storage.set('user', user)
              this.$forceUpdate()
            }
          })
        },

        addCat: function (event) {
          var { newcat } = this

          let user = storage.get('user')


          if (user.categories.indexOf(newcat.toLowerCase().trim()) >= 0) {
            alert('Category already exists')
          } else {
            usersRepo.addCat(user.email, newcat.toLowerCase().trim(), (err, res) => {
              if (err) {
                alert('Unable to add category')
                return
              }
              else {
                user.categories.push(newcat.toLowerCase())
                storage.set('user', user)
                this.$forceUpdate()
                this.newcat = ""
              }
            })
          }
        }
      }
    })

    return { component }
  }
}
