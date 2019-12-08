module.exports.name = 'bookTests'
module.exports.dependencies = ['chai', 'chai-as-promised', 'getBook', 'getBooks', 'searchBooks']
module.exports.factory = function (chai, chai_as_promised, _getBook, _getBooks, _searchBooks) {
  'use strict'

  chai.use(chai_as_promised).should();

  describe('Book Module Test Suite', () => {

    beforeEach('Set Up for Each Test', function(){
     
    });

  });

  
}
