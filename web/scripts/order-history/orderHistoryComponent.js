module.exports = {
  scope: "heinz",
  name: "orderHistoryComponent",
  dependencies: ["Vue"],
  factory: (Vue) => {
    "use strict";

    let state = {
      products: [],
    };

    const component = Vue.component("orderHistory", {
      mounted: () => {
        state.products = []; // clear previous items
        // get added products from localStorage
        const cart = JSON.parse(localStorage.getItem("cart") || "{}");
        for (const key in cart) {
          state.products.push(cart[key]);
        }
        state.products = state.products.map((product) => {
          return {
            ...product,
            transactionID: Math.random()
              .toString(36)
              .slice(2, 16)
              .toLocaleUpperCase(),
          };
        });
      },
      template: `
        <div class="shopping-history-wrapper">
          <div class="order-history-title">
            <h2 id="page">Your Order History ({{ products.length }} orders)</h2>
          </div>
          <div class="shopping-history" v-if="products.length > 0">
            <div class="column-labels">
              <label>Transaction ID</label>  
              <label>Purchase Date</label>
              <label>Cover</label>
              <label>Book Name</label>
              <label>Price</label>
              <label>Download</label>
            </div>

            <div class="products-wrapper">
              <div class="product" v-for="product in products">\
                <div class="product-txId">
                  {{ product.transactionID }}
                </div>
                <div class="product-purchase">
                  8th Dec, 2022
                </div>
                <div class="product-image">
                  <img :src="product.thumbnailHref">
                </div>
                <div class="product-name">
                  <div class="product-title">{{ product.title }}</div>
                </div>
                <div class="product-price">{{ '$' + product.price }}</div>
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
      methods: {},
    });

    return { component };
  },
};
