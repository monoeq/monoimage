if (typeof window !== 'undefined') require('intersection-observer')
var MonoImage = require('.')
var html = require('nanohtml')

var imagedata = {
  sizes: {
    1600: 'http://obs.astro.ucla.edu/images/towercam.jpg'
  },
  dimensions: {
    ratio: 75
  }
}

var basicImage = new MonoImage()
var customImage = new MonoImage()
var fancyImage = new MonoImage()

// no options
var basicElement = basicImage.render(imagedata)

// passing custom attributes
var customElement = customImage.render(imagedata, { class: 'beep' })

// passing attributes function for fade-in
var fancyElement = fancyImage.render(imagedata, loaded => ({
  class: `fancy ${loaded ? 'loaded' : ''}`,
}))

if (typeof window !== 'undefined') {
  document.head.appendChild(html`
    <style>
      .fancy {
        opacity: 0;
        transition: opacity 1s ease;
      }
      .fancy.loaded { opacity: 1 }
    </style>
  `)
  document.body.appendChild(basicElement)
  document.body.appendChild(customElement)
  document.body.appendChild(fancyElement)
} else {
  console.log(basicElement)
  console.log(customElement)
  console.log(fancyElement)
}
