const db = require('./db')
const Package = require('./package')

module.exports = Repository

function Repository(database) {
  this.db = database || db
}

Repository.prototype.search = function (pattern, cb) {
  this.db.search(pattern, cb)
}

Repository.prototype.getPackage = function (pkg, cb) {
  this.db.get(pkg, (err, pkg) => {
    if (err) return cb(err)
    cb(null, pkg)
  })
}

Repository.prototype.updatePackage = function (name, params, cb) {

}

Repository.prototype.createPackage = function (params, cb) {
  var pkg = new Package(params)
  pkg.setDatabase(thid.db)
  return pkg
}
