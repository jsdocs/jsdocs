const app = require('koa')()
const handlebars = require('koa-handlebars')
const Router = require('koa-router')
const config = require('./config')
const debug = require('debug')('jsdoc')
const providers = require('./lib/providers')
const controllers = require('./controllers')

app.env = config.env
app.name = config.name
app.keys = config.keys

// Register middleware generators
app.use(require('koa-static')(config.static.directory))
app.use(handlebars(config.handlebars))

// Configure the router
const router = new Router()

// Param validator
router.param('provider', function *(provider, next) {
  var matches = providers.match(provider)
  if (matches) return yield next

  this.status = 400
  yield this.render('error', { message: 'Unsupported provider: ' + provider })
})

// Register routes
router.get('/', controllers.main)
router.get('/about', controllers.about)
router.get('/search', controllers.main)
router.get('/:provider/:organization/:repository', controllers.documentation)
router.get('/:provider/:organization/:repository/v/:branch', controllers.documentation)

app.use(router.middleware())

// Final handler
app.use(function *() {
  this.status = 404
  yield this.render('error', {})
})

// Exports the server
if (require.main !== module) return module.exports = app

// Or listen if it's the main module
app.listen(+config.port || 3000, function () {
	console.log('Server running on port ' + config.port || 3000)
})
