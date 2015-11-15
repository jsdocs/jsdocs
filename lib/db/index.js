const config = require('../config')
const layers = require('indexport')(__dirname)

module.exports = config.env === 'testing'
  ? layers.memory
  : layers.redis
