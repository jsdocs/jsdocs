const path = require('path')
const version = require('./package.json').version
const env = process.env.NODE_ENV || 'development'
const port = +process.env.PORT || 3000
const DEBUG = env !== 'production'

module.exports = {
  name: 'jsdoc',
  env: env,
  port: port,

  static: {
    directory: path.resolve(__dirname, 'assets')
  },

  handlebars: {
    viewsDir: 'views',
    cache: env === 'production',
    partialsDir: 'views/partials',
    layoutsDir: 'views/layouts',
    defaultLayout: 'main',
    data: { env: env, version: version }
  },

  error: {
    view: 'error/error',
    layout: 'layouts/error',
    custom: {
      401: 'error/401',
      403: 'error/403',
      404: 'error/404',
    }
  }
}
