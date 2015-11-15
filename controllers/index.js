const Package = require('../lib/package')
const generate = require('../lib/generate')
const storage = require('../lib/storage')
const debug = require('debug')('jsdoc:http')

exports.index = function *() {
  yield this.render('index', { title: 'JSDoc' })
}

exports.about = function *() {
  yield this.render('about', { title: 'JSDoc' })
}

exports.documentation = function *() {
  const params = this.params
  params.branch = params.branch || 'master'

  // Fetch the package config
  const pkg = new Package(params)
  const pkgData = yield (done => pkg.fetch(done))

  var content = null
  if (pkg.isUpdated()) {
    debug('package %s is up to date', pkg.key())
    content = yield (next => storage.getFile(pkg.filename(), next))
  } else {
    debug('generating documentation for package: %s', pkg.key())
    content = yield (next => generate(pkg, next))
  }

  const data = {
    title: this.params.repository,
    content: content
  }

  yield this.render('documentation', data)
}
