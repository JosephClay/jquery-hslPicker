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
    jswrap     = require('gulp-js-wrapper'),

    BROWERIFY_BUILD = {
        debug:         true,
        cache:         {},
        packageCache:  {},
        fullPaths:     false
    },

    BROWERIFY_MIN_BUILD = {
        debug: false
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
            .pipe(exorcist('./dist/jquery.hsl-picker.js.map'))
            .pipe(source('jquery.hsl-picker.js'))
            .pipe(gulp.dest('./dist'))
            .pipe(log('Success: script'));
    };
};

var minScriptBuilder = function(stream) {
    return function() {
        var s = stream.bundle()
            .pipe(plumber({ errorHandler: onErr }))
            .pipe(unpathify())
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
            .pipe(log('Success: min script'));
    };
};

module.exports = {
    build: function() {
        var build = scriptBuilder(browserify('./js/index.js', BROWERIFY_BUILD));
        return build();
    },

    min: function() {
        var build = minScriptBuilder(browserify('./js/index.js', BROWERIFY_MIN_BUILD));
        return build();
    },

    watch: function() {
        var stream = watchify(browserify('./js/index.js', BROWERIFY_BUILD)),
            rebuild = scriptBuilder(stream);

        stream.on('update', rebuild);
        rebuild();
    }
};