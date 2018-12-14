/* global alert */
module.exports = {
  scope: 'heinz',
  name: 'profileComponent',
  dependencies: ['router', 'Vue', 'usersRepo', 'storage'],
  factory: (router, Vue, usersRepo, storage) => {
    'use strict'

    const categories = [
      'history', 'auto-biography', 'inspirational', 'love', 'crime',
      'anthology', 'mystery', 'psychological', 'fantasy',
      'science-fiction', 'biography', 'magic realism', 'religion',
      'philosophy', 'drama', 'comedy', 'technology', 'software engineering'
    ]
    var state = { storage, newcat: null, categories }

    const component = Vue.component('profile', {
      template: `
      <div id="profile-root">
        <div id="user-profile">
          <h2>Profile Information</h2>
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
                <td class = "td">
                  <select v-model="newcat" class="mdb-select md-form">
                    <option value="" disabled selected>Choose a category</option>
                    <option v-for="cat in categories" :value="cat">{{ cat }}</option>
                  </select>
                </td>
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
          <h2>Purchase History</h2>
          <div class="purchase-item" v-for="purchase in storage.get('purchaseHistory')">
            <label>{{displayDate(purchase.time)}}</label></br>
            <label>Total:</label>&nbsp{{'$' + (purchase.amount/100).toFixed(2)}}
            </br>
            <table v-if="purchase.items.length >= 1">
              <col width="60%">
              <col width="10%">
              <tr>
                <th class="pitem">Item</th>
                <th class="pprice">Price</th>
                <th class="pauthor">Author(s)</th>
                <th>Download</th>
              </tr>
              <tr v-for="item in purchase.items">
                  <td>
                    <a href="javascript:void(0);" v-on:click="viewItem(item)">{{item.title}}</a>
                  </td>
                  <td>
                    {{ item.price.toFixed(2) }}
                  </td>
                  <td>
                    <div v-for="author in item.authors">{{author.name}}</div>
                  </td>
                  <td class="download-button">
                    <a href="https://etc.usf.edu/lit2go/pdf/passage/5352/the-works-of-edgar-allan-poe-078-the-raven.pdf" download>
                      <i class="fa fa-book" aria-hidden="true"></i>
                    </a>
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

        displayDate: function (isodate) {
          let date = new Date(isodate)
          let month = date.getMonth()

          let display = date.getDate()

          switch (month) {
            case 0: display += ' January '
              break
            case 1: display += ' February '
              break
            case 2: display += ' March '
              break
            case 3: display += ' April '
              break
            case 4: display += ' May '
              break
            case 5: display += ' June '
              break
            case 6: display += ' July '
              break
            case 7: display += ' August '
              break
            case 8: display += ' September '
              break
            case 9: display += ' October '
              break
            case 10: display += ' November '
              break
            case 11: display += ' December '
              break
          }

          display += date.getFullYear()

          return display
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
