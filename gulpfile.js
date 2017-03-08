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
var rev = require('gulp-rev');
var revDel = require('rev-del');


//.pipe() is just a function that takes a readable source stream src and hooks the output to a destination writable stream dst:

var config = {
  sass : {
    src : './assets/styles/**/*.scss',
    dest : './assets/styles'
  },
  styles : {
    src: './assets/styles/**/*.css',
    dest: './dist/styles'
  },
  scripts : {
    src : './assets/scripts/**/*.js',
    dest : './dist/scripts'
  }
}

gulp.task('sass', function() {
  //source file
  return gulp.src(config.sass.src)
    //for Sass @import /*
    .pipe(bulkSass())
    //compile files
    .pipe(sass().on('error', sass.logError))
    //destination directory
    .pipe(gulp.dest(config.sass.dest))
    .pipe(notify({
      message: 'Sass compiled'
    }));
});

//combine and minify JS files
gulp.task('minify-scripts', function() {
  gulp.src(config.scripts.src)
  //merge js files
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  // .pipe(rename({suffix: '.min'}))
  .pipe(rev())
  .pipe(gulp.dest(config.scripts.dest))
  .pipe(rev.manifest())
  .pipe(revDel({ dest: './dist/script' }))
  .pipe(gulp.dest(config.scripts.dest))
  .pipe(notify({
    message: 'Javascript minified'
  }));
})

//minify css files and add hash revision filename
gulp.task('minify-css', function() {
  return gulp.src(config.styles.src)
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rev())
    .pipe(gulp.dest(config.styles.dest))
    .pipe(rev.manifest())
    .pipe(revDel({ dest: './dist/styles' }))
    .pipe(gulp.dest(config.styles.dest))
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
  var sassWatcher = gulp.watch(config.sass.src, ['sass']);
  sassWatcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

   var scriptsWatcher = gulp.watch('./assets/scripts/**/*.js',['lint','minify-scripts']);
   scriptsWatcher.on('change', function(event) {
     console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
   });

   var stylesWatcher = gulp.watch(config.styles.src,['minify-css']);
   scriptsWatcher.on('change', function(event) {
     console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
   });
}); //end of watch task

//run 'gulp' in terminal to run array of tasks
gulp.task('default', ['sass','minify-scripts','minify-css','lint','watch']);
