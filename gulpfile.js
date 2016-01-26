var gulp = require('gulp');
var inject = require('gulp-inject');
var watch = require('gulp-watch');

gulp.task('build', function () {
  gulp.src('./src/janrain.html')
    .pipe(inject(gulp.src(['./src/signInFirstTime.html']), {
      starttag: '<!-- inject:signInFirstTime:{{ext}} -->',
      transform: function (filePath, file) {
        return file.contents.toString('utf8')
      }
    }))
    .pipe(gulp.dest('./dest'));
});

gulp.task('watch', function () {
  watch('**/*.{js,html}', function () {
    gulp.run('build', done);
  });
});

gulp.task('default', ['build', 'watch']);
