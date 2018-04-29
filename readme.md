<h1 align="center">monoimage</h1>

<div align="center">
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square" alt="Stability" />
  </a>
  <a href="https://www.npmjs.com/package/monoimage">
    <img src="https://img.shields.io/npm/v/monoimage.svg?style=flat-square" alt="NPM version" />
  </a>
</div>

<br />

**work in progress...**

Context aware lazy image [nanocomponent](https://github.com/choojs/nanocomponent).

## Usage

```js
var MonoImage = require('monoimage')

var imagedata = {
  sizes: {
    500: '/url/or/path/to/image_500.jpg',
    1000: '/url/or/path/to/image_1000.jpg',
    1500: '/url/or/path/to/image_1500.jpg'
  },
  dimensions: {
    ratio: 75
  }
}

var myimage = new MonoImage()
var element = myimage.render(imagedata)
```

## Details

`monoimage` looks at the dimensions of it's parent to determine which image src to load. Similar to [srcset](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset) but container aware, rather than viewport aware. Device pixel ratio is considered.

The image is loaded only once the component has entered the viewport, using [monolazy](https://github.com/jongacnik/monolazy).

---

`monoimage` accepts image data in an opinionated shape since it is most useful when used with [nanopage](https://github.com/jondashkyle/nanopage) inside a [choo](https://github.com/choojs/choo) application:

```js
var html = require('choo/html')
var Page = require('nanopage')
var MonoImage = require('monoimage')

function view (state, emit) {
  var p = new Page()
  var image = p().images().first().value()
  return html`
    <div>
      ${state.cache(MonoImage, image.filename).render(image)}
    </div>
  `
}
```

---

`monoimage` by default returns an intrinsic ratio `div` element:

```js
var element = myimage(imagedata)
```

```html
<div style="
  padding-top: 75%;
  background-image: image.jpg;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
"></div>
```

---

Optionally return a _filled_ `div` element:

```js
var element = myimage(imagedata, {
  fill: true
})
```

```html
<div style="
  width: 100%;
  height: 100%;
  background-image: image.jpg;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
"></div>
```

## Todo

- [ ] Asserts
- [ ] Pass styles
- [ ] Pass classnames
- [ ] Pixel Ratio option
- [ ] Better docs

## See Also

- [jongacnik/monolazy](https://github.com/jongacnik/monolazy)
- [choojs/nanocomponent](https://github.com/choojs/nanocomponent)