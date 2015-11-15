const assign = require('object-assign')

/**
 * In-memory volatile storage layer.
 *
 * @property store
 */

const store = exports.store = Object.create(null)

/**
 * Retrieves a hash of values for the given key
 *
 * @param {String} key
 * @param {Function} cb
 * @method get
 */

exports.get = function (key, cb) {
  cb(null, store[key] || null)
}

/**
 * Writes a hash of values in the given key
 *
 * @param {String} key
 * @param {Object} values
 * @param {Function} cb
 * @method set
 */

exports.set = function (key, values, cb) {
  store[key] = assign({}, values)
  cb(null, values)
}

/**
 * Removes a key and values from the database
 *
 * @param {String} key
 * @param {Function} cb
 * @method remove
 */

exports.remove = function (key, cb) {
  store[key] = undefined
  cb(null)
}

/**
 * Performs a key search based on the given pattern
 *
 * @param {String} pattern
 * @param {Function} cb
 * @method search
 */

exports.search = function (pattern, cb) {
  const regex = new RegExp('^' + pattern)
  const matches = Object.keys(store).filter(key => {
    return regex.test(key)
  })
  cb(null, matches)
}

/**
 * Increment the counter for the given hash field
 *
 * @param {String} key
 * @param {String} field
 * @param {Function} cb
 * @method increment
 */

exports.increment = function (key, field, cb) {
  const hash = this.get(key)
  if (!hash) return cb(new Error('not found'))

  var value = +hash[field]
  if (!value) hash[field] = 0

  hash[field] += value
  cb(null, hash)
}
