const gulp          = require('gulp');                  // Gulp core
const cleanCSS      = require('gulp-clean-css');        // CSS minification
const concat        = require('gulp-concat');           // Files concatenation
const eslint        = require('gulp-eslint');           // An AST-based pattern checker for JavaScript
const gutil         = require('gulp-util');             // Utility functions for gulp plugins
const plumber       = require('gulp-plumber');          // Prevent pipe breaking caused by errors
const postcss       = require('gulp-postcss');          // Transforming CSS with JS plugins
const rename        = require('gulp-rename');           // Rename files
const uglify        = require('gulp-uglify');           // Minify JS files
const stylefmt      = require('gulp-stylefmt');         // Automatically formats CSS according to stylelint rules
const autoprefixer  = require('autoprefixer');          // Parse CSS and add vendor prefixes
const del           = require('del');                   // Delete files/folders using globs
const lost          = require('lost');                  // PostCSS fractional grid system built with calc()
const mqpacker      = require('css-mqpacker');          // Pack same CSS media query rules into one media query rule
const path          = require('path');                  // Node.JS path module
const reporter      = require('postcss-reporter');      // Log PostCSS messages in the console
const stylelint     = require('stylelint');             // CSS linter
const fontMagician  = require('postcss-font-magician'); // Automatically generates @font-face rules

const root = __dirname;

const paths = {
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
gulp.task('lint:css', () => {
  return gulp.src(paths.src.css + '**/*.css')
    .pipe(postcss([
      stylelint(),
      reporter({
        clearReportedMessages: true
      }),
    ]));
});

/* Lint JS files */
gulp.task('lint:js', () => {
  return gulp.src([paths.src.scripts + '**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/* Clean files */
gulp.task('clean', () => {
  return del([paths.output + 'css', paths.output + 'js'], {force: true});
});

/* Formats CSS according to stylelint rules */
gulp.task('stylefmt', () => {
  return gulp.src(paths.src.css + '**/*.css')
    .pipe(stylefmt())
    .pipe(gulp.dest(paths.output + 'css'));
});

/* Compile CSS files */
gulp.task('css', () => {

  const processors = [
    autoprefixer({browsers: ['last 2 versions', 'ie 9']}),
    lost(),
    mqpacker
  ];

  return gulp.src(paths.src.css + '**/*.css')
    .pipe(plumber())
    .pipe(postcss(processors))
    .pipe(isProduction ? concat('main.css') : gutil.noop())
    .pipe(isProduction ? rename({suffix: '.min'}) : gutil.noop())
    .pipe(isProduction ? cleanCSS({debug: true}, details => {
            console.log(details.name + ': ' + Math.round(details.stats.efficiency * 100) + '% of the size was reduced.');
        }) : gutil.noop())
    .pipe(gulp.dest(paths.output + 'css'));
});

/* Automatically generates @font-face rules */
gulp.task('generate:font', () => {
  return gulp.src(paths.src.css + '**/*.css')
    .pipe(
      postcss([fontMagician()]))
    .pipe(gulp.dest(paths.output + 'css'));
});

/* Compile JS files */
gulp.task('scripts', () => {
  return gulp.src(paths.src.scripts + '**/*.js')
    .pipe(plumber())
    .pipe(isProduction ? concat('main.js') : gutil.noop())
    .pipe(isProduction ? rename({suffix: '.min'}) : gutil.noop())
    .pipe(isProduction ? uglify() : gutil.noop())
    .pipe(gulp.dest(paths.output + 'js'));
});

/* Watch files */
gulp.task('watch', () => {
  gulp.watch(paths.src.css + '**/*.css', ['css']);
  gulp.watch(paths.src.scripts + '**/*.js', ['scripts']);
});

/* Default task */
gulp.task('default', ['clean'], () => {
  gulp.start('css', 'scripts');
});

/* Lint task */
gulp.task('lint', ['lint:js', 'lint:css']);
