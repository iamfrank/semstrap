
# SemanticStrap

SemanticStrap is a frontend "framework" for quickly adding a neat look and feel to web projects. It aims to have the convenience of frameworks like Bootstrap but using only semantic HTML for styling and vanilla Javascript for interactive widgets.

Check it out on https://iamfrank.github.io/semantic-strap/

## Using it

If you want to use SemanticStrap in your project, just download `semstrap.css` and add it to your HTML files along with a link to the *Open Sans* font from Google Web Fonts:
```
<link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Lato:400,700'>
<link rel='stylesheet' type='text/css' href='.../semstrap.css'>
```
That's it. Take a look at the docs to see the cool stuff you can build with pure HTML elements and SemanticStrap.


## Building it

Want to create your own flavour of SemanticStrap. Go ahead:

You'll need to have [npm](https://www.npmjs.com/) and [gulp](http://gulpjs.com/) installed to build Semantic Strap yourself. Then you can clone the project and run the gulp task to create a new build of semstrap.min.css in the `dist` directory.
```
$ git clone https://github.com/iamfrank/semantic-strap.git // Clone the SemanticStrap git project
$ npm update
$ npm install
$ gulp
```
The `gulp` task will collect and minify all the [.scss](http://sass-lang.com/) files in `src` directory and build a new `semstrap.css` in the `dist` directory.
You can run
```
$ gulp sass:watch
```
If you want to have a watcher update the `semstrap.css` file while you work on the .scss files.
