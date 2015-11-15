const async = require('async')
const assign = require('object-assign')
const documentation = require('documentation')
const formatter = documentation.formats.html

module.exports = function render (module, opts, cb) {
  opts = assign({ theme: 'jsdoc-theme' }, opts)

  async.waterfall([
    (next => parse(module, next)),
    ((comments, next) => formatter(comments, opts, next)),
    filter
  ], cb)
}

function parse(module, next) {
  documentation([ module ], {}, next)
}

function filter(files, next) {
  const file = files
    .filter(file => file.path === 'index.html')
    .shift()

  if (!file) return next(new Error('Missing HTML output'))
  next(null, file)
}
