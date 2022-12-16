module.exports = {
  scope: "heinz",
  name: "orderHistoryRepo",
  dependencies: ["Repo"],
  factory: (Repo) => {
    "use strict";

    const repo = new Repo();
    const userId = localStorage.getItem("userId");

    const get = (callback) => {
      repo.get({ path: `/orderHistory/${userId}` }, callback);
    };

    const add = (products, callback) => {
      const orders = products.map((product) => ({
        ...product,
        userId,
        transactionId: Math.random()
          .toString(36)
          .slice(2, 16)
          .toLocaleUpperCase(),
      }));
      const payload = { orders };
      repo.post({ path: `/orderHistory`, body: payload }, callback);
    };

    return { add, get };
  },
};
