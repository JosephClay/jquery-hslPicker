var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    plumber    = require('gulp-plumber'),
    through    = require('through2'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),
    uglify     = require('gulp-uglify'),
    browserify = require('browserify'),
    watchify   = require('watchify'),
    unpathify  = require('unpathify'),
    exorcist   = require('exorcist'),
    jswrap     = require('gulp-js-wrapper');

    less         = require('gulp-less'),
    minifyCSS    = require('gulp-minify-css'),
    postcss      = require('gulp-postcss'),
    autoprefixer = require('autoprefixer-core'),
    rename       = require("gulp-rename"),

    BROWERIFY_BUILD = {
        debug:         true,
        cache:         {},
        packageCache:  {},
        fullPaths:     false
    },

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

var scriptBuilder = function(stream) {
    return function() {
        var s = stream.bundle()
            .pipe(plumber({ errorHandler: onErr }))
            .pipe(exorcist('jquery.hsl-picker.js.map'))
            .pipe(source('jquery.hsl-picker.js'))
            .pipe(gulp.dest('./'))
            .pipe(log('Success: script'))
    };
};

var minScriptBuilder = function(stream) {
    return function() {
        var s = stream.bundle()
            .pipe(plumber({ errorHandler: onErr }))
            .pipe(unpathify())
            .pipe(exorcist('jquery.hsl-picker.min.js.map'))
            .pipe(source('jquery.hsl-picker.min.js'))
            .pipe(buffer())
            .pipe(jswrap({
                safeUndef: true,
                globals: {
                    'window': 'window',
                    'window.jQuery': '$'
                }
            }))
            .pipe(uglify())
            .pipe(gulp.dest('./'))
            .pipe(log('Success: min script'))
    };
};

var buildScripts = function() {
    var build = scriptBuilder(browserify('./js/index.js', BROWERIFY_BUILD));
    return build();
};

var minScripts = function() {
    var build = minScriptBuilder(browserify('./js/index.js', BROWERIFY_BUILD));
    return build();
};

var watchScripts = function() {
    var stream = watchify(browserify('./js/index.js', BROWERIFY_BUILD)),
        rebuild = scriptBuilder(stream);

    stream.on('update', rebuild);
    rebuild();
};

var buildStyles = function() {
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
        .pipe(gulp.dest('./'))
        .pipe(log('Success: styles'))
};

var minStyles = function() {
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
        .pipe(log('Success: min styles'))
};

var watchStyles = function() {
    gulp.watch('./**/*.less', function() {
        buildStyles();
    });
};

gulp.task('scripts', buildScripts);
gulp.task('styles', buildStyles);
gulp.task('minScripts', minScripts);
gulp.task('minStyles', minStyles);
gulp.task('default', function() {
    buildScripts();
    buildStyles();
});
gulp.task('dev', function() {
    buildStyles();

    watchScripts();
    watchStyles();
});
gulp.task('release', function() {
    minScripts();
    minStyles();
});