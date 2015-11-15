const async = require('async')
const rm = require('rimraf')
const mk = require('mkdirp')
const spawn = require('child_process').spawn
const uuid = require('lil-uuid')
const debug = require('debug')('jsdoc:scm:git')
const maxTimeout = 30 * 1000

exports.clone = function (uri, opts, cb) {
  const output = opts.output || '.tmp/' + uuid()

  const args = []
  args.push('clone')
  args.push('--single-branch')
  args.push('-b', opts.branch || 'master')
  args.push(uri)
  args.push(output)

  debug('Cloning repository: git %s', args.join(' '))

  async.series([
    (next => rm(output, next)),
    (next => mk(output, next)),
    (next => exports.doClone(args, next)),
    (next => exports.checkout(output, opts, next))
  ], err => cb(err, output))
}

exports.doClone = function (args, next) {
  const output = args[args.length - 1]
  var done = false

  const timeout = setTimeout(() => {
    if (done) return
    done = true

    child.kill()
    next(new Error('Clone timeout exceeded'))
  }, maxTimeout)

  const child = spawn('git', args).on('close', code => {
    debug('Git process existed with code: %d', code)

    if (done) return rm(output, noop)
    done = true && clearTimeout(timeout)

    if (code !== 0) {
      rm(output, noop)
      return next(new Error('Error while cloning the repository. Exit code: ' + code))
    }

    next(null, output)
  })
}

exports.checkout = function (output, opts, next) {
  const tag = opts.tag
  const branch = opts.branch
  if (!branch && !tag) return next()

  const args = []
  args.push('checkout')
  args.push(tag ? 'tag/' + tag : branch)

  spawn('git', args, { cwd: output }).on('close', code => {
    if (code !== 0) {
      return next(new Error('Error while checkout specific branch/tags'))
    }
    next()
  })
}

function noop() {}
