const fs = require('fs')
const knox = require('knox')
const env = process.env

module.exports = S3Provider

/**
 * Creates a new S3 provider
 * @param {Object} opts - S3 client options
 * @class S3Provider
 * @constructor
 */

function S3Provider(opts) {
  this.opts = opts || {}
  this.s3 = knox.createClient({
    key: this.opts.key || env.JSDOC_S3_KEY,
    secret: this.opts.secret || env.JSDOC_S3_SECRET,
    bucket: this.opts.bucket || env.JSDOC_S3_BUCKET || 'jsdoc-production'
  })
}

/**
 * Upload a new file to S3 sucket
 * @param {Path} path - Target file path
 * @param {File} file - req.file object
 * @param {Function} cb - callback
 * @method getFile
 */

S3Provider.prototype.putFile = function (path, file, cb) {
  var req = this.s3.put(path, {
    'Content-Length': file.size,
    'Content-Type': file.mimetype
  })

  req.on('error', resolver)
  req.on('response', function (res) {
    if (res.statusCode !== 200) {
      return resolver(new Error('Cannot upload the file: invalid status'))
    }
    resolver(null, res)
  })

  function resolver(err, res) {
    fs.unlink(file.path)
    cb(err, res)
  }

  fs.createReadStream(file.path).pipe(req)
}

/**
 * Remove file from S3 bucket
 * @param {String} path - S3 file path
 * @param {Function} cb - callback
 * @method removeFile
 */

S3Provider.prototype.removeFile = function (path, cb) {
  this.s3.deleteFile(path, cb || noop)
}

/**
 * Get file contents
 * @param {String} path - S3 file path
 * @param {Function} cb - callback
 * @method getFile
 */

S3Provider.prototype.getFile = function (path, cb) {
  this.s3.getFile(path, function (err, res) {
    if (err) return cb(err)
    if (res.statusCode >= 400) return next(new Error('Invalid response status'))

    const buf = []
    res.on('error', cb)
    res.on('data', data => buf.push(data.toString()))
    res.on('end', () => cb(null, buf.join('')))
  })
}

function noop () {}
