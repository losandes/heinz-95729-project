module.exports = {
  scope: "heinz",
  name: "cartController",
  dependencies: ["router", "cartComponent", "cartRepo", "orderHistoryRepo"],
  factory: (router, cartComponent, cartRepo, orderHistoryRepo) => {
    "use strict";
    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes(app) {
      router("/checkout", () => {
        getAndSetProductsInCart();
        app.currentView = "cart";
      });

      router("/checkout/success", () => {
        app.currentView = "cart";
        getAndSetProductsInCart((products) => {
          products = products.map((product) => ({
            ...product,
            amount: parseFloat(product.price),
            price: undefined,
          }));
          if (products.length) {
            orderHistoryRepo.add(products, (err, result) => {
              if (!err && result) {
                // success
                cartComponent.setProducts([]);
              }
            });
            alert("Payment successful!");
          }
        });
      });

      router("/checkout/cancel", () => {
        app.currentView = "cart";
        getAndSetProductsInCart();
        alert("Payment failed!");
      });
    }

    const getAndSetProductsInCart = (callback) => {
      cartRepo.get((err, products) => {
        if (err) {
          throw new Error(err);
        }
        cartComponent.setProducts(products);
        callback(products);
      });
    };

    return { registerRoutes };
  },
};
