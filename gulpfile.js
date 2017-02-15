var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');


var staticPath = 'public/';

//tasks
gulp.task('build-js', buildJs);
gulp.task('watch-js', watchJs);


//functions

function buildJs() {
    return gulp.src([
        'node_modules/angular/angular.min.js',
        'assets/js/*/*.js',
        'assets/js/*.js'
    ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest(staticPath + '/javascripts/'));
}

function watchJs() {
    gulp.watch('assets/js/**/*.js', ['build-js']);
}