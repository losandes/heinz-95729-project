module.exports = {
  scope: "heinz",
  name: "cartComponent",
  dependencies: ["Vue", "environment"],
  factory: (Vue, env) => {
    "use strict";

    const taxPerc = 0.05;
    let state = {
      products: [],
      subTotal: 0,
      tax: 0.05,
      shipping: 4.99,
      cartTotal: 0,
    };

    const component = Vue.component("cart", {
      mounted: () => {
        state.products = []; // clear previous items
        // get added products from localStorage
        const cart = JSON.parse(localStorage.getItem("cart") || "{}");

        for (const key in cart) {
          state.products.push(cart[key]);
        }
        calculateTotal();
      },

      template: `
        <div class="shopping-cart-wrapper">
          <div class="cart-title">
            <h2 id="page">Your Shopping Cart ({{ products.length }} products)</h2>
            <button class="checkout" v-on:click="checkout" v-if="products.length > 0">Checkout</button>
          </div>
          <div class="shopping-cart" v-if="products.length > 0">
            <div class="column-labels">
              <label>Image</label>
              <label>Book Name</label>
              <label>Price</label>
              <label>Edit</label>
            </div>

            <div class="products_wrapper">
              <div class="product" v-for="product in products">
                <div class="product-image">
                  <img :src="product.thumbnailHref">
                </div>
                <div class="product-name">
                  <div class="product-title">{{ product.title }}</div>
                </div>
                <div class="product-price">{{ "$" + product.price }}</div>
                <div class="product-removal">
                  <button class="remove-product" v-on:click="removeProduct(product.id)">Remove</button>
                </div>
              </div>
            </div>

            <div :v-if="cartTotal > 0">
              <div class="totals">
                <div class="totals-item">
                  <label class="total">Subtotal</label>
                  <div class="totals-value" id="cart-subtotal">{{ subTotal }}</div>
                </div>
                <div class="totals-item">
                  <label class="total">Tax (5%)</label>
                  <div class="totals-value" id="cart-tax">{{ tax }}</div>
                </div>
                <div class="totals-item">
                  <label class="total111">Shipping</label>
                  <div class="totals-value" id="cart-shipping">{{ shipping }}</div>
                </div>
                <div class="totals-item totals-item-total">
                  <label class="total">Grand Total</label>
                  <div class="totals-value" id="cart-total">{{ cartTotal }}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      `,
      data: () => {
        return state;
      },
      methods: {
        removeProduct: (productId) => {
          state.products = state.products.filter(
            (product) => product.id != productId
          );
          calculateTotal();
          updateLocalStorage();
        },
        checkout: async () => {
          const stripe = Stripe(env.get("STRIPE_SECRET"));
          window.location.href =
            "https://buy.stripe.com/test_eVa14l3XMeaF2l2000";
        },
      },
    });

    const calculateTotal = () => {
      state.cartTotal = 0;
      state.subTotal = 0;
      state.products.forEach((product) => {
        state.subTotal += product.price;
      });
      state.subTotal = +parseFloat(state.subTotal).toFixed(2);
      state.tax = +parseFloat(taxPerc * state.subTotal).toFixed(2);
      state.cartTotal = +parseFloat(
        state.subTotal + state.tax + state.shipping
      ).toFixed(2);
    };

    const updateCounter = () => {
      let counter = state.products.length;
    };
    const updateLocalStorage = () => {
      localStorage.clear("cart");
      const cart = {};
      for (let product of state.products) {
        cart[product.id] = product;
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    };

    return { component, calculateTotal, updateLocalStorage, updateCounter };
  },
};
