var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('dist', function() {
    gulp.src([
        "src/_preamble.js",
        "src/domlib.js",
        "src/parse.js",
        "src/cachedParse.js",
        "src/Html.js",
        "src/insert.js",
        "src/mixins/*.js",
        "src/_postamble.js"
    ])
    .pipe(concat("htmlliterals-runtime.js"))
    .pipe(gulp.dest("dist"))
    .pipe(rename("htmlliterals-runtime.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
});

gulp.task('default', ['dist']);
gulp.watch(['src/*.js', 'src/mixins/*.js'], ['dist']);
