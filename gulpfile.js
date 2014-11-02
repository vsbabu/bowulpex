var gulp = require('gulp');
var filter = require('gulp-filter');
var mainBowerFiles = require('main-bower-files');

var minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

var filterByExtension = function(extension){
    return filter(function(file){
        return file.path.match(new RegExp('.' + extension + '$'));
    });
};
var filterBySubPath = function(fragment){
    return filter(function(file){
        return file.path.match(new RegExp(fragment));
    });
};

gulp.task('vendor', function() {
    var mainFiles = mainBowerFiles();
    if(!mainFiles.length)
        return;
    var jsFilter = filterByExtension('js');
    return gulp.src(mainFiles)
        .pipe(jsFilter)
        .pipe(concat('vendor.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'))
        .pipe(jsFilter.restore())
        .pipe(filterByExtension('css'))
        .pipe(concat('vendor.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./dist'))
        .pipe(jsFilter.restore())
        .pipe(filterBySubPath('fonts'))
        .pipe(gulp.dest('./dist/fonts/'))
        ;
});
gulp.task('app', function() {
  return gulp.src('app/*')
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function(cb) {
    del(['dist'], cb)
});
gulp.task('default', ['clean'], function(){
  gulp.start('vendor', 'app');
});
