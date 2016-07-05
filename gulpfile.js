'use strict';

const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('autoprefixer');
const del = require('del');

// gulp modules

const gulp = require('gulp');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const assets = require('postcss-assets');
const sourcemaps = require('gulp-sourcemaps');
const pdf = require('gulp-html-pdf');
const inlinesource = require('gulp-inline-source');
const rename = require('gulp-rename');

gulp.task('less', () =>
  gulp.src(['src/styles/main.less', 'src/styles/print.less'])
    .pipe(less({
      paths: ['src/styles'],
    }))
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer({ browsers: ['last 1 version'] })]))
    .pipe(postcss([assets({
      loadPaths: ['src/'],
      relative: true,
    })]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/styles'))
    .pipe(reload({ stream: true }))
);

gulp.task('html', ['less'], () =>
  gulp.src('src/*.html')
    .pipe(gulp.dest('public'))
);

gulp.task('html:inline', ['html'], () =>
  gulp.src('public/*.html')
    .pipe(inlinesource())
    .pipe(rename('resume.html'))
    .pipe(gulp.dest('dist'))
);

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
    'public/*.html',
    'public/scripts/**/*.js',
    'public/images/**/*',
    'public/styles/**/*',
    'public/fonts/**/*',
  ]).on('change', reload);

  gulp.watch('src/styles/**/*.less', ['build']);
  gulp.watch('src/*.html', ['build']);
});

gulp.task('pdf', ['clean', 'build:inline'], () =>
  gulp.src('dist/resume.html')
  .pipe(pdf({
    border: {
      top: '10mm',
      bottom: '10mm',
    },
  }))
  .pipe(gulp.dest('dist'))
);

gulp.task('build', ['html']);
gulp.task('build:public', ['html']);
gulp.task('build:inline', ['html:inline']);

gulp.task('clean', () => del(['public/**/*', 'dist/**/*']));

gulp.task('default', ['serve']);
