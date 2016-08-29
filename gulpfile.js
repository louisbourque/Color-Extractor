const gulp = require('gulp');
const minifycss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concatcss = require('gulp-concat-css');
const concat = require('gulp-concat');
const minifyhtml = require('gulp-minify-html');
const eslint = require('gulp-eslint');
const htmlreplace = require('gulp-html-replace');
const inline = require('gulp-inline');

gulp.task('default', ['js','html']);

// CSS minification task
gulp.task('css', function() {
  return gulp.src(['src/css/*.css'])
    .pipe(concatcss('style.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('css'));
});
// JS minification task
gulp.task('js', function() {
  return gulp.src(['src/js/*.js'])
    .pipe(uglify())
    .pipe(concat('bundle.min.js'))
    .pipe(gulp.dest('js'));
});

// minify HTML task
gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(inline({
      base: 'src/',
      css: minifycss,
      disabledTypes: ['svg', 'img', 'js'] // Only inline css files
    }))
    .pipe(htmlreplace({
        'js': 'js/bundle.min.js'
    }))
    .pipe(minifyhtml())
    .pipe(gulp.dest(''));
});


gulp.task('lint', () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['src/js/*.js','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint({
        rules: {
            'strict': 1
        },
        globals: [],
        envs: [
            'browser'
        ]
    }))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});
