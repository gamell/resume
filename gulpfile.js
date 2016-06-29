'use strict';

const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('autoprefixer');

// gulp modules

const gulp = require('gulp');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('html', () =>
  gulp.src('src/*.html').pipe(gulp.dest('public'))
);

gulp.task('less', () =>
  gulp.src('src/styles/**/*.less')
    .pipe(less({
      paths: ['src/styles'],
    }))
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer({ browsers: ['last 1 version'] })]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/styles'))
    .pipe(reload({ stream: true }))
);

gulp.task('build', ['html', 'less']);

gulp.task('serve', ['clean', 'build'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['public'],
    },
  });

  // watch for changes
  gulp.watch([
    'src/*.html',
    'src/scripts/**/*.js',
    'src/images/**/*',
    'src/styles/**/*',
    'public/fonts/**/*',
  ]).on('change', reload);

  gulp.watch('src/styles/**/*.less', ['less']);
  gulp.watch('src/*.html', ['html']);
  // gulp.watch('src/fonts/**/*', ['fonts']);
});

gulp.task('clean', require('del').bind(null, ['public/**/*']));

gulp.task('default', ['serve']);
