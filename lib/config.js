/**
 * Current runtime environment
 * @property {String} env
 */

exports.env = process.env.NODE_ENV || 'development'

/**
 * Defines the maximum package refresh TTL
 * @property {Number} refreshTTL
 */

exports.refreshTTL = exports.env === 'production'
  ? 1000 * 60 * 60 * 24 * 7
  : -1

/**
 * Define storage layer configuration
 * @property {Object} storage
 */

exports.storage = {
  bucket: 'jsdocs-storage'
}
