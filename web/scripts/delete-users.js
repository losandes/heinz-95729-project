/* eslint-disable */
module.exports({
  name: 'users',
  dependencies: ['router', 'viewEngine', 'Repo', 'environment', 'storage', 'fetch'],
  factory: function (router, viewEngine, Repo, env, storage, fetch) {
    'use strict'

    var usersRepo

    /*
        // Model
        */
    function User (user) {
      var self = {}
      user = user || {}

      // TODO
      // addressCity: "North Adell"
      // addressCountry: "FI "
      // addressLine1: "49970 Clement Village"
      // addressLine2: "719 Kuvalis Estates"
      // addressState: "MD"
      // addressZip: "41708-1502"
      // dateOfBirth: "2017-03-14"
      // email: "Nona.Roob@address.com"
      // firstName: "Nona"
      // lastName: "Roob"
      // middleName: "Raegan"
      // phoneNumber: "(415) 555-2402"
      // ssn: "527148629"

      return self
    }

    /*
        // ViewModel
        */
    function LoginViewModel (view) {
      view = view || {}

      var self = {
        title: 'Login',
        username: view.username,
        password: view.password,
        methods: {
          login: function (event) {
            usersRepo.login(self, function (err, res) {
              if (err) {
                return router.redirect('/login-error')
              }

              storage.set('jwt', {
                token: res.access_token,
                expires: makeExpiration(res.expires_in),
                clientId: res.varo_client_id,
                credentialId: res.varo_credential_id
              })
              router.redirect('/reload')
            })
          }
        }
      }

      function makeExpiration (expiresIn) {
        var expiration = new Date()
        // set the expiration time to 10 minutes before, so we login again
        // before it expires
        expiration.setSeconds(expiration.getSeconds() + (expiresIn - 600))
        return expiration
      }

      return self
    }

    /*
        // Repo (AJAX calls to the server)
        */
    usersRepo = (function UserRepo (Repo, User, env, fetch) {
      var path = '/banking/application/{{applicationId}}/activities',
        repo = new Repo({
          Model: User
        }),
        self = {
          login: login,
          put: put
        }

      // POST oauth/token?grant_type:password&username:andy.wright@rnp.io&password:Password1
      // Authorization:Basic dmFybzpwYXNzd29yZA==
      // env.get('') ^^
      function login (options, callback) {
        var url = '/oauth/token?grant_type=password&username={{username}}&password={{password}}'
          .replace(/{{username}}/, options.username)
          .replace(/{{password}}/, options.password)

        fetch(url, {
          method: 'POST',
          headers: { Authorization: 'Basic ' + env.get('authorization') }
        }).then(function (res) {
          if (res.status >= 200 && res.status < 300) {
            return res.json()
          } else {
            callback(new Error('login failed'))
          }
        }).then(function (json) {
          callback(null, json)
        })
      }

      // PUT profile/profiles/c12bbd5a-6f0c-4d43-9e76-d09baa984210/profile
      function put (options, callback) {

      }

      return self
    }(Repo, User, env, fetch))

    /*
        // Route binding (controller)
        */
    function registerRoutes () {
      router('/csui/login', function () {
        viewEngine.render({
          name: 'login',
          vm: new LoginViewModel()
        })
      })
    }

    return {
      registerRoutes: registerRoutes
    }
  }
})
