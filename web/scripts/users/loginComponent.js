module.exports = {
  scope: 'heinz',
  name: 'loginComponent',
  dependencies: ['environment', 'Vue'],
  factory: (env, Vue) => {
    'use strict'

    const state = { email: '' }
    const apiRoute = `${env.get('apiOrigin')}/users/login`
    const component = Vue.component('login', {
      template: `
        <div id="user-login">
          <form action="${apiRoute}" method='POST'>
            <div class="form-group">
              <label for="user-login-email">Email address</label>
              <input v-model="email" type="email" name="email" class="form-control" id="user-login-email" placeholder="happy@andrew.cmu.edu" />
            </div>
            <button class="btn btn-success">Sign in</button>
          </form>
          <div class="registration-link">
            <a href="/register">Don't have an account? Click here to register</a>
          </div>
          <br />
        </div>`,
      data: function () {
        return state
      },
    })

    return { component }
  },
}
