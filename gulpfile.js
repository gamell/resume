'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const less = require('gulp-less');
const reload = browserSync.reload;
const runSequence = require('run-sequence');

gulp.task('assets', () =>
  gulp.src('app/less/**/*.less')
    .pipe(less({
      paths: ['app/less'],
    }))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({ stream: true }))
);

gulp.task('less', () =>
  gulp.src('app/less/**/*.less')
    .pipe(less({
      paths: ['app/less'],
    }))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({ stream: true }))
);

gulp.task('html', ['less'], () => {
  const assets = plugins.useref.assets({ searchPath: ['.tmp', 'app', '.'] });
  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe(plugins.if('*.js', plugins.uglify()))
    .pipe(plugins.if('*.css', plugins.csso()))
    .pipe(assets.restore())
    .pipe(plugins.useref())
    .pipe(plugins.if('*.html', plugins.minifyHtml({ conditionals: true, loose: true })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () =>
  gulp.src('app/images/**/*')
    .pipe(plugins.cache(plugins.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{ cleanupIDs: false }]
    })))
    .pipe(gulp.dest('dist/images'))
);

gulp.task('fonts', () =>
  gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'))
);

gulp.task('extras', () =>
  gulp.src([
    'app/*.*',
    '!app/*.html',
  ], {
    dot: true,
  }).pipe(gulp.dest('dist'))
);

gulp.task('clean', require('del').bind(null, ['.tmp/**/*', 'dist/**/*']));

gulp.task('serve', ['less', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components',
      },
    },
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    'app/less/**/*',
    '.tmp/fonts/**/*',
  ]).on('change', reload);

  gulp.watch('app/less/**/*.less', ['less']);
  gulp.watch('app/fonts/**/*', ['fonts']);
});

gulp.task('build', ['html', 'less', 'fonts', 'images', 'extras'], () =>
  gulp.src('dist/**/*').pipe(plugins.size({ title: 'build', gzip: true }))
);

gulp.task('copy', () => {
  gulp.src('dist/**/*')
  .pipe(gulp.dest('../../public'));
});

gulp.task('prepare-visualizer', (cb) => {
  runSequence('clean',
              'build',
              'copy',
              cb);
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
