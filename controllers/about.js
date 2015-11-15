module.exports = function* about () {
  yield this.render('about', { title: 'About' })
}
