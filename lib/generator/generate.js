const async = require('async')
const pipeline = require('./pipeline')

module.exports = function generate (pkg, cb) {
  // Create context to share across the pipeline chain
  const ctx = {}
  ctx.pkg = pkg

  // Map tasks passing the context
  const tasks = pipeline.map(task => (next => task(ctx, next)))

  // Run tasks in serie
  async.series(tasks, err => {
    if (err) return clean(err)
    cb(null, ctx.file.contents)
  })

  function clean(err) {
    pkg.delete((err) => {})
    cb(err)
  }
}
