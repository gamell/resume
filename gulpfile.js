const browserSync = require("browser-sync");
const autoprefixer = require("autoprefixer");
const del = require("del");

// gulp modules

const gulp = require("gulp");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const assets = require("postcss-assets");
const inlinesource = require("gulp-inline-source");
const rename = require("gulp-rename");
const pug = require("gulp-pug");
const through2 = require("through2");
const htmlToPdf = require("html-pdf-node");
const gutil = require("gulp-util");

const clean = () => del(["public/**/*", "dist/**/*"]);

const paths = {
  templates: "src/views/**/*.pug",
  less: ["src/styles/main.less", "src/styles/print.less"],
};

const css = () =>
  gulp
    .src(paths.less)
    .pipe(
      less({
        paths: ["src/styles"],
      })
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(
      postcss([
        assets({
          loadPaths: ["src/"],
          relative: true,
        }),
      ])
    )
    .pipe(gulp.dest("public/styles"))
    .pipe(browserSync.stream());

const htmlPublic = () =>
  gulp
    .src(paths.templates)
    .pipe(
      pug({
        locals: {
          public: true,
        },
      })
    )
    .pipe(gulp.dest("public/public"))
    .pipe(browserSync.stream());

const htmlPrivate = () =>
  gulp
    .src(paths.templates)
    .pipe(
      pug({
        locals: {
          public: false,
        },
      })
    )
    .pipe(gulp.dest("public/private"))
    .pipe(browserSync.stream());

const fonts = () => gulp.src("src/fonts/**/*").pipe(gulp.dest("public/fonts"));

const inlinePublic = () =>
  gulp
    .src("public/public/*.html")
    .pipe(inlinesource())
    .pipe(rename("resume.html"))
    .pipe(gulp.dest("dist/public"));

const inlinePrivate = () =>
  gulp
    .src("public/private/*.html")
    .pipe(inlinesource())
    .pipe(rename("resume.html"))
    .pipe(gulp.dest("dist/private"));

const buildInternal = gulp.series(
  clean,
  gulp.parallel(css, fonts, htmlPrivate, htmlPublic)
);

const build = gulp.series(
  buildInternal,
  gulp.parallel(inlinePrivate, inlinePublic)
);

const startServer = () => {
  browserSync({
    notify: false,
    port: 9000,
    startPath: "public/resume.html",
    server: {
      baseDir: ["public"],
    },
  });

  // watch for changes
  gulp.watch("src/**/*", buildInternal);
};

const serve = gulp.series(build, startServer);

const getPdfRenderer = () =>
  through2.obj((file, _, cb) => {
    if (file.isBuffer()) {
      htmlToPdf
        .generatePdf(
          { content: file.contents.toString() },
          {
            format: "Letter",
            margin: {
              top: "10mm",
              bottom: "6mm",
            },
          }
        )
        .then((pdfBuffer) => {
          /* eslint-disable no-param-reassign */
          file.contents = pdfBuffer;
          file.path = gutil.replaceExtension(file.path, ".pdf");
          /* eslint-enable no-param-reassign */
          cb(null, file);
        });
    } else {
      throw new Error("File expected in PDF custom plugin");
    }
  });

const generatePublicPdf = () =>
  gulp
    .src("dist/public/resume.html")
    .pipe(getPdfRenderer())
    .pipe(gulp.dest("dist/public"));

const generatePrivatePdf = () =>
  gulp
    .src("dist/private/resume.html")
    .pipe(getPdfRenderer())
    .pipe(gulp.dest("dist/private"));

const pdfPublic = gulp.series(build, generatePublicPdf);
const pdfPrivate = gulp.series(build, generatePrivatePdf);

const pdf = gulp.series(
  build,
  gulp.parallel(generatePublicPdf, generatePrivatePdf)
);

exports.build = build;
exports.serve = serve;
exports.pdfPublic = pdfPublic;
exports.pdfPrivate = pdfPrivate;
exports.pdf = pdf;

exports.default = serve;
