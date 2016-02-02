var gulp = require('gulp');
var babel = require("gulp-babel");
var inject = require('gulp-inject');
var injectHtml = require('gulp-inject-stringified-html');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var rm = require('gulp-rimraf');
var sass = require('gulp-sass');
var umd = require('gulp-umd');
var watch = require('gulp-watch');

gulp.task('lint', function() {
  return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('build', ['html', 'js', 'sass'], function () {});

gulp.task('clean', function () {
  return gulp.src('./dist', {read: false})
    .pipe(rm());
});

gulp.task('js', function () {
  return gulp.src(['./js/index.js'])
    .pipe(injectHtml())
    .pipe(babel())
    .pipe(umd({
      exports: function(file) {
        return 'JanrainCapture';
      },
      namespace: function(file) {
        return 'JanrainCapture';
      },
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('html', function () {
  gulp.src('./html/janrain.html')
    .pipe(inject(gulp.src(['./html/signInFirstTime.html']), {
      starttag: '<!-- inject:signInFirstTime:{{ext}} -->',
      transform: function (filePath, file) {
        return file.contents.toString('utf8');
      }
    })).pipe(gulp.dest('./dist'));
});

gulp.task('test', function() {
  return gulp.src('./test/**/*.js', {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('sass', function() {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
  gulp.watch('./js/**/*.js', ['js']);
  gulp.watch('./html/**/*.html', ['html', 'js']);
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('default', ['lint', 'build', 'watch']);
