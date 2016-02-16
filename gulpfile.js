'use strict';

// Imports
var 
	gulp                = require('gulp'),
	jshint              = require('gulp-jshint'),
	concat              = require('gulp-concat'),
	rename              = require('gulp-rename'),
	uglify              = require('gulp-uglify'),
	less                = require('gulp-less'),
	path                = require('path'),
	minifyCSS           = require('gulp-minify-css'),
	autoprefixer        = require('gulp-autoprefixer'),
	handlebars          = require('gulp-compile-handlebars');

// Paths
var 
	dirDev              = './_dev',	
	dirDevLess          = dirDev + '/less',
	dirDevCss           = dirDev + '/css',
	dirDevJs            = dirDev + '/js',
	dirDevPartials      = dirDev + '/partials',	
	dirDistCss          = './assets/css',
	dirDistJs           = './assets/js';

var autoprefixerOptions = {
			browsers: ['> 5%'],
			cascade: false
};

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
		.pipe(gulp.dest('.'));
});	

// Compile less files to a single file and minifies
gulp.task('less', function(){
	return gulp.src(dirDevLess + '/*.less')
	    .pipe(autoprefixer(autoprefixerOptions))
	    .pipe(less({
	    	paths: [ path.join(__dirname, 'less', 'includes') ],
	    }))
	    .pipe(concat('main.css'))
	    .pipe(gulp.dest(dirDistCss))
	    .pipe(rename('main.min.css'))
	    .pipe(minifyCSS())
	    .pipe(gulp.dest(dirDistCss))
});

// Lints all JS files
gulp.task('lint', function(){
	return gulp.src(dirDevJs + '/*.js')
	    .pipe(jshint())
	    .pipe(jshint.reporter('default'));
});

// Concat JS files to a single file and minifies
gulp.task('scripts', function(){
	return gulp.src(dirDevJs + '/*.js')
	    .pipe(concat('app.js'))
	    .pipe(gulp.dest(dirDistJs))
	    .pipe(rename('app.min.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest(dirDistJs));
});

// Concat all css files to a single file and minifies
gulp.task('css',function(){
  return gulp.src(dirDevCss + '/*.css')
  		.pipe(autoprefixer(autoprefixerOptions))
	    .pipe(concat('app.css'))
	    .pipe(gulp.dest(dirDistCss))
	    .pipe(minifyCSS())
	    .pipe(rename('app.min.css'))
	    .pipe(gulp.dest(dirDistCss))
});

// global watcher task
gulp.task('watch',function(){
	gulp.watch(dirDev + '/**/*.handlebars',['compile-handlebars']);
	gulp.watch(dirDevLess + '/*.less',['less']);
	gulp.watch(dirDevJs + '/*.js',['lint','scripts']);
	gulp.watch(dirDevCss + '/*.css',['css']);
});

// gulp default task (runs all individual tasks, then kicks off the watcher task)
gulp.task('default', ['compile-handlebars', 'less', 'lint', 'scripts','css','watch']);