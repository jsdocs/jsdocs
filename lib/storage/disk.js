const fs = require('fs')
const path = require('path')
const mk = require('mkdirp')
const async = require('async')

module.exports = DiskProvider

/**
 * Creates a new disk storage provider
 *
 * @param {Object} opts
 * @class DiskProvider
 * @constructor
 */

function DiskProvider(opts) {
  this.opts = opts || {}
  this.opts.directory = '.storage'
}

/**
 * Saves a new file into disk
 *
 * @param {Path} filename
 * @param {File} data
 * @param {Function} cb
 * @method getFile
 */

DiskProvider.prototype.putFile = function (filename, data, cb) {
  const target = this.targetPath(filename)
  async.series([
    (next => mk(path.dirname(target), next)),
    (next => fs.writeFile(target, data, next))
  ], cb)
}

/**
 * Removes a file
 *
 * @param {String} filename
 * @param {Function} cb
 * @method removeFile
 */

DiskProvider.prototype.removeFile = function (filename, cb) {
  fs.unlink(this.targetPath(filename), cb || noop)
}

/**
 * Reads a file as Buffer
 *
 * @param {String} filename
 * @param {Function} cb
 * @method getFile
 */

DiskProvider.prototype.getFile = function (filename, cb) {
  const path = this.targetPath(filename)
  fs.readFile(path, (err, data) => cb(null, data || null))
}

/**
 * Returns the full file target path for an incoming operation.
 * This method is used internally as helper.
 *
 * @param {String} filename
 * @method targetPath
 */

DiskProvider.prototype.targetPath = function (filename) {
  return path.join(this.opts.directory, filename)
}

function copy(file, target, done) {
  fs.createReadStream(file.path)
    .pipe(fs.createWriteStream(target))
    .on('error', done)
    .on('finish', done)
}

function noop () {}
