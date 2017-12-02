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
          <table>
            <th>
              <td width="300px"> Product Name     </td>
              <td width="300px"> Product Price    </td>
              <td width="300px"> Product Quantity </td>
            </th>
            <tr v-for='item in items'>
              <td width="300px"> {{item.title}}    </td>
              <td width="300px"> {{item.price}}   </td>
              <td width="300px"> 1                </td>
            </tr>
          </table>
        </div>`,
      data: () => {
        
        return {
          heading: "Welcome to the Checkout Page",
          body: " ",
          items: JSON.parse(localStorage.getItem("productsInCart"))
        }
      }

    })

    return { component }
  }
}
