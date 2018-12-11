/* global alert */
module.exports = {
  scope: 'heinz',
  name: 'loginComponent',
  dependencies: ['router', 'Vue', 'usersRepo', 'storage'],
  factory: (router, Vue, usersRepo, storage) => {
    'use strict'

    const state = { email: '' }
    const component = Vue.component('login', {
      template: `
        <div id="user-login">
          <div class="form-group">
            <label for="user-login-email">Email address</label>
            <input v-model="email" type="email" name="email" class="form-control" id="user-login-email" placeholder="happy@andrew.cmu.edu" />
          </div>
          <button class="btn btn-success" v-on:click="login">Sign in</button>
          <div class="registration-link">
            <a href="/register">Don't have an account? Click here to register</a>
          </div>
          <br />
        </div>`,
      data: function () {
        return state
      },
      methods: {
        login: function (event) {
          const { email } = this

          usersRepo.login(email, (err, res) => {
            if (err) {
              alert('Login failed')
              return
            }

            storage.set('jwt', res.authToken)
            storage.set('user', res.user)

            // Set username view
            document.getElementById('username-view').innerHTML
                = '<u>' + res.user.name + '</u>'

            return router.navigate('/')
          })
        }
      }
    })

    return { component }
  }
}
