'use strict';

// Imports
var 
	gulp                = require('gulp'),
	clean               = require('gulp-clean'),
	jshint              = require('gulp-jshint'),
	concat              = require('gulp-concat'),
	rename              = require('gulp-rename'),
	uglify              = require('gulp-uglify'),
	less                = require('gulp-less'),
	path                = require('path'),
	minifyCSS           = require('gulp-minify-css'),
	autoprefixer        = require('gulp-autoprefixer'),
	browserSync         = require('browser-sync'),
	imagemin            = require('gulp-imagemin'),
	handlebars          = require('gulp-compile-handlebars');

// Paths
var 
	dirDev              = './_dev',	
	dirDist             = './_dist',
	dirDevLess          = dirDev + '/less',
	dirDevJs            = dirDev + '/js',
	dirDevPartials      = dirDev + '/partials',	
	dirDevAssets        = dirDev + '/assets',	
	dirDistAssets       = dirDist + '/assets',
	dirDistImages       = dirDistAssets + '/images',
	dirDistCss          = dirDistAssets + '/css',
	dirDistJs           = dirDistAssets + '/js';

var autoprefixerOptions = {
	browsers: ['> 5%'],
	cascade: false
};

gulp.task('clean', function () {
	return gulp.src(dirDist).pipe(clean());
});

gulp.task('copy', ['clean'], function () {
	return gulp.src(dirDevAssets + '/**/*')
		.pipe(gulp.dest(dirDistAssets));
});

gulp.task('build-img', function() {
  return gulp.src(dirDistImages + '/*')
    .pipe(imagemin())
    .pipe(gulp.dest(dirDistImages));
});

// Compile handlebars
gulp.task('compile-handlebars', function () {
	var templateData = {},
	options = {
		batch : [dirDevPartials]		
	}

	return gulp.src(dirDev + '/**/*.handlebars')
		.pipe(handlebars(templateData, options))
		.pipe(rename(function (path) {
    			path.extname = ".html"
  			}))
		.pipe(gulp.dest(dirDist));
});	

// Compile less files to a single file and minifies
gulp.task('less', function(){
	return gulp.src(['./node_modules/normalize.css/normalize.css', dirDevLess + '/*.less'])
	    .pipe(autoprefixer(autoprefixerOptions))
	    .pipe(less({
	    	paths: [ path.join(__dirname, 'less', 'includes') ],
	    }))
	    .pipe(concat('main.css'))
	    .pipe(gulp.dest(dirDistCss))
	    .pipe(rename('main.min.css'))
	    .pipe(minifyCSS())
	    .pipe(gulp.dest(dirDistCss));
});

// Lints all JS files
gulp.task('lint', function(){
	return gulp.src(dirDevJs + '/*.js')
	    .pipe(jshint())
	    .pipe(jshint.reporter('default'));
});

// Concat JS files to a single file and minifies
gulp.task('scripts', ['lint'], function(){
	return gulp.src(dirDevJs + '/*.js')
	    .pipe(concat('app.js'))
	    .pipe(gulp.dest(dirDistJs))
	    .pipe(rename('app.min.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest(dirDistJs));
});

gulp.task('watch', function(){

	gulp.watch(dirDev + '/**/*.handlebars', ['compile-handlebars']);
	gulp.watch(dirDevLess + '/*.less', ['less']);
	gulp.watch(dirDevJs + '/*.js', ['scripts']);

});

gulp.task('server', ['watch'], function(){

    browserSync.init({
        server: {
            baseDir: dirDist
        }
    });

    gulp.watch(dirDist + '/**/*').on('change', browserSync.reload);

});

// gulp default task (runs all individual tasks)
gulp.task('default', ['copy'], function() {
	gulp.start('compile-handlebars', 'less', 'scripts', 'build-img');
});