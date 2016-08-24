'use strict';

const browserSync = require('browser-sync');
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
const pug = require('gulp-pug');
const purify = require('gulp-purifycss');

const reload = browserSync.reload;

const paths = {
  templates: 'src/views/**/*.pug',
  less: ['src/styles/main.less', 'src/styles/print.less'],
};

gulp.task('html-and-css', ['html'], () =>
  gulp.src(paths.less)
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
    .pipe(purify(['./public/**/*.html']))
    .pipe(gulp.dest('public/styles'))
    .pipe(reload({ stream: true }))
);

gulp.task('html', () =>
  gulp.src(paths.templates)
  .pipe(pug({
    // Your options in here.
  }))
  .pipe(gulp.dest('public'))
);

gulp.task('fonts', () =>
  gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('public/fonts'))
);

gulp.task('serve', ['build'], () => {
  browserSync({
    notify: false,
    port: 9000,
    startPath: 'resume.html',
    server: {
      baseDir: ['public'],
    },
  });

  // watch for changes
  gulp.watch('public/**/*').on('change', reload);
  gulp.watch('src/**/*', ['build']);
});

gulp.task('build:public', ['html-and-css', 'fonts']);
gulp.task('build:inline', ['build']);
gulp.task('build', ['build:public'], () =>
  gulp.src('public/*.html')
    .pipe(inlinesource())
    .pipe(rename('resume.html'))
    .pipe(gulp.dest('dist'))
);

gulp.task('pdf', ['build:inline'], () =>
  gulp.src('dist/resume.html')
  .pipe(pdf({
    border: {
      top: '10mm',
      bottom: '6mm',
    },
  }))
  .pipe(gulp.dest('dist'))
);

gulp.task('clean', () => del(['public/**/*', 'dist/**/*']));
gulp.task('default', ['serve']);
