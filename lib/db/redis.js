const redis = require('redis')

/**
 * Redis storage layer.
 * Expose the Redis client
 *
 * @property redis
 */

const uri = process.env.JSDOCS_REDIS_URI
const db = exports.redis = redis.createClient(uri)

/**
 * Retrieves a hash of values for the given key
 *
 * @param {String} key
 * @param {Function} cb
 * @method get
 */

exports.get = function (key, cb) {
  db.hgetall(key, cb)
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
  db.hmset(key, values, cb)
}

/**
 * Removes a key and values from the database
 *
 * @param {String} key
 * @param {Function} cb
 * @method remove
 */

exports.remove = function (key, cb) {
  db.del(key, cb)
}

/**
 * Performs a key search based on the given pattern
 *
 * @param {String} pattern
 * @param {Function} cb
 * @method search
 */

exports.search = function (pattern, cb) {
  db.scan(10, ['MATCH', '*' + pattern + '*'], (err, data) => {
    if (err) return cb(err)
    cb(null, data.pop())
  })
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
  db.hincrby(key, field, 1, cb)
}

/**
 * Retrieve a set of keys range
 *
 * @param {Number} limit
 * @param {Function} cb
 * @method range
 */

exports.range = function (limit, cb) {
  db.scan(limit, (err, keys) => {
    if (err) return cb(err)
    cb(null, keys.pop())
  })
}
