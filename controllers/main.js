const Repository = require('../lib/repository')

module.exports = function *() {
  const repo = new Repository
  const recent = yield (next => repo.updatedRecently(next))

  yield this.render('index', {
    title: 'Welcome to JSDoc',
    recent: recent
  })
}
