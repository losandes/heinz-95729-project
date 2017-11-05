module.exports = {
  name: 'ViewEngine',
  dependencies: ['Vue'],
  factory: function (Vue) {
    'use strict'

    return function ViewEngine (app) {
      var components = {}

      return {
        render: render
      }

      function render (vm) {
        vm = vm || {}

        if (components[vm.name]) {
          components[vm.name].render(app, vm)
        } else {
          components[vm.name] = new Component(vm)
          components[vm.name].render(app, vm)
        }
      }
    }

    function Options (options) {
      options = options || {}

      return {
        name: options.name,
        template: options.template || '#t-' + options.name,
        methods: options.vm && options.vm.methods
      }
    }

    function Component (options) {
      var vm
      options = new Options(options)

      Vue.component(options.name, {
        template: options.template,
        data: function () {
          return vm
        },
        methods: options.methods
      })

      return {
        render: function (app, data) {
          vm = data.vm
          app.currentView = options.name
        }
      }
    }
  }
}
