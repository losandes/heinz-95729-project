module.exports = {
  scope: 'heinz',
  name: 'locale::en_US',
  dependencies: false,
  factory: {
    title: 'Papyr',
    pages: {
      home: {
        heading: 'Welcome to Papyr!',
        body: 'To get started, you can search for books. Try "adams", "wild", "robbins", "swamp", "india", "tropper", "di", "world", or "novel". If nothing returns, make sure you ran `npm run seed`.',
      },
    },
    errors: {
      e403: {
        heading: '403',
        body: 'Access denied',
      },
      e404: {
        heading: '404',
        body: '{{path}} was not found',
      },
      e500: {
        heading: 'Whoops!',
        body: 'Something went terribly wrong.',
      },
    },
  },
}
