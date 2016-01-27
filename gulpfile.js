var gulp = require('gulp');
var inject = require('gulp-inject');
var injectHtml = require('gulp-inject-stringified-html');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('lint', function() {
  return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('build', function () {
  gulp.run('html');
  gulp.run('js');
  gulp.run('sass');
});

gulp.task('js', function () {
  return gulp.src(['./js/index.js'])
    .pipe(injectHtml())
    .pipe(gulp.dest('./dest'));
});

gulp.task('html', function () {
  gulp.src('./html/janrain.html')
    .pipe(inject(gulp.src(['./html/signInFirstTime.html']), {
      starttag: '<!-- inject:signInFirstTime:{{ext}} -->',
      transform: function (filePath, file) {
        return file.contents.toString('utf8');
      }
    })).pipe(gulp.dest('./dest'));
});

gulp.task('sass', function() {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dest/'));
});

gulp.task('watch', function () {
  gulp.watch('./js/**/*.js', ['js']);
  gulp.watch('./html/**/*.html', ['html', 'js']);
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('default', ['lint', 'build', 'watch']);
