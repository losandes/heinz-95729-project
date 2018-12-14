module.exports = {
  scope: 'heinz',
  name: 'homeRepo',
  dependencies: ['Repo'],
  factory: (Repo) => {
    'use strict'
	
	const repo = new Repo()
	
	const getFive = (callback) =>{
		repo.get({path:'/'},callback)
	}
	
    return { getFive }
  }
}
