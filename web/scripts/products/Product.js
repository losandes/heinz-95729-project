module.exports = {
  scope: "heinz",
  name: "Product",
  dependencies: ["router", "cartRepo"],
  factory: (router, cartRepo) => {
    "use strict";

    return function Product(product) {
      product = Object.assign({}, product);

      const self = {
        type: product.type || "product",
        id: product.id,
        uid: product.uid,
        title: product.title,
        description: product.description,
        metadata: product.metadata,
        price: product.price,
        images: [],
        thumbnailHref: product.thumbnailHref || "/images/products/default.png",
        thumbnailAlt: `thumbnail for ${product.title}`,
        showThumbnail: product.thumbnailHref != null,
        detailsLink: `/${product.type}/${product.uid}`,
      };

      self.viewDetails = (event) => {
        if (!self.uid) {
          // this must be the default VM
          return;
        }

        switch (self.type) {
          case "book":
            router.navigate(`/books/${self.uid}`);
            break;
          default:
            router.navigate(`/products/${self.uid}`);
            break;
        }
      };

      // add selected items to a cart object and save to localStorage
      self.addToCart = (event) => {
        cartRepo.add(self, () => {
          console.log("Product added...");
        });

        // show toast
        Toastify({
          text: "Product added to cart",
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
      };

      return self;
    };
  },
};
