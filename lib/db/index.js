const config = require('../config')
const layers = require('indexport')(__dirname)

module.exports = config.env === 'development'
  ? layers.memory
  : layers.redis
