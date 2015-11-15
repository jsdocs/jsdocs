const fs = require('fs')
const path = require('path')
const async = require('async')
const debug = require('debug')('jsdoc:fs:resolve')

const manifestFiles = ['package.json', 'bower.json', 'component.json', 'index.js']

module.exports = function resolve (basepath, next) {
  debug('Resolve package manifest: %s', basepath)

  const lookups = manifestFiles.map(file => path.join(basepath, file))
  async.filter(lookups, fs.exists, files => {
    if (!files.length) return next(new Error('Cannot find the package manifest file'))
    next(null, files.shift())
  })
}
