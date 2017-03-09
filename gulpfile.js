var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var notify = require('gulp-notify');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var rev = require('gulp-rev');
var revDel = require('rev-del');
var imagemin = require('gulp-imagemin');
var autoPrefixer = require('gulp-autoprefixer');
var RevAll = require('gulp-rev-all');
// var useref = require('gulp-useref');
// var revReplace = require("gulp-rev-replace");

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
  },
  images : {
    src : './assets/images/*',
    dest : './dist/images'
  }
}

gulp.task('sass', function() {
  //source file
  return gulp.src(config.sass.src)
    //for Sass @import /*
    .pipe(sassGlob())
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
  .pipe(revDel({ dest: './dist/scripts' }))
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


//minify images and add hash revision filename
gulp.task('minify-images', function() {
  gulp.src('./assets/images/*')
      .pipe(imagemin())
      .pipe(rev())
      .pipe(gulp.dest('./dist/images'))
      .pipe(rev.manifest())
      .pipe(revDel({ dest: './dist/images' }))
      .pipe(gulp.dest('./dist/images'))
      .pipe(notify({
        message: 'Images minified'
      }));
});

//lint task, js error handling
gulp.task('lint', function() {
  return gulp.src(config.scripts.src)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
})

//
// gulp.task('useref', function () {
//     return gulp.src('./*.html')
//         .pipe(useref())
//         .pipe(gulp.dest('dist/styles'));
// });

// gulp.task("revreplace", ["minify-css"], function(){
//   var manifest = gulp.src("./dist/styles/rev-manifest.json");
//
//   return gulp.src("./index.html")
//     .pipe(revReplace({manifest: manifest}))
//     .pipe(gulp.dest('.dist/styles'));
// });

//watch all the tasks on file changes
gulp.task('watch', function() {
  //watch all scss files in the styles directory and run sass task
  var sassWatcher = gulp.watch(config.sass.src, ['sass']);
  sassWatcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

   var scriptsWatcher = gulp.watch(config.scripts.src, ['lint','minify-scripts']);
   scriptsWatcher.on('change', function(event) {
     console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
   });

   var stylesWatcher = gulp.watch(config.styles.src, ['minify-css']);
   scriptsWatcher.on('change', function(event) {
     console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
   });

   var imageWatcher = gulp.watch(config.images.src, ['minify-images']);
   imageWatcher.on('change', function(event) {
     console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
   });
}); //end of watch task

//run 'gulp' in terminal to run array of tasks
gulp.task('default', ['sass','minify-scripts','minify-images','minify-css', 'lint','watch']);
