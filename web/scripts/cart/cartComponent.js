module.exports = {
  scope: "heinz",
  name: "cartComponent",
  dependencies: ["Vue", "cartRepo"],
  factory: (Vue, cartRepo) => {
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
      template: `
        <div class="shopping-cart-wrapper">
          <div class="cart-title">
            <h2 id="page">Your Shopping Cart ({{ products.length }} products)</h2>
            <button class="checkout" v-on:click="checkout" v-if="products.length > 0">Checkout</button>
          </div>
          <div class="shopping-cart" v-if="products.length > 0">
            <div class="column-labels">
              <label>Cover</label>
              <label>Product Name</label>
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
                  <button class="remove-product" v-on:click="removeProduct(product.productId)">Remove</button>
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
          cartRepo.remove(productId, (err, result) => {
            if (result && result.deleted) {
              removeProductFromCart(productId);
            }
          });
        },
        checkout: async () => {
          cartRepo.createStripeSession(state.products, (err, sessionObj) => {
            window.location.href = sessionObj.session.url;
          });
        },
      },
    });

    const setProducts = (products) => {
      if (products && typeof Array.isArray(products)) {
        state.products = products;
      }
      calculateTotal();
    };

    const calculateTotal = () => {
      state.cartTotal = 0;
      state.subTotal = 0;

      let productTotal = 0;
      state.products.forEach((product) => {
        productTotal += parseFloat(product.price);
      });
      state.subTotal = productTotal;

      state.subTotal = +parseFloat(state.subTotal).toFixed(2);
      state.tax = +parseFloat(taxPerc * state.subTotal).toFixed(2);
      state.cartTotal = +parseFloat(
        state.subTotal + state.tax + state.shipping
      ).toFixed(2);
    };

    const removeProductFromCart = (productId) => {
      state.products = state.products.filter(
        (product) => product.productId != productId
      );
      calculateTotal();
    };

    const getProducts = () => {
      return state.products;
    };

    return {
      component,
      getProducts,
      setProducts,
      calculateTotal,
    };
  },
};
