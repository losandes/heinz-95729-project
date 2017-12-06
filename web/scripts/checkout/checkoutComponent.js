module.exports = {
  scope: 'heinz',
  name: 'checkoutComponent',
  dependencies: ['Vue', 'locale', 'Product'],
  factory: (Vue, locale, Product) => {
    'use strict'

    const component = Vue.component('checkout', {
      template: `
        <div class="component empty-component">
          <h1>{{heading}}</h1>
          <div>{{body}}</div>
          <table style="width:100%">
            <tr>
              <th width="300px"> Image            </th>
              <th width="300px"> Product Name     </th>
              <th width="300px"> Product Price    </th>
              <th width="300px"> Product Quantity </th>
              <th width="300px"> Change Cart      </th>
              <th width="300px"> Change Cart      </th>
            </tr>
            <tr v-for='item in items'>
              <td><img width="200px" height="200px" :src=item.image>        </td>
              <td width="300px"> {{item.name}}    </td>
              <td width="300px"> {{item.price}}   </td>
              <td width="300px"> {{item.quantity}}</td>
              <td><button id="increment-btn" v-on:click="item.increase($event, item)">Add to Cart</button></td>
              <td><button id="decrease-btn" v-on:click="item.decrease($event, item)">Remove from Cart</button></td>
            </tr>
          </table>
        </div>`,
      data: () => {
        
        return {
          heading: "Welcome to the Checkout Page",
          body: " ",
          items: preprocess(JSON.parse(localStorage.getItem("productsInCart")))
        }
      }

    })

    const preprocess = (data) => {
      var items = []
      for(var key in data) {
        if(data.hasOwnProperty(key)) {
          // binding increase and decrease function
          data[key].increase = function(event, item) {
            item.quantity++;
            // update localstorage
              if(localStorage.productsInCart != null) {
                var productsInCart = JSON.parse(localStorage.productsInCart)
                if(productsInCart.hasOwnProperty(item._id)) {
                  productsInCart[item._id]["quantity"]++;
                  localStorage.setItem("productsInCart", JSON.stringify(productsInCart))
                }
              }
          }
          data[key].decrease = function(event, item) {
            item.quantity--;
            if(item.quantity <= 0) {
              // update localstorage
              if(localStorage.productsInCart != null) {
                var productsInCart = JSON.parse(localStorage.productsInCart)
                if(productsInCart.hasOwnProperty(item._id)) {
                  delete productsInCart[item._id]
                  localStorage.setItem("productsInCart", JSON.stringify(productsInCart))
                }
              }
              // Remove item
              var trDom = event.currentTarget.parentElement.parentElement
              trDom.remove()
            } else{
              // update localstorage
              if(localStorage.productsInCart != null) {
                var productsInCart = JSON.parse(localStorage.productsInCart)
                if(productsInCart.hasOwnProperty(item._id)) {
                  productsInCart[item._id]["quantity"]--;
                  localStorage.setItem("productsInCart", JSON.stringify(productsInCart))
                }
              }
            }
            
          }
          items.push(data[key]);
        }
      }
      return items
    }

    // const removeDuplicates = (data) => {
    //   var productsFound = []
    //   var productsArr = []
    //   for (let i = 0; i < data.length; i++) {
    //     var indexGuessed = productsFound.indexOf(data[i]._id)
    //     //console.log("Index for iteration ", i, ",", indexGuessed)
    //     if (productsFound.indexOf(data[i]._id) == -1) {
    //       var product = {
    //         name: data[i].title,
    //         price: data[i].price,
    //         image: data[i].thumbnailLink,
    //         quantity: 1,
    //         increase: function(item) {
    //           item.quantity--;
    //           if(item.quantity <= 0 && localStorage.productsInCart != "") {

    //           }
    //         },
    //         decrease: function(item) {
    //           console.log(item)
    //         }
    //       }
    //       productsArr.push(product)
    //       productsFound.push(data[i]._id)
    //     }
    //     else {
    //       var index = productsFound.indexOf(data[i]._id)
    //       var product = productsArr[index]
    //       product.quantity++
    //       productsArr[index] = product

    //     }
    //   }
    //   return productsArr
    // }

    return { component }
  }
}
