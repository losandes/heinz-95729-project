module.exports = {
  scope: 'heinz',
  name: 'userCartComponent',
  dependencies: ['Vue', 'userCart'],
  factory: (Vue, userCart) => {
    'use strict'

    let state = new userCart()


    const component = Vue.component('userCart', {
      template: `
    <div class="CartContainer">  
    <div class="card">
    <div class="row2">
        <div class="col-md-8 cart">
            <div class="title">
                <div class="row">
                    <div class="col-md-6">
                        <h4><b>Reservation Checkout Page</b></h4>
                    </div>
                    <div class="col-md-6 align-self-center text-right text-muted">3 items</div>
                </div>
            </div>

            <div class="row">
                <div class="row2 main2 align-items-center">
                    <div class="col-md-3"><img class="img-fluid" src="https://i.imgur.com/F2NgFBg.jpeg"></div>
                    <div class="col-md-3">
                        
                        <div class="row2">Table at Moti Mahal</div>
                    </div>
                    <div class="col-md-3"> <a href="#">-</a><a href="#" class="border">1</a><a href="#">+</a> </div>
                    <div class="col-md-3">&dollar; 44.00 <span class="close">&#10005;</span></div>
                </div>
            </div>

            <div class="row">
                <div class="row2 main2 align-items-center">
                    <div class="col-md-3"><img class="img-fluid" src="https://i.imgur.com/kQO0TKd.jpeg"></div>
                    <div class="col-md-3">
                        
                        <div class="row2">Table at El Jardin</div>
                    </div>
                    <div class="col-md-3"> <a href="#">-</a><a href="#" class="border">1</a><a href="#">+</a> </div>
                    <div class="col-md-3">&dollar; 44.00 <span class="close">&#10005;</span></div>
                </div>
            </div>
            <div class="row">
                <div class="row2 main2 align-items-center">
                    <div class="col-md-3"><img class="img-fluid" src="https://i.imgur.com/mPS9Zhi.jpeg"></div>
                    <div class="col-md-3">
                        
                        <div class="row2">Table at Don Roth's</div>
                    </div>
                    <div class="col-md-3"> <a href="#">-</a><a href="#" class="border">1</a><a href="#">+</a> </div>
                    <div class="col-md-3">&dollar; 44.00 <span class="close">&#10005;</span></div>
                </div>
            </div>
            <div class="back-to-shop"><a href="#">&leftarrow;</a><span class="text-muted">Back to restaurant selection</span></div>
        </div>
        <div class="col-md-4 summary">
            <div>
                <h5><b>Summary</b></h5>
            </div>
            <hr>
            <div class="row2">
                <div class="col-md-6" style="padding-left:0;">ITEMS 3</div>
                <div class="col-md-6 text-right">&dollar; 132.00</div>
            </div>
            <form>
                <h5>Booking Fee</h5> 
                <select>
                    <option class="text-muted">Standard-Reservation-Fee- &dollar;2.00</option>
                </select>
            </form>
            <div class="row2" style="border-top: 1px solid rgba(0,0,0,.1); padding: 2vh 0;">
                <div class="col-md-6">TOTAL PRICE</div>
                <div class="col-md-6 text-right">&dollar; 134.00</div>
            </div> <button v-on:click="reservationDetails" class="btn2">CHECKOUT</button>
        </div>
    </div>
</div>
</div>
    `,
      data: function () {
        return state
      },
    })

    const setUserCart = (usercart) =>{
      state = usercart
    }

    return { component, setUserCart }
  },
}
