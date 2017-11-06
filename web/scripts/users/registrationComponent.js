/* global alert */
module.exports = {
  scope: 'heinz',
  name: 'registrationComponent',
  dependencies: ['router', 'Vue', 'usersRepo', 'storage'],
  factory: (router, Vue, usersRepo, storage) => {
    const state = {
      email: null,
      name: null
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
          <button class="btn btn-success" v-on:click="register">Register</button>
          <br />
        </div>`,
      data: function () {
        return state
      },
      methods: {
        register: function (event) {
          const { email, name } = this

          usersRepo.register({ name, email }, (err, res) => {
            if (err) {
              alert('Login failed')
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
