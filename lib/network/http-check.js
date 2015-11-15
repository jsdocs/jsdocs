const request = require('superagent')

/**
 * Perform an HTTP/S request to a certain URL, resolving
 * with an error if the response status is not 200.
 *
 * @param {String} url
 * @param {Function} cb
 * @method httpCheck
 */

module.exports = function httpCheck (url, cb) {
  request(url)
    .set('User-Agent', 'git/2.3.2')
    .end((err, res) => {
      if (err) return cb(err)
      if (res.status !== 200) return cb(new Error('Invalid server response status'))
      cb(null, res)
    })
}
