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
      <div id="profile-root">
        <div id="user-profile">
          <h2 style="text-align: center">Profile Information</h2>
          </br>
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
          <button class="btn btn-primary" v-on:click="logout">Logout</button>
          <br />
          <br />
        </div>

        <div id="purchase-history">
          <h2 style="text-align: center">Purchase History</h2>
          <div class="purchase-item" v-for="purchase in storage.get('purchaseHistory')">
            <label>{{moment(purchase.time).format('MMMM Do YYYY')}}</label></br>
            <label>Total:</label>&nbsp{{'$' + purchase.amount/100}}
            </br>
            <table v-if="purchase.items.length >= 1">
              <col width="60%">
              <col width="10%">
              <tr>
                <th class="pitem">Item</th>
                <th class="pprice">Price</th>
                <th class="pauthor">Author(s)</th>
              </tr>
              <tr v-for="item in purchase.items">
                  <td>
                    <a href="javascript:void(0);" v-on:click="viewItem(item)">{{item.title}}</a>
                  </td>
                  <td>
                    {{item.price}}
                  </td>
                  <td>
                    <div v-for="author in item.authors">{{author.name}}</div>
                  </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    `,
      data: function () {
        return state
      },
      methods: {
        logout: function (event) {
          storage.clear()
          document.getElementById('username-view').innerHTML = ''

          return router.navigate('/')
        },

        removeCat: function (cat) {
          let user = storage.get('user')

          usersRepo.remCat(user.email, cat, (err, res) => {
            if (err) {
              alert('Unable to remove category: check connection')
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

          if (user.categories === undefined) {
            user.categories = []
          }

          if (user.categories.indexOf(newcat.toLowerCase().trim()) >= 0) {
            alert('Category already exists')
          } else {
            usersRepo.addCat(user.email, newcat.toLowerCase().trim(), (rerr, res) => {
              if (rerr) {
                console.log(rerr)
                alert('Unable to add category')
              } else {
                user.categories.push(newcat.toLowerCase())
                storage.set('user', user)
                this.$forceUpdate()
                this.newcat = ''
              }
            })
          }
        },

        moment: function () {
          return moment()
        },

        viewItem: function (item) {
          switch (item.type) {
            case 'book':
              router.navigate(`/books/${item.uid}`)
              break
            default:
              router.navigate(`/products/${item.uid}`)
              break
          }
        }
      }
    })

    return { component }
  }
}
