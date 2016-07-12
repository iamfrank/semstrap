
# Semstrap

Semstrap (or "semantic bootstrap") is a collection of CSS styles that add a modern look and feel to web projects. 

It aims to have the convenience of frameworks like [Bootstrap](http://getbootstrap.com/) but using only semantic HTML for styling and vanilla Javascript for interactive widgets.

Many developers turn to frontend frameworks just to easily improve the looks of their web projects. Unfortunately this approach results in a loot of framework-specific code like class names and wrapping elements being added to your HTML. Sometimes you even end up adding a bit of code from a another web project that relies on a different front end framework and you get a mess of dependencies and conflicting class names.

Semstrap styles only targets elements. When you want to use it to style a `form` element you just add the element like so:
```
<form>
    <label for="inputEmail">Email address</label>
    <input id="inputEmail" type="email">
</form>
```
... as opposed to:
```
<form class="form form-modifier">
  <div class="form__wrapper form__wrapper-modifier">
    <label class="form__wrapper__label" for="exampleInputEmail1">Email address</label>
    <input class="form__wrapper__input form__wrapper__input-modifier"" type="email" class="form-control"
  </div>
</form>
```

Check it out on https://iamfrank.github.io/semstrap/

## Using it

If you want to use Semstrap in your project, just download `semstrap.css` and add it to your HTML files along with a link to the *Open Sans* font from Google Web Fonts:
```
<link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Lato:400,700'>
<link rel='stylesheet' type='text/css' href='.../semstrap.css'>
```
That's it. Take a look at the docs to see the cool stuff you can build with pure HTML elements and Semstrap.


## Building it

Want to create your own flavour of Semstrap. Go ahead:

You'll need to have [npm](https://www.npmjs.com/) and [gulp](http://gulpjs.com/) installed to build Semstrap yourself. Then you can clone the project and run the gulp task to create a new build of semstrap.min.css in the `dist` directory.
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
