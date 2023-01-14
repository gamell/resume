# HTML to PDF resume Gulp workflow

I use this gulp flow to generate my resume in PDF and HTML format from the same source files, mostly in markdown and also a tiny bit of pug templating.

This flow will generate a `private` and a `public` resume, where the public version contains crawler-sensitive data like my email and phone number spelled out to try to avoid crawlers and spam.

The output HTML files are self-contained as they have all the needed styles and fonts inline.

## Setup

`npm install`

## Run

- `npx gulp serve`: Will start a local server with a preview of the resume. The files will be served form `public/`. Useful to preview your changes in real time. Keep in mind the PDF rendering will also use the `print.less` file.
- `npx gulp pdf`:  Will run `gulp build:inline` and create the PDF file in the same directory
- `npx gulp build`: Will generate all the files needed to upload your resume to a web server, under the `dist/`

Check `gulpfile.js` for additional commands.

## Make changes

- `src/index.html`: HTML structure
- `src/styles/main.less`: Main LESS styles
- `src/styles/print.less`: Print styles which will be used to generate the PDF