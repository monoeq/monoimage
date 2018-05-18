var html = require('nanohtml')
var MonoImage = require('.')

var imagedata = {
  sizes: {
    1600: 'http://obs.astro.ucla.edu/images/towercam.jpg'
  },
  dimensions: {
    ratio: 75
  }
}

var aImage = new MonoImage()
var bImage = new MonoImage()
var cImage = new MonoImage()

// no options
var aElement = aImage.render(imagedata)

// custom element
var bElement = bImage.render(imagedata, {
  element: loaded => html`<img class="${loaded ? 'loaded' : ''}">`
})

// custom element using div
var cElement = cImage.render(imagedata, {
  element: loaded => html`<div></div>`
})

if (typeof window !== 'undefined') {
  document.body.appendChild(aElement)
  document.body.appendChild(bElement)
  document.body.appendChild(cElement)
} else {
  console.log(aElement)
  console.log(bElement)
  console.log(cElement)
}