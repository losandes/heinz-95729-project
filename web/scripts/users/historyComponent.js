/* global alert */
module.exports = {
  scope: 'heinz',
  name: 'historyComponent',
  dependencies: ['router', 'Vue', 'usersRepo', 'storage'],
  factory: (router, Vue, usersRepo, storage) => {
    'use strict'

    var state = {}
	
	if (storage.get('jwt')) {
		//console.log(storage.get('user'))
		state = storage.get('user')
		console.log(state.email)
	}
	
    const component = Vue.component('history', {
      template: `
	  <div class ="all">
          <div class="example">
		  <strong> <font size = "+3">
          Welcome back {{name}}!
		  </font> </strong> 
		</div>
		<div class="purchases">
		  <strong> <font size = "+3">
		You've bought 
		<div v-for = "p in purchase">
		{{p}}
		</div>		
		</font> </strong> 
		</div>
		</div>
		`,
		
		data:() =>{
		return state
		}
	})
	
    return { component }
  }
}
