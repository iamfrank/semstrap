'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
 
gulp.task('sass', function () {
  return gulp.src('./src/semstrap.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./dist/'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./src/*.scss', ['sass']);
});

gulp.task('default', ['sass']);
