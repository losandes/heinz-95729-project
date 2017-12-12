module.exports = {
  scope: 'heinz',
  name: 'locale::en_US',
  dependencies: false,
  factory: {
    'title': 'Grocr',
    'pages': {
      'home': {
        'heading': 'Welcome to Grocr!',
        'body': 'To get started, you can search for groceries (or books). Try "chocolate", "cookies", "beverage", "strawberries", "india", "tropper", "di", "world", or "novel". If nothing returns, make sure you ran `npm run seed`.'
      }
    },
    'errors': {
      'e403': {
        'heading': '403',
        'body': 'Access denied'
      },
      'e404': {
        'heading': '404',
        'body': '{{path}} was not found'
      },
      'e500': {
        'heading': 'Whoops!',
        'body': 'Something went terribly wrong.'
      }
    }
  }
}
