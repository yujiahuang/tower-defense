var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')

gulp.task('develop', function () {
  nodemon({ script: 'app.js', ext: 'html js', ignore: ['public/*'] })
})