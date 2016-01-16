var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
 
gulp.task('default', function () {
	var templateData = {},
	options = {
		batch : ['./src/partials']		
	}
 
	return gulp.src('src/*.handlebars')
		.pipe(handlebars(templateData, options))
		.pipe(rename(function (path) {
    			path.extname = ".html"
  			}))
		.pipe(gulp.dest('dist'));
});