# Semstrap

> **UPDATE** Others have had the same idea of creating a style library for semantic HTML. Check out the excellent [PicoCSS](https://picocss.com/) and my other project: [SDFI Design System (Danish).](https://sdfidk.github.io/designsystem/)

Semstrap ("semantic bootstrap" :) ) is a collection of CSS styles that add a modern look and feel to web projects. It's simply a collection of styles that make straightforward semantic HTML look a little nicer.

Many developers turn to frontend frameworks just to easily improve the looks of their web projects. Unfortunately this approach results in a loot of framework-specific code like class names and wrapping elements being added to your HTML. Sometimes you even end up adding a bit of code from a another web project that relies on a different front end framework and you get a mess of dependencies and conflicting class names.

Semstrap styles only targets HTML elements. When you want to use Semstrap to style `form` elements in your project you just add the elements like so:
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

If you want to use Semstrap in your project, just download `semstrap.css` [from here](https://iamfrank.github.io/semstrap/dist/semstrap.css) and add it to your project files' <head> section:
```
<link rel='stylesheet' type='text/css' href='../semstrap.css'>
```
That's it! Take a look at the [docs](https://iamfrank.github.io/semstrap/) to see the cool stuff you can build with pure HTML elements and Semstrap.


## Custom build

It's simple to make your own custom build. 
1. Clone the project
2. Fiddle with the code in `/src` folder
2. Run `npm run build` (if you have NodeJS/npm installed)
That's it! A new custom semstrap.css should be in the `dist` folder for you to enjoy.
