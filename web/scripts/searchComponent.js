module.exports = {
  name: 'searchComponent',
  dependencies: ['router', 'viewEngine', 'Repo'],
  factory: function (router, viewEngine, Repo) {
    'use strict'

    const resultsTemplate = `
<div class="product-component">
  <div class="row">
    <div v-for="product in products">
      <div class="col-sm-6 col-md-4 product-col">
        <div class="thumbnail">
          <a class="thumbnail-img" href="javascript:void(0);" v-on:click="product.viewDetails">
            <img :src="product.thumbnailLink" :alt="product.thumbnailAlt">
          </a>

          <div class="caption">
            <h3><a href="javascript:void(0);" v-on:click="product.viewDetails">{{product.title}}</a></h3>
            <div class="description">{{product.description}}</div>
            <div class="overlay"></div>
            <a class="buy-now" href="javascript:void(0);">{{product.price}}</a>
          </div>
        </div>
      </div>
    </div> <!-- /products -->
  </div><!-- /row -->
</div><!-- /component -->`

    const detailsTemplate = `
<div class="book-component details">
  <figure class='book'>
  <!-- Front -->
    <ul class='hardcover_front'>
      <li>
        <img v-if="showThumbnail" :src="thumbnailLink" :alt="thumbnailAlt">
        <div v-else class="coverDesign yellow"></div>
      </li>
      <li></li>
    </ul>
  <!-- Pages -->
    <ul class='page'>
      <li></li>
      <li>
        <a class="btn" :href="detailsLink">READ MORE</a>
      </li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  <!-- Back -->
    <ul class='hardcover_back'>
      <li></li>
      <li></li>
    </ul>
    <ul class='book_spine'>
      <li></li>
      <li></li>
    </ul>
    <figcaption>
      <h1>{{title}}</h1>
      <div v-for="author in authors">
        <span>{{author.name}}</span>
      </div>
      <div>{{description}}</div>
    </figcaption>
  </figure>
  <div class="purchase">
    <button class="btn btn-success btn-buy">{{price}}</button>
  </div>
</div>`

    /**
     *
     * @param {*} input
     */
    function Product (input) {
      // TODO
      return input
    }

    function ProductViewModel (product) {
      product = Object.assign({}, product)

      const self = {
        type: product.type || 'product',
        _id: product._id,
        uid: product.uid,
        title: product.title,
        description: product.description,
        metadata: product.metadata,
        price: product.price,
        images: [],
        thumbnailLink: product.thumbnailLink || '/images/products/default.png',
        thumbnailAlt: `thumbnail for ${product.title}`,
        showThumbnail: product.thumbnailLink != null,
        detailsLink: `/${product.type}/${product.uid}`,
        authors: product.metadata && Array.isArray(product.metadata.authors)
          ? product.metadata.authors
          : []
      }

      self.viewDetails = (event) => {
        viewEngine.render({
          name: 'product',
          template: detailsTemplate,
          vm: self
        })
      }

      return self
    }

    function ProductsViewModel (products) {
      if (!Array.isArray(products)) {
        return {
          products: []
        }
      }

      return {
        products: products.map(product => new ProductViewModel(product))
      }
    }

    const products = (function () {
      const repo = new Repo({ Model: Product })

      const search = (query, callback) => {
        repo.get({ path: `/products?q=${query}` }, callback)
      }

      return { search }
    }())

    const makeSearchHandler = (getQuery) => {
      return function (event) {
        viewEngine.render({
          name: 'loading',
          vm: null
        })

        products.search(getQuery(), (err, products) => {
          if (err) {
            console.log(err)
            // TODO: render error view
          }

          viewEngine.render({
            name: 'searchResults',
            template: resultsTemplate,
            vm: new ProductsViewModel(products)
          })
        })
      }
    }

    return { makeSearchHandler }
  }
}
