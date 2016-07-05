# HTML to PDF resume Gulp workflow

## Isntall

`npm install -g gulp`

`npm install`

## Run

- `gulp serve`: Will start a local server with a preview of the resume. The files will be served form `public/`
- `gulp pdf`: Will generate the HTML, embed the needed CSS, output it to `dist/` and create the PDF file in the same directory

Check `gulpfile.js` for additional commands.

## Make changes

- `src/index.html`: HTML structure
- `src/styles/main.less`: Main LESS styles
- `src/styles/print.less`: Print styles which will be used to generate the PDF

## Future plans

- Allow PDF generation form Markdown files
- Clean up `less` files from unused styles
