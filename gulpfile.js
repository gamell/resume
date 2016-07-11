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
// const markdown = require('gulp-markdown');
const pug = require('gulp-pug');
// const assignToPug = require('gulp-assign-to-pug');

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

// gulp.task('markdown', () =>
//   gulp.src('src/*.md')
//     .pipe(markdown())
//     .pipe(gulp.dest('./.tmp'))
// );

gulp.task('html', () =>
  gulp.src('src/views/resume.pug')
  .pipe(pug({
    // Your options in here.
  }))
  .pipe(gulp.dest('public'))
);

// gulp.task('html', ['markdown'], () =>
//   gulp.src('./.tmp/resume.html')
//     .pipe(assignToPug('src/views/resume.pug', {
//       varName: 'resumeBody',
//     }))
//     .pipe(gulp.dest('public'))
//   );

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

gulp.task('build:public', ['html', 'less', 'fonts']);
gulp.task('build', ['build:public']);
gulp.task('build:inline', ['build'], () =>
  gulp.src('public/*.html')
    .pipe(inlinesource())
    .pipe(rename('resume.html'))
    .pipe(gulp.dest('dist'))
);

gulp.task('pdf', ['build:inline'], () =>
  gulp.src('dist/resume.html')
  .pipe(pdf({
    border: {
      top: '5mm',
      bottom: '10mm',
    },
  }))
  .pipe(gulp.dest('dist'))
);

gulp.task('clean', () => del(['public/**/*', 'dist/**/*']));
gulp.task('default', ['serve']);
