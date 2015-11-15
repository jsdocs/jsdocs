const providers = exports.providers = require('indexport')(__dirname)

exports.match = function (pkg) {
  return Object.keys(providers)
  .map(name => providers[name])
  .reduce(function (match, provider) {
    if (match) return match
    if (provider.match(pkg)) return provider
  }, null)
}
