var MonoImage = require('.')

var imagedata = {
  sizes: {
    1600: 'http://obs.astro.ucla.edu/images/towercam.jpg'
  },
  dimensions: {
    ratio: 75
  }
}

var myimage = new MonoImage()
var element = myimage.render(imagedata)

document.body.appendChild(element)