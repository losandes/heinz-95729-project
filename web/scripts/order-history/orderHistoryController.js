module.exports = {
  scope: "heinz",
  name: "orderHistoryController",
  dependencies: [
    "router",
    "orderHistoryComponent",
    "orderHistoryRepo",
    "environment",
  ],
  factory: (router, orderHistoryComponent, orderHistoryRepo, env) => {
    "use strict";

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes(app) {
      router("/history", () => {
        orderHistoryRepo.get((err, orders) => {
          orderHistoryComponent.setOrders(orders);
        });
        app.currentView = "orderHistory";
      });
    }

    return { registerRoutes };
  },
};
