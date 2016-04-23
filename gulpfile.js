var gulp          = require('gulp'),            // Gulp core

    concat        = require('gulp-concat'),     // Files concatenation
    eslint        = require('gulp-eslint'),     // An AST-based pattern checker for JavaScript
    gutil         = require('gulp-util'),       // Utility functions for gulp plugins
    minifyCSS     = require('gulp-minify-css'), // CSS minification (clean-css)
    plumber       = require('gulp-plumber'),    // Prevent pipe breaking caused by errors
    postcss       = require('gulp-postcss'),    // Transforming CSS with JS plugins
    rename        = require('gulp-rename'),     // Rename files
    uglify        = require('gulp-uglify'),     // Minify JS files

    autoprefixer  = require('autoprefixer'),     // Parse CSS and add vendor prefixes
    del           = require('del'),              // Delete files/folders using globs
    lost          = require('lost'),             // PostCSS fractional grid system built with calc()
    mqpacker      = require('css-mqpacker'),     // Pack same CSS media query rules into one media query rule
    path          = require('path'),             // Node.JS path module
    reporter      = require('postcss-reporter'), // Log PostCSS messages in the console
    stylelint     = require('stylelint');        // CSS linter

var root = __dirname;

var paths = {
  src: {
    css:     path.join(root, 'src/css/'),
    scripts: path.join(root, 'src/scripts/')
  },
  output: path.join(root, '../files/folderName/')
};

var isProduction = true;

if (gutil.env.dev === true) {
  isProduction = false;
}

/* Lint CSS files (Rules: http://stylelint.io/user-guide/rules) */
gulp.task('lint:css', function() {
  return gulp.src(paths.src.css + '**/*.css')
    .pipe(postcss([
      stylelint({
        "extends": "stylelint-config-standard",
        "rules": {
          "string-quotes": "double",
          "function-url-quotes": "double",
        }
      }),
      reporter({
        clearMessages: true
      }),
    ]));
});

/* Lint JS files */
gulp.task('lint:js', function() {
  return gulp.src([paths.src.scripts + '**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/* Clean files */
gulp.task('clean', function() {
  return del([paths.output + 'css', paths.output + 'js'], {force: true});
});

/* Compile CSS files */
gulp.task('css', function() {

  var processors = [
    autoprefixer({browsers: ['last 2 versions', 'ie 9']}),
    lost(),
    mqpacker
  ];

  return gulp.src(paths.src.css + '**/*.css')
    .pipe(plumber())
    .pipe(postcss(processors))
    .pipe(isProduction ? concat('main.css') : gutil.noop())
    .pipe(isProduction ? rename({suffix: '.min'}) : gutil.noop())
    .pipe(isProduction ? minifyCSS() : gutil.noop())
    .pipe(gulp.dest(paths.output + 'css'));
});

/* Compile JS files */
gulp.task('scripts', function() {

  return gulp.src(paths.src.scripts + '**/*.js')
    .pipe(plumber())
    .pipe(isProduction ? concat('main.js') : gutil.noop())
    .pipe(isProduction ? rename({suffix: '.min'}) : gutil.noop())
    .pipe(isProduction ? uglify() : gutil.noop())
    .pipe(gulp.dest(paths.output + 'js'));
});

/* Watch files */
gulp.task('watch', function() {
  gulp.watch(paths.src.css + '**/*.css', ['css']);
  gulp.watch(paths.src.scripts + '**/*.js', ['scripts']);
});

/* Default task */
gulp.task('default', ['clean'], function() {
  gulp.start('css', 'scripts');
});

/* Lint task */
gulp.task('lint', ['lint:js', 'lint:css']);
