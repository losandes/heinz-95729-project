module.exports = {
  scope: "heinz",
  name: "orderHistoryComponent",
  dependencies: ["Vue"],
  factory: (Vue) => {
    "use strict";

    let state = {
      orders: [],
    };

    const component = Vue.component("orderHistory", {
      template: `
        <div class="shopping-history-wrapper">
          <div class="order-history-title">
            <h2 id="page">Your Order History ({{ orders.length }} orders)</h2>
          </div>
          <div class="shopping-history" v-if="orders.length > 0">
            <div class="column-labels">
              <label>Transaction ID</label>  
              <label>Purchase Date</label>
              <label>Cover</label>
              <label>Book Name</label>
              <label>Price</label>
              <label>Download</label>
            </div>

            <div class="products-wrapper">
              <div class="product" v-for="order in orders">\
                <div class="product-txId">
                  {{ order.transactionId }}
                </div>
                <div class="product-purchase">
                  {{ order.orderDate }}
                </div>
                <div class="product-image">
                  <img :src="order.thumbnailHref">
                </div>
                <div class="product-name">
                  <div class="product-title">{{ order.title }}</div>
                </div>
                <div class="product-price">{{ '$' + order.amount }}</div>
                <div class="product-download">
                <a href="javascript:void(0)">
                  <i class="fa fa-download" aria-hidden="true"></i>
                </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      data: () => {
        return state;
      },
    });

    const setOrders = (orders) => {
      state.orders = orders.map((order) => ({
        ...order,
        orderDate: new Date(parseInt(order.transactionDate)),
      }));
    };

    return { component, setOrders };
  },
};
