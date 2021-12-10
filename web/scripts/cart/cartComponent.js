module.exports = {
    scope: 'heinz',
    name: 'cartComponent',
    dependencies: ['Vue', 'cart', 'router', 'cartRepo'],
    factory: (Vue, cart, router, repo) => {
        'use strict'

        let state = { cart: [] }

        const component = Vue.component('cart', {
            template: `
      <div class= "cart-component">
       <div class="row">
        <b><h3>Total Price :{{cart[cart.length-1]}} $</h3></b>

        <div v-for="ct in cart">
          <h3><b>{{ct.title}}</b></h3>
          <h3><img :src="ct.thumbnail_href"/></h3>
          <h3 v-if="ct.price"><b>Price:  {{ct.price}} $</b></h3>
          <button v-if="ct.id" class="buy btn btn-success btn-buy" v-on:click="removeFromCart(ct.id)">Remove from cart</button>
        </div>
        <button class="buy btn btn-success btn-buy" v-on:click="buyNow">Buy Now</button>

       </div>

      </div>`,
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
