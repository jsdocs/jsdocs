const Package = require('../lib/package')
const generator = require('../lib/generator')
const storage = require('../lib/storage')
const debug = require('debug')('jsdoc:controllers')

module.exports = function *() {
  const params = this.params

  // Fetch the package config
  const pkg = new Package(params)
  const pkgData = yield (done => pkg.fetch(done))

  var content = null

  // If the package was already fetched and up to date
  if (pkg.isUpdated()) {
    debug('package %s is up to date', pkg.key())
    content = yield (next => storage.getFile(pkg.filename(), next))
  }

  // Otherwise generate a fresh documentation
  if (!pkg.isUpdated() || !content) {
    debug('generating documentation for package: %s', pkg.key())
    content = yield (next => generator.generate(pkg, next))
  }

  // Render the view
  const data = {
    title: this.params.repository,
    content: content
  }
  yield this.render('documentation', data)
}
