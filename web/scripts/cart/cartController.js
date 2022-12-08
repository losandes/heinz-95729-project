module.exports = {
  scope: "heinz",
  name: "cartController",
  dependencies: ["router", "cartComponent", "cartRepo", "environment"],
  factory: (router, cartComponent, cartRepo, env) => {
    "use strict";

    // we save all added products here after querying the database
    let state = {
      addedProducts: {},
      paymentStatus: "",
    };

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes(app) {
      router("/checkout", () => {
        state.paymentStatus = "";
        app.currentView = "cart";
      });
      router("/checkout/:status", () => {
        console.log("Payment success!");
        state.paymentStatus = context.params.status;
        app.currentView = "cart";
      });
    }

    return { registerRoutes };
  },
};
