/* global alert */
module.exports = {
  scope: 'heinz',
  name: 'registrationComponent',
  dependencies: ['router', 'Vue', 'usersRepo', 'storage'],
  factory: (router, Vue, usersRepo, storage) => {
    'use strict'

    const state = {
      email: null,
      name: null,
      password: null
    }
    const component = Vue.component('register', {
      template: `
        <div id="user-registration-form">
          <div class="form-group">
              <label for="user-registration-email">Email address</label>
              <input v-model="email" type="email" name="email" class="form-control" placeholder="happy@andrew.cmu.edu" />
          </div>
          <div class="form-group">
              <label for="user-registration-name">Name</label>
              <input v-model="name" type="text" name="name" class="form-control" placeholder="Happy Shaawa"/>
          </div>
          <div class="form-group">
              <label for="user-registration-password">Password</label>
              <input v-model="password" type="password" name="password" class="form-control" placeholder="Your password"/>
          </div>
          <button class="btn btn-success" v-on:click="register">Register</button>
          <br />
        </div>`,
      data: function () {
        return state
      },
      methods: {
        register: function (event) {
          const { email, name, password } = this

          usersRepo.register({ name, email, password }, (err, res) => {
            if (err) {
              alert('Register failed')
              return
            }

            storage.set('jwt', res.authToken)
            storage.set('user', res.user)
            return router.navigate('/')
          })
        }
      }
    })

    return { component }
  }
}
