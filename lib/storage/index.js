const config = require('../../config')
const env = process.env.NODE_ENV

const Provider = env === 'production'
  ? require('./s3')
  : require('./disk')

module.exports = new Provider(config.storage)
