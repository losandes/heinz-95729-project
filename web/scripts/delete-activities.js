/* eslint-disable */
module.exports({
  name: 'activities',
  dependencies: ['router', 'viewEngine', 'Repo'],
  factory: function (router, viewEngine, Repo) {
    'use strict'

    var repo

    /*
        // Model
        */
    function Activity (activity) {
      var self = {}, socureResult
      activity = activity || {}
      activity.output = activity.output || {}
      socureResult = tryParse(activity.output)

      self.type = activity.activityType
      self.timeCreated = activity.createdDate
      self.status = activity.status
      self.stringifiedSocureResult = activty.output
      self.socureResult = {
        outcome: socureResult.outcome,
        data: socureResult.score,
        analysis: socureResult.analysis
      }

      function tryParse (input) {
        try {
          if (typeof input === 'object') {
            return input
          }
          return JSON.parse(input)
        } catch (e) {
          return {}
        }
      }

      return self
    }

    /*
        // ViewModel
        */
    function ViewModel (view) {
      view = view || {}

      var self = {
        title: 'Activities'
      }

      return self
    }

    /*
        // Repo (AJAX calls to the server)
        */
    repo = (function ApplicationRepo (Repo, Activity) {
      var path = '/banking/application/{{applicationId}}/activities',
        repo = new Repo({
          Model: Activity
        }),
        self = {
          get: get
        }

      function get (options, callback) {
        return repo.get({
          path: path.replace(/{{applicationId}}/, options.applicationId)
        }, callback)
      }

      return self
    }(Repo, Activity))

    /*
        // Route binding (controller)
        */
    function registerRoutes () {

    }

    return {
      registerRoutes: registerRoutes
    }
  }
})
