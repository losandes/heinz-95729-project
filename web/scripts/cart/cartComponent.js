module.exports = {
  scope: 'heinz',
  name: 'cartComponent',
  dependencies: ['Vue', 'Cart', 'cartRepo'],
  factory: (Vue, Cart, cartRepo) => {
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
        <table id="cart" class="table table-hover table-condensed cart-component">
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
                <input v-on:click="updateCart(item.quantity,item.item_uid)" type="number" min="1"  class="form-control text-center" v-model="item.quantity">
              </td>
              <td data-th="Subtotal" class="text-center">{{ (item.quantity * item.price)| numfliter}}</td>
              <td class="actions" data-th="">
                <button v-on:click="updateCart(item.quantity,item.item_uid)" class="btn btn-info btn-sm"><i class="fa fa-refresh"></i></button>
                <button v-on:click="deleteItem(item.item_uid)" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></button>								
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
      },
      methods: {
        updateCart(qt, id) {
          var body = {
            quantity: qt,
            uid: state.uid,
            item_uid: id
          }
          console.log(body);
          cartRepo.updateQuantity(body,(err,res) => {
            if(err){
              console.log(err)
              alert('Update cart failed')
              return
            }
            state.total = res.total
            state.items = res.items

          })

        },
        deleteItem(id){
          var body = {
            uid: state.uid,
            item_uid:id
          }
          cartRepo.deleteItem(body,(err,res)=>{
            if(err){
              console.log(err)
              alert('Update cart failed')
              return
            }
            state.total = res.total
            state.items = res.items
          })
        }
      },
      filters:{
        numfliter: function(value){
          value= Number(value)
          return value.toFixed(2)
        }
      }
    })

    return { component }
  }
}