const Repository = require('../lib/repository')

module.exports = function *() {
  const repo = new Repository
  const query = this.query.q

  const results = yield (next => repo.search(query, next))

  yield this.render('search', {
    title: 'Search ' + query,
    results: results,
    query: query
  })
}
