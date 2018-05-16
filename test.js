var MonoImage = require('.')

var imagedata = {
  sizes: {
    1600: 'http://obs.astro.ucla.edu/images/towercam.jpg'
  },
  dimensions: {
    ratio: 75
  }
}

// normal instance

var myimage = new MonoImage()
var element = myimage.render(imagedata)

document.body.appendChild(element)

// img tag styles and instance

var style = document.createElement('style')
style.innerHTML = 'img { width: 100% }'
document.head.appendChild(style)

var myimageBg = new MonoImage()
var elementBg = myimageBg.render(imagedata, { background: false })

document.body.appendChild(elementBg)