// Não esquecer de editar o endereço do servidor no Browsersync

var gulp = require('gulp');
var nib = require('nib')();
var rupture = require('rupture')();
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var htmlmin = require('gulp-htmlmin');
var stylus = require('gulp-stylus');
var jeet = require('jeet')();
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var production = process.env.NODE_ENV === 'production';

var srcPaths = {
	html: ['src/**/*.html'],
	css: 'src/css/**/*',
	styl: 'src/styl/style.styl',
	js: 'src/js/**/*.js',
	// vendors: [
	// 'node_modules/jquery/dist/jquery.min.js',
	// 'node_modules/fullpage.js/dist/jquery.fullpage.min.js'
	// ]
};

var buildPaths = {
	html: 'build/',
	css: 'build/css',
	js: 'build/js'
};

var reload = browserSync.reload;

function refresh() {
  setTimeout(function () {
    reload();
  }, 500);
}

function onError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('html', function() {
	gulp.src(srcPaths.html)
	.pipe(plumber())
	.pipe(htmlmin({colapseWhitespace: true}))
	.pipe(gulp.dest(buildPaths.html));
});

gulp.task('css', function() {
	gulp.src(srcPaths.styl)
	.pipe(plumber())
	.pipe(stylus({ 'include css': true, use: jeet }))
	.pipe(concat('styles.css'))
	.pipe(autoprefixer())
	.pipe(cleanCSS({ compatibility: 'ie8' }))
	.pipe(gulp.dest(buildPaths.css));
});

gulp.task('vendor', function() {
  return gulp.src(srcPaths.vendors)
		.pipe(concat('vendor.js'))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest(buildPaths.js));
});

gulp.task('js', function() {
	gulp.src(srcPaths.js)
	.pipe(plumber())
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(gulpif(production, uglify({ mangle: false })))
  .pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(buildPaths.js));
});

gulp.task('server', function() {
	browserSync.init({
    server: {
      baseDir: "./build/",
      online: true
      }
  });

  gulp.watch(srcPaths.html, ['html', refresh]);
	gulp.watch(srcPaths.styl, ['css', refresh]);
	gulp.watch(srcPaths.js, ['js', refresh]);

});

gulp.task('watch', function(){
	gulp.watch(srcPaths.html, ['html']);
	gulp.watch(srcPaths.styl, ['css']);
	gulp.watch(srcPaths.js, ['js']);
});

gulp.task('build', ['html', 'css', 'vendors', 'js']);
gulp.task('default', ['html', 'css', 'vendors', 'js', 'server']);