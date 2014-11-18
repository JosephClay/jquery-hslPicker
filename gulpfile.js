var gulp    = require('gulp'),
    scripts = require('./build/scripts'),
    styles  = require('./build/styles');

gulp.task('scripts', scripts.build);
gulp.task('styles', styles.build);
gulp.task('minScripts', scripts.min);
gulp.task('minStyles', styles.min);
gulp.task('default', function() {
    scripts.build();
    styles.build();
});
gulp.task('dev', function() {
    styles.build();

    scripts.watch();
    styles.watch();
});
gulp.task('release', function() {
    scripts.min();
    styles.min();
});