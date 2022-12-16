module.exports = {
  scope: "heinz",
  name: "cartRepo",
  dependencies: ["Repo"],
  factory: (Repo) => {
    "use strict";

    const repo = new Repo();

    const userId = localStorage.getItem("userId");

    const get = (callback) => {
      repo.get({ path: `/carts/get/${userId}` }, callback);
    };

    const add = (product, callback) => {
      const payload = {
        userId: userId,
        productId: product.uid,
      };
      repo.post({ path: `/carts`, body: payload }, callback);
    };

    const remove = (productId, callback) => {
      const payload = {
        userId: userId,
        productId,
      };
      repo.remove({ path: `/carts/remove`, body: payload }, callback);
    };

    const createStripeSession = (products, callback) => {
      const payload = {
        userId: userId,
        products,
      };
      repo.post({ path: `/carts/checkoutSession`, body: payload }, callback);
    };

    return { add, get, remove, createStripeSession };
  },
};
