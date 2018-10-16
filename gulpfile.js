'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');
const $gp = require("gulp-load-plugins")();
const del = require("del");

const browserSync = require("browser-sync").create();
const reload = browserSync.reload;


gulp.task('pug', function() {
  return gulp.src("./src/pug/*.pug")
       .pipe(pug({pretty:true}))
	.pipe($gp.plumber())
      .pipe(gulp.dest("./build/"))
	 .pipe(reload({ stream: true }));

     
});


gulp.task('sass', function(){
    return gulp.src(`./src/scss/*.scss`)
     .pipe(sass())
	.pipe($gp.plumber())
   .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
  
    .pipe(gulp.dest(`./build/css`))
   .pipe(reload({ stream: true }));
});

gulp.task("scripts", () => {
  return gulp
    .src(`./src/js/*.js`)
    .pipe(gulp.dest(`./build/js/`))
	 .pipe(reload({ stream: true }));
    
});

gulp.task('imagemin', function() {
    gulp.src(`./src/img/**/*`)
        .pipe(gulp.dest(`./build/img`))
	
});

gulp.task("fonts", () => {
  return gulp
    .src(`./src/fonts/**`)
    .pipe(gulp.dest(`./build/fonts/`));
});

gulp.task("plugins", () => {
  return gulp
    .src(`./src/plugins/**`)
    .pipe(gulp.dest(`./build/plugins/`));
});

gulp.task("svg", done => {
  return gulp
    .src(`./src/img/icons/*.svg`)
    .pipe(
      $gp.svgmin({
        js2svg: {
          pretty: true
        }
      })
    )
    .pipe(
      $gp.cheerio({
        run($) {
          $("[fill], [stroke], [style], [width], [height]")
            .removeAttr("fill")
            .removeAttr("stroke")
            .removeAttr("style")
            .removeAttr("width")
            .removeAttr("height");
        },
        parserOptions: { xmlMode: true }
      })
    )
    .pipe($gp.replace("&gt;", ">"))
    .pipe(
      $gp.svgSprite({
        mode: {
          symbol: {
            sprite: "../sprite.svg"
          }
        }
      })
    )
    .pipe(gulp.dest(`./build/img/icons`));
});

// dev сервер + livereload (встроенный)
gulp.task("server", () => {
  browserSync.init({
    server: {
      baseDir: `build`
    },
    open: true
  });
});


gulp.task('clean', function(){
     return del(`./build/`);
});



gulp.task('watch', function(){
  gulp.watch([`src/scss/*/*.scss`, `src/scss/*.scss`], function() {
     gulp.start('sass'); 
     });
  gulp.watch([`src/pug/*/*.pug`, `src/pug/*.pug`], function() {
     gulp.start('pug'); 
    });
  gulp.watch( [`src/js/*/*.js`,`src/js/*.js`], function() {
     gulp.start('scripts'); 
  });
	
	gulp.watch( `src/img/**/*`, function() {
     gulp.start('imagemin'); 
  });
	
	

});


gulp.task('default', function(){
runSequence (
    
    'clean',
   'imagemin',
   'svg',
   'fonts',
	'pug',
	'sass',
	'plugins',
	'scripts',
	'server',
   'watch'
    
)
});

