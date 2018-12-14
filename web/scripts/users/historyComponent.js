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
		//console.log(state.email)
	}
  //console.log(state)

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

    <div class="products-component">
        <div v-for="product in purchase">

        <div class="col-sm-2 col-md-2 product-col">

            <div class="thumbnail">
              <a class="thumbnail-img" href="javascript:void(0);">
                <img :src="product.thumbnailLink" :alt="product.thumbnailAlt" width="200" height="300">
              </a>
          </div>

          </div>

        </div> <!-- /products -->
    </div><!-- /component -->

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
