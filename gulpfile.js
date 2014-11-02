var gulp = require('gulp'),
    filter = require('gulp-filter'),
    mainBowerFiles = require('main-bower-files'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    browserSync = require('browser-sync'),
    del = require('del');

var reload = browserSync.reload;

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
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('styles', function() {
  gulp.src('app/**/*')
    .pipe(filterByExtension('css'))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('dist/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/'))
    .pipe(notify({ message: 'Styles task complete' }));
});

//minify, make one js etc
gulp.task('scripts', function() {
  return gulp.src('app/**/*')
    .pipe(filterByExtension('js'))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/images/'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function(cb) {
    del(['dist'], cb)
});
gulp.task('default', ['clean'], function(){
  gulp.start('vendor', 'app', 'styles', 'images', 'scripts' );
});

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  });
  gulp.watch('app/styles/**/*.css', ['styles']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/images/**/*', ['images']);
  gulp.watch('app/**/*.html', ['app']);
  livereload.listen();
  gulp.watch(['dist/**']).on('change', livereload.changed);
});
