module.exports = {
  scope: 'heinz',
  name: 'registrationComponent',
  dependencies: ['environment', 'Vue'],
  factory: (env, Vue) => {
    'use strict'

    const apiRoute = `${env.get('apiOrigin')}/users`
    const state = {
      email: null,
      name: null,
    }
    const component = Vue.component('register', {
      template: `
        <div id="user-registration-form">
          <form action="${apiRoute}" method='POST'>
            <div class="form-group">
                <label for="user-registration-email">Email address</label>
                <input v-model="email" type="email" name="email" class="form-control" placeholder="happy@andrew.cmu.edu" />
            </div>
            <div class="form-group">
                <label for="user-registration-name">Name</label>
                <input v-model="name" type="text" name="name" class="form-control" placeholder="Happy Shaawa"/>
            </div>
            <button class="btn btn-success">Register</button>
          </form>
          <br />
        </div>`,
      data: function () {
        return state
      },
    })

    return { component }
  },
}
