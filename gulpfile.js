var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    assign = require('lodash.assign'),
    derequire = require('gulp-derequire');

var src = 'lib/messenger.js';
var dirs = {
    release: './dist',
    dev: './build'
};

// Bundle source file to dest.
function bundle(dest, debug) {
  if (typeof debug == "undefined") debug = false;
  return browserify({
      entries: src,
      standalone: "BotMessenger",
      debug: debug
  }).bundle()
    .pipe(source(src.replace(/^lib\//, '')))
    .pipe(derequire())
    .pipe(gulp.dest(dirs.dev));
}

gulp.task('build-dev', function() {
  return bundle(dirs.dev, true);
});

gulp.task('build-prod', function() {
  return bundle(dirs.release);
});

gulp.task('watch-dev', function() {
  var opts = assign({}, watchify.args, {
    entries: src,
    standalone: "BotMessenger",
    debug: true
  });
  var b = watchify(browserify(opts));
  function watchBundle() {
    return b.bundle()
      .on('error', gutil.log.bind(gutil, "Browserify Error"))
      .pipe(source(src.replace(/^lib\//, '')))
      .pipe(derequire())
      .pipe(gulp.dest(dirs.dev));
  }
  b.on('update', watchBundle);
  b.on('log', gutil.log);
  return watchBundle();
});


