var gulp = require('gulp');
var sass = require('gulp-sass');
var bulkSass = require('gulp-sass-bulk-import');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');

//.pipe() is just a function that takes a readable source stream src and hooks the output to a destination writable stream dst:

var config = {
  sass : {
    src: 'hi'
  }
}
gulp.task('sass', function() {
  //source file
  return gulp.src('./assets/styles/**/*.scss')
    //for Sass @import /*
    .pipe(bulkSass())
    //compile files
    .pipe(sass().on('error', sass.logError))
    //destination directory
    .pipe(gulp.dest('./assets/styles'))
    .pipe(notify({
      message: 'Sass done compiling'
    }));
});

//combine and minify JS files
gulp.task('minify-scripts', function() {
  gulp.src('./assets/scripts/**/*.js')
  //merge js files
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  // .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./dist/scripts'))
  .pipe(notify({
    message: 'Javascript minified'
  }));
})

//minify css files
gulp.task('minify-css', function() {
  return gulp.src('./assets/styles/**/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(notify({
      message: 'CSS minified'
    }));
});

//lint task, js error handling
gulp.task('lint', function() {
  return gulp.src('./assets/scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
})

//watch all the tasks on file changes
gulp.task('watch', function() {
  //watch all scss files in the styles directory and run sass task
  var sassWatcher = gulp.watch('./assets/styles/**/*.scss', ['sass']);
  sassWatcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

   var scriptsWatcher = gulp.watch('./assets/scripts/**/*.js',['lint','minify-scripts']);
   scriptsWatcher.on('change', function(event) {
     console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
   });

   var stylesWatcher = gulp.watch('./assets/styles/**/*.css',['minify-css']);
   scriptsWatcher.on('change', function(event) {
     console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
   });
}); //end of watch task

//run 'gulp' in terminal to run array of tasks
gulp.task('default', ['sass','minify-scripts','minify-css','lint','watch']);
