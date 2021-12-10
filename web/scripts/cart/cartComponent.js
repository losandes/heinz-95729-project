module.exports = {
    scope: 'heinz',
    name: 'cartComponent',
    dependencies: ['Vue', 'cart', 'router', 'cartRepo'],
    factory: (Vue, cart, router, repo) => {
        'use strict'

        let state = { cart: [] }

        const component = Vue.component('cart', {
            template: `
            
            <div id="cart-details">
            <h2>Your Cart</h2>
      <div class="container">
        <table id="cart" class="table table-hover table-condensed">
                  <thead>
                  <tr>
                    <th style="width:50%">Product</th>

                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-th="Product">
                      <div v-for="ct in cart">
                      <div class="row">
                        <div class="col-sm-2 "><img :src="ct.thumbnail_href"  class="img-responsive"/></div>
                        <div class="col-sm-10">
                        <h3><b>{{ct.title}}</b></h3>
                        <td data-th="Subtotal" class="text-center" v-if="ct.price"> Price :{{ct.price}} </td>
                        </div> 
                        </div>
                      </div>
                    </td>
                    <td data-th="Price">
                    <div v-for="ct in cart">
                    <td class="actions" data-th=""></td>
                   </div>
                   </td>
                   <td>
                    </td>					
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="visible-xs">
                    <td class="text-left"><strong>Total {{cart[cart.length-1]}}</strong></td>
                  </tr>
                  <tr>
                    <td colspan="2" class="hidden-xs"></td>
                    <td class="hidden-xs text-center"><strong>Total {{cart[cart.length-1]}}</strong></td>
                    <td><a href="#" class="btn btn-success btn-block" v-on:click="buyNow">Checkout <i class="fa fa-angle-right"></i></a></td>
                  </tr>
                </tfoot>
              </table>
      </div>
    </div>

   
    `,
            data: () => {
                return state
            },

            methods: {
                buyNow: function () {
                    var productids = state.cart[0].id;
                    for (var i = 1; i < state.cart.length-1; i++) {
                        productids = productids+','+state.cart[i].id ;
                    }
                    // ------stripe integration--------
                    var idsArr = []
                    for(var j =0; j<state.cart.length - 1; j++)
                    {
                        idsArr.push(state.cart[j].id)
                    }
                    console.log(idsArr)
                    console.log('Checkout connected')
                    fetch("http://localhost:3002/create-checkout-session", {
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        items: idsArr,
                        pid: productids,
                        price: state.cart[state.cart.length - 1]
                    }),
                    })
                    .then(res=>{
                    if(res.ok) return res.json()
                    return res.json().then(json => Promise.reject(json))
                    }).then(({url})=>{
                    console.log(url)
                    if(url == "http://localhost:3001/success")
                    {
                        router.navigate('/orders-upsert/' + productids + '/' + state.cart[state.cart.length - 1])
                        router.navigate('/cart-deleteAll/')
                    }
                    window.location = url
                    console.log(state)
                    }).catch(e=>{
                    console.error(e.error)
                    })
                    // --------stripe integration-------------


                    // router.navigate('/orders-upsert/' + productids + '/' + state.cart[state.cart.length - 1])
                    // router.navigate('/cart-deleteAll/')

                },
                removeFromCart: (id) => {
                    repo.removeFromCart(id, (err, response) => {
                        window.location.reload()
                    })
                  },
                
                // checkoutSuccess: function () {
                //     var productids = state.cart[0].id;
                //     for (var i = 1; i < state.cart.length-1; i++) {
                //         productids = productids+','+state.cart[i].id ;
                //     }
                    // router.navigate('/orders-upsert/' + productids + '/' + state.cart[state.cart.length - 1])
                    // router.navigate('/cart-deleteAll/')
                    // router.navigate('/orders')
                // }  
            }
        })

        const checkoutSuccess = () => {
            console.log(state)
            if(state.cart.length > 0){
                var productids = state.cart[0].id;
                for (var i = 1; i < state.cart.length-1; i++) {
                    productids = productids+','+state.cart[i].id ;
                }
                router.navigate('/orders-upsert/' + productids + '/' + state.cart[state.cart.length - 1])
                router.navigate('/cart-deleteAll/')
                router.navigate('/orders')
            }
            
        }

        const setcart = (searchResults) => {
            state = searchResults
        }

        return { component, setcart, checkoutSuccess}
    },
}
