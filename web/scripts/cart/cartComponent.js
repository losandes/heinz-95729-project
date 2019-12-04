module.exports = {
  scope: 'heinz',
  name: 'cartComponent',
  dependencies: ['Vue','Cart'],
  factory: (Vue,Cart) => {
    'use strict'

    // if (storage.get('user') !== undefined){
    //   var state = new Cart()
    // }
    var state = new Cart()
    console.log(state)
    
    const component = Vue.component('checkout', {
      // shopping cart UI code from:https://bootsnipp.com/snippets/yP7qe, by asanti82
      template: `
      <div class="container" >
        <table id="cart" class="table table-hover table-condensed">
                <thead>
                <tr>
                  <th style="width:50%">Product</th>
                  <th style="width:10%">Price</th>
                  <th style="width:8%">Quantity</th>
                  <th style="width:22%" class="text-center">Subtotal</th>
                  <th style="width:10%"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items">
                  <td data-th="Product">
                    <div class="row">
                      <div class="col-sm-10">
                        <h4 class="nomargin">{{item.name}}</h4>
                      </div>
                    </div>
                  </td>
                  <td data-th="Price">{{item.price}}</td>
                  <td data-th="Quantity">
                    <input type="number" class="form-control text-center" :value="item.quantity">
                  </td>
                  <td data-th="Subtotal" class="text-center">{{item.quantity * item.price}}</td>
                  <td class="actions" data-th="">
                    <button class="btn btn-info btn-sm"><i class="fa fa-refresh"></i></button>
                    <button class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></button>								
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="visible-xs">
                  <td class="text-center"<strong>Total {{total}}</strong></td>
                </tr>
                <tr>
                  <td><a href="#" class="btn btn-warning"><i class="fa fa-angle-left"></i> Continue Shopping</a></td>
                  <td colspan="2" class="hidden-xs"></td>
                  <td class="hidden-xs text-center"><strong>Total $ {{total}}</strong></td>
                  <td><a href="#" class="btn btn-success btn-block">Checkout <i class="fa fa-angle-right"></i></a></td>
                </tr>
              </tfoot>
            </table>
    </div>
      `,
      data: () => {
        return state;
      }
    })

    return { component }
  }
}