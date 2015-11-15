const util = require('util')
const async = require('async')
const git = require('../scm/git')
const network = require('../network')

const GithubProvider = module.exports = {}

/**
 * Implements a Github repository providers
 *
 * @class GithubProfier
 */

GithubProvider.match = function (name) {
  return /^github.com$/i.test(name)
}

GithubProvider.fetch = function (pkg, cb) {
  const url = pkg.gitUrl()

  async.series([
    (next => this.check(url, next)),
    (next => this.clone(url, pkg, next))
  ], (err, results) => {
    if (err) return cb(err)
    cb(null, results.pop())
  })
}

GithubProvider.clone = function (url, pkg, next) {
  git.clone(url, pkg, next)
}

GithubProvider.check = function (url, next) {
  network.httpCheck(url, next)
}
