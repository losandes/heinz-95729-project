module.exports = {
  scope: 'heinz',
  name: 'productsRepo',
  dependencies: ['Repo'],
  factory: (Repo) => {
    'use strict'

    const repo = new Repo()

    const get = (uid, callback) => {
      repo.get({ path: `/products/${uid}` }, callback)
    }

    const search = (query, callback) => {
      repo.get({ path: `/products?q=${query}` }, callback)
    }
	
	const getFive = () =>{
		repo.get({path:'/'})
	}

    return { get, search, getFive }
  }
}
