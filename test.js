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

var imageA = new MonoImage()
var imageB = new MonoImage()
var imageC = new MonoImage()
var imageD = new MonoImage()
var imageE = new MonoImage()

var elementA = imageA.render(imagedata)
var elementB = imageB.render(imagedata, { background: true })
var elementC = imageC.render(imagedata, { background: 'contain' })
var elementD = imageD.render(imagedata, { inline: true })
var elementE = imageE.render(imagedata, { fill: true })

if (typeof window !== 'undefined') {
  document.body.appendChild(elementA)
  document.body.appendChild(elementB)
  document.body.appendChild(elementC)
  document.body.appendChild(elementD)
  document.body.appendChild(html`<div style="width:50vw;height:50vh;">${elementE}</div>`)
} else {
  console.log(elementA.toString())
  console.log(elementB.toString())
  console.log(elementC.toString())
  console.log(elementD.toString())
  console.log(elementE.toString())
}