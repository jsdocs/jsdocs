const app = require('koa')()
const handlebars = require('koa-handlebars')
const Router = require('koa-router')
const config = require('./config')
const debug = require('debug')('jsdoc')
const providers = require('./lib/providers')
const version = require('./package.json').version

app.env = config.env
app.name = config.name
app.keys = config.keys

// Register middleware generators
app.use(require('koa-static')(config.static.directory))
app.use(handlebars(config.handlebars))

// Configure the router
const router = new Router()
const siteController = require('./controllers')

// Param validator
router.param('provider', function *(provider, next) {
  var matches = providers.match(provider)
  if (matches) return yield next

  this.status = 400
  yield this.render('error', { message: 'Unsupported provider: ' + provider })
})

router.get('/', siteController.index)
router.get('/about', siteController.index)
router.get('/search', siteController.index)
router.get('/packages', siteController.index)
router.get('/:provider/:organization/:repository', siteController.documentation)
router.get('/:provider/:organization/:repository/v/:branch', siteController.documentation)

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
