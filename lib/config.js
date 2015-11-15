
/**
 * Current runtime environment
 * @property {String} env
 */

exports.env = process.env.NODE_ENV || 'development'

exports.packageTTL = exports.env === 'production'
  ? 1000 * 60 * 60 * 24 * 7
  : -1
