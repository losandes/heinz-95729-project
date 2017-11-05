/* eslint-disable */
module.exports({
  name: 'applications',
  dependencies: ['router', 'viewEngine', 'Repo'],
  factory: function (router, viewEngine, Repo) {
    'use strict'

    var applicationsRepo

    /*
        // Model
        */
    function Application (application) {
      var self = {}
      application = application || {}

      self.id = application.id
      self.clientId = application.clientId
      self.timeCreated = new Date(application.createdDate)
      self.timeCreatedString = self.timeCreated.toString()
      self.status = normalizeStatus(application.status)
      self.email = application.email
      self.firstName = application.firstName
      self.lastName = application.lastName

      self.click = function () {
        console.log('clicked', self.id)
      }

      function normalizeStatus (status) {
        var statuses = ['INITIAL', 'PASS', 'REVIEW', 'FAIL']

        if (statuses.indexOf(status) > -1) {
          return status
        } else {
          return 'UNKNOWN'
        }
      }

      return self
    }

    /*
        // ViewModel
        */
    function ApplicationsViewModel (view) {
      view = view || {}

      var self = {
        title: view.title || 'Applications',
        headings: {
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Email',
          status: 'Status',
          timeCreated: 'Time Created'
        },
        previous: {
          copy: 'Previous',
          href: view.previous && view.previous.href,
          disabled: view.previous && view.previous.disabled
        },
        next: {
          copy: 'Next',
          href: view.next && view.next.href,
          disabled: view.next && view.next.disabled
        },
        applications: Array.isArray(view.applications) ? view.applications : []
      }

      return self
    }

    /*
        // Repo (AJAX calls to the server)
        */
    applicationsRepo = (function ApplicationRepo (Repo) {
      var path = '/banking/applications',
        pathWithId = '/banking/applications/{{applicationId}}',
        repo = new Repo({
          Model: Application
        }),
        self = {
          list: list,
          get: get,
          update: update
        }

      function list (options, callback) {
        var qs
        options = options || {}
        options.skip = parseNumWithDefault(options, 'skip', 0)
        options.limit = parseNumWithDefault(options, 'limit', options.skip + 15)

        if (options.status === 'REVIEW') {
          qs = '?status=REVIEW&firstresult={{skip}}&maxresults={{limit}}'
        } else {
          qs = '?firstresult={{skip}}&maxresults={{limit}}'
        }

        qs = qs.replace(/{{skip}}/, options.skip)
        qs = qs.replace(/{{limit}}/, options.limit)

        return repo.list({
          path: path + qs
        }, callback)
      }

      function get (options, callback) {
        return repo.get({
          path: pathWithId.replace(/{{applicationId}}/, options.applicationId)
        }, callback)
      }

      // PUT /banking/application/5bc826c6-7217-43d6-bda2-fae2afbf4198/status/approve
      // PUT /banking/application/5bc826c6-7217-43d6-bda2-fae2afbf4198/status/comment
      // PUT /banking/application/5bc826c6-7217-43d6-bda2-fae2afbf4198/status/deny
      function update (options, callback) {
        return repo.put({
          path: pathWithId.replace(/{{applicationId}}/, options.applicationId) + '/' + options.action,
          body: {
            comment: options.comment
          }
        }, callback)
      }

      function validateAction (action) {
        if (['approve', 'comment', 'deny'].indexOf(action) > -1) {
          return action
        } else {
          throw new Error('Unknown action', action)
        }
      }

      function parseNumWithDefault (options, prop, def) {
        return typeof options[prop] === 'number' ? options[prop] : def
      }

      return self
    }(Repo))

    /*
        // Route binding (controller)
        */
    function registerRoutes () {
      // TODO: move pagination into it's own module
      var defaultLimit = 14

      router('/csui/applications', function (req) {
        var skip = parseQueryAsNumber(req.query, 'skip', 0),
          limit = parseQueryAsNumber(req.query, 'limit', skip + defaultLimit)

        list({
          skip: skip,
          limit: limit,
          status: req.query && req.query.status
        })
      })

      function list (options) {
        applicationsRepo.list(options, function (err, applications) {
          if (err) {
            return console.error(err)
          }

          viewEngine.render({
            name: 'applications',
            vm: new ApplicationsViewModel({
              title: makeTitle(options.status),
              applications: applications,
              previous: {
                href: '/csui/applications' +
                                    makeQueryString(options, makePreviousQueryParam, applications.length),
                disabled: options.skip === 0 ? 'previous disabled' : 'previous'
              },
              next: {
                href: '/csui/applications' +
                                    makeQueryString(options, makeNextQueryParam, applications.length),
                disabled: options.limit > applications.length ? 'next disabled' : 'next'
              }
            })
          })
        })
      }

      function parseQueryAsNumber (query, prop, def) {
        var val

        if (!query || !query[prop]) {
          return def
        }

        val = parseInt(query[prop])

        if (isNaN(val)) {
          return def
        }

        return val
      }

      function makeTitle (status) {
        switch (status) {
          case 'REVIEW':
            return 'Applications in Review'
          default:
            return 'Applications'
        }
      }

      function makeQueryString (options, skipHandler, lastCount) {
        var qs = []

        if (options.status) {
          qs.push('status=' + options.status)
        }

        qs.push(skipHandler(options, lastCount))
        qs.push('limit=' + options.limit)

        return '?' + qs.join('&')
      }

      function makePreviousQueryParam (query) {
        var skip = query.skip - defaultLimit
        skip = skip > 0 ? skip : 0
        return 'skip=' + skip
      }

      function makeNextQueryParam (query, lastCount) {
        if (query.limit > lastCount) {
          return 'skip=' + query.skip
        }

        return 'skip=' + (query.skip + defaultLimit)
      }
    }

    return {
      registerRoutes: registerRoutes
    }
  }
})
