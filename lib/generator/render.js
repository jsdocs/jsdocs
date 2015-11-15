const async = require('async')
const assign = require('object-assign')
const documentation = require('documentation')
const formatter = documentation.formats.html

module.exports = function render (module, opts, cb) {
  opts = assign({ theme: 'jsdoc-theme', github: true }, opts)

  async.waterfall([
    (next => parse(module, opts, next)),
    ((comments, next) => formatter(comments, opts, next)),
    filter
  ], cb)
}

function parse(module, opts, next) {
  documentation([ module ], opts, next)
}

function filter(files, next) {
  const file = files
    .filter(file => file.path === 'index.html')
    .shift()

  if (!file) return next(new Error('Missing HTML output'))
  next(null, file)
}
