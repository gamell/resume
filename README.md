# HTML to PDF resume Gulp workflow

I use this gulp flow to generate a **PDF file** containing my resume designed and edited using the `html` and `less` files in the `src/` folder.

## Install

`npm install -g gulp`

`npm install`

## Run

- `gulp serve`: Will start a local server with a preview of the resume. The files will be served form `public/`. Useful to preview your changes in real time. Keep in mind the PDF rendering will also use the `print.less` file.
- `gulp pdf`:  Will run `gulp build:inline` and create the PDF file in the same directory
- `gulp build`: Will generate all the files needed to upload your resume to a web server, under the `public/`
- `gulp build:inline`: Will generate the HTML, embed the needed CSS, output it to `dist/`

Check `gulpfile.js` for additional commands.

## Make changes

- `src/index.html`: HTML structure
- `src/styles/main.less`: Main LESS styles
- `src/styles/print.less`: Print styles which will be used to generate the PDF

## Future plans

- Allow PDF generation form Markdown files
