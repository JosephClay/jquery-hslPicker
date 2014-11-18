var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    plumber    = require('gulp-plumber'),
    through    = require('through2'),

    less         = require('gulp-less'),
    minifyCSS    = require('gulp-minify-css'),
    postcss      = require('gulp-postcss'),
    autoprefixer = require('autoprefixer-core'),
    rename       = require("gulp-rename"),

    onErr = function (err) {
        gutil.beep();
        console.error(err);
    },

    log = function(message) {
        return through.obj(function(file, enc, callback) {
            this.push(file);

            gutil.log(message);
            callback();
        });
    };

var build = function() {
    gulp.src('./css/styles.less')
        .pipe(plumber({ errorHandler: onErr }))
        .pipe(less())
        .pipe(postcss([
            autoprefixer({
                browsers: [
                    'last 2 versions',
                    'ie >= 9'
                ]
            })
        ]))
        .pipe(rename('jquery.hsl-picker.css'))
        .pipe(gulp.dest('./dist'))
        .pipe(log('Success: styles'));
};

var min = function() {
    gulp.src('./css/styles.less')
        .pipe(plumber({ errorHandler: onErr }))
        .pipe(less())
        .pipe(postcss([
            autoprefixer({
                browsers: [
                    'last 2 versions',
                    'ie >= 9'
                ]
            })
        ]))
        .pipe(minifyCSS())
        .pipe(rename('jquery.hsl-picker.min.css'))
        .pipe(gulp.dest('./'))
        .pipe(log('Success: min styles'));
};

module.exports = {

    build: build,

    min: min,

    watch: function() {
        gulp.watch('./**/*.less', build);
    }
};