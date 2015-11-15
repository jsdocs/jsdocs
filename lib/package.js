const util = require('util')
const db = require('./db')

const MAX_TTL = 1000 * 60 * 60 * 24 * 7

module.exports = Package

function Package(params) {
  params = params || {}
  this.db = db
  this.fetched = false
  this.data = {}
  this.params = params
  this.params.branch = params.branch || 'master'
}

Package.prototype.setDatabase = function (db) {
  this.db = db
}

Package.prototype.setParams = function (params) {
  this.params = params
}

Package.prototype.setData = function (data) {
  this.data = data
}

Package.prototype.isUpdated = function () {
  const data = this.data
  return (data && +data.updated && (Date.now() - +data.updated) < MAX_TTL) || false
}

Package.prototype.fetch = function (cb) {
  this.db.get(this.key(), (err, data) => {
    if (err) return cb(err)
    this.fetched = true
    this.data = data
    cb(null, data)
    this.trackView()
  })
}

Package.prototype.remove = function (cb) {
  this.db.remove(this.key(), cb)
}

Package.prototype.save = function (cb) {
  const data = this.data || {}

  // Set defaults
  data.updated = Date.now()

  // Save in the database
  this.db.set(this.key(), data, cb)
}

Package.prototype.trackView = function (cb) {
  this.db.increment(this.key(), 'views', cb || noop)
}

Package.prototype.key = function () {
  const p = this.params
  return util.format('%s/%s/%s#%s',
    p.provider, p.organization, p.repository, p.branch || 'master')
}

Package.prototype.filename = function () {
  return this.key().replace(/\/|\#/g, '-') + '.html'
}

Package.prototype.gitUrl = function () {
  const p = this.params
  return util.format('https://%s/%s/%s.git',
    p.provider, p.organization, p.repository)
}

function noop() {}
