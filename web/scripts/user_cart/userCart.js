module.exports = {
  scope: 'heinz',
  name: 'userCart',
  dependencies: ['router', 'Product'],
  factory: (router, Product) => {
    'use strict'

    return function userCart (reservation) {
      const self = new Product(reservation)
      reservation = Object.assign({}, reservation)

      // override product's `viewDetails` function to redirect to books
      self.reservationDetails = (event) => {
        fetch("http://localhost:3002/reservation-session", {
          method: "POST",
          headers: {
            "Content-Type":"application/json",
          },
          body: JSON.stringify({
            items: [
              {id:1, quantity: 2},
              {id:2, quantity: 3}
            ],
          }),
        }).then(res => {
          if(res.ok) return res.json()
          return res.json().then(json => Promise.reject(json))
        }).then(({url }) => {
          window.location = url
          // console.log(url)
        }).catch(e => {
          console.error(e.error)
        })
      }
      return self
    }
  },
}
