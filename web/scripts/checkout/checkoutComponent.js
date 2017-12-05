module.exports = {
  scope: 'heinz',
  name: 'checkoutComponent',
  dependencies: ['Vue', 'locale'],
  factory: (Vue, locale) => {
    'use strict'

    const component = Vue.component('checkout', {
      template: `
        <div class="component empty-component">
          <h1>{{heading}}</h1>
          <div>{{body}}</div>
          <table style="width:100%">
            <tr>
              <th width="300px"> Image            </td>
              <th width="300px"> Product Name     </td>
              <th width="300px"> Product Price    </td>
              <th width="300px"> Product Quantity </td>
              <th width="300px"> Change Cart      </td>
              <th width="300px"> Change Cart      </td>
            </tr>
            <tr v-for='item in items'>
              <td><img width="200px" height="200px" :src=item.image>        </td>
              <td width="300px"> {{item.name}}    </td>
              <td width="300px"> {{item.price}}   </td>
              <td width="300px"> {{item.quantity}}</td>
              <td><button v-on:click='item.quantity++'>Add to Cart</button></td>
              <td><button v-on:click='item.quantity--'>Remove from Cart</button></td>
            </tr>
          </table>
        </div>`,
      data: () => {
        
        return {
          heading: "Welcome to the Checkout Page",
          body: " ",
          items: removeDuplicates(JSON.parse(localStorage.getItem("productsInCart")))
        }
      }

    })

    const removeDuplicates = (data) => {
      var productsFound = []
      var productsArr = []
      for (let i = 0; i < data.length; i++) {
        var indexGuessed = productsFound.indexOf(data[i]._id)
        //console.log("Index for iteration ", i, ",", indexGuessed)
        if (productsFound.indexOf(data[i]._id) == -1) {
          var product = {
            name: data[i].title,
            price: data[i].price,
            image: data[i].thumbnailLink,
            quantity: 1
          }
          productsArr.push(product)
          productsFound.push(data[i]._id)
        }
        else {
          var index = productsFound.indexOf(data[i]._id)
          var product = productsArr[index]
          product.quantity++
          productsArr[index] = product

        }
      }
      return productsArr
    }

    return { component }
  }
}
