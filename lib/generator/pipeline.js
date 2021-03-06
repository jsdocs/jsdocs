const fs = require('fs')
const path = require('path')
const rm = require('rimraf')
const db = require('../db')
const render = require('./render')
const providers = require('../providers')
const repository = require('../repository')
const Package = require('../package')
const storage = require('../storage')
const file = require('../file')
const debug = require('debug')('jsdoc:generator:pipeline')

/**
 * Documentation generator pipeline
 * @type {Array} pipepline
 */

module.exports = [

  function fetchRepository(ctx, next) {
    ctx.provider = providers.match(ctx.pkg.params.provider)

    if (!ctx.provider) {
      return next(new Error('Unsupported provider: ' + ctx.pkg.params.provider))
    }

    ctx.provider.fetch(ctx.pkg, (err, output) => {
      if (err) return next(err)
      ctx.output = output
      next()
    })
  },

  function resolveManifestFile(ctx, next) {
    file.resolve(ctx.output, (err, manifest) => {
      if (err) return next(err)
      ctx.manifest = manifest
      next()
    })
  },

  function readMainModule(ctx, next) {
    const manifest = ctx.manifest

    debug('Read manifest file: %s', manifest)
    if (/.js$/i.test(manifest)) return next(null, manifest)

    fs.readFile(manifest, { encoding: 'utf8' }, (err, data) => {
      if (err) return next(err)

      const json = parseJSON(data)
      if (!json) return next(new Error('Cannot read the manifest JSON file'))
      ctx.json = json

      var main = json.main || 'index.js'
      // Add extension to main module, if needed
      if (/\.js$/i.test(main) === false) main += '.js'

      ctx.module = path.join(path.dirname(manifest), main)
      next()
    })
  },

  function mainModuleExists(ctx, next) {
    fs.exists(ctx.module, exists => {
      if (exists) next()
      else next(new Error('Cannot find main module: ' + ctx.module))
    })
  },

  function generateDocs(ctx, next) {
    debug('Render documentation for entry module: %s', ctx.module)

    const opts = {
      pkg: {
        name: ctx.pkg.params.repository,
        version: ctx.json.version || 'master'
      }
    }

    render(ctx.module, opts, (err, file) => {
      if (err) return next(err)
      if (!file) return next(new Error('The documentation was not generated'))

      ctx.file = file
      next()
    })
  },

  function putGeneratedFile(ctx, next) {
    storage.putFile(ctx.pkg.filename(), ctx.file.contents, next)
  },

  function savePackage(ctx, next) {
    ctx.pkg.save(next)
  },

  function clean(ctx, next) {
    rm(ctx.output, noop)
    next()
  }

]

function parseJSON(data) {
  try {
    return JSON.parse(data)
  } catch (e) {
    return false
  }
}

function noop() {}
