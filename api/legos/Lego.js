module.exports.name = 'Lego'
module.exports.dependencies = ['@polyn/immutable']
module.exports.factory = (_immutable) => {
  'use strict'

  const { immutable } = _immutable

  return immutable('Lego', {
    color: 'string',
    width: 'number',
    length: 'number',
    height: 'number'
  })
}
