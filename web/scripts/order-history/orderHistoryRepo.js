module.exports = {
  scope: "heinz",
  name: "orderHistoryRepo",
  dependencies: ["Repo"],
  factory: (Repo) => {
    "use strict";

    const repo = new Repo();

    const get = (callback) => {
      repo.get({ path: `/history` }, callback);
    };

    return { get };
  },
};
