desc('Start Redis server.')
task('redis', () => {
  jake.exec('redis-server', {
    printStdout: true,
    printStderr: true
  }, () => {
    complete()
  })
})

desc('Start Nodemon server.')
task('nodemon', () => {
  jake.exec('nodemon .', {
    printStdout: true,
    printStderr: true
  }, () => {
    complete()
  })
})

desc('Compile the files of Concise Framework.')
task('concise', () => {
  jake.exec('concisecss compile styles/main.scss assets/css/main.css', {
    printStdout: true,
    printStderr: true
  }, () => {
    complete()
  })
})

desc('Start livereload server.')
task('livereload', () => {
  jake.exec('livereload "views/, assets/" -e "hbs"', {
    printStdout: true,
    printStderr: true
  }, () => {
    complete()
  })
})

desc('Compile styles on file changes')
task('concise:watch', () => {
  jake.exec('chokidar "styles/**/*.scss" -c "jake concise"', {
    printStdout: true,
    printStderr: true
  }, () => {
    complete()
  })
})

desc('Start the development services.')
task('default', () => {
  jake.Task['redis'].invoke();
  jake.Task['nodemon'].invoke();
  jake.Task['concise'].invoke();
  jake.Task['concise:watch'].invoke();
  jake.Task['livereload'].invoke();
})
