var assert = require('nanoassert')
var html = require('nanohtml')
var MonoLazy = require('monolazy')
var isObj = require('is-obj')
var clone = require('just-clone')
var closest = require('closest-number')
var inlineStyle = require('inline-style')

module.exports = class MonoImage extends MonoLazy {
  constructor() {
    super()

    // limit ratio to 1.5x (full 2x is overkill)
    this.deviceRatio = (typeof window !== 'undefined' && window.devicePixelRatio > 1) ? 1.5 : 1
  }

  onEnter () {
    if (this.loaded) return
      
    // find best image size for the container
    var elWidth = this.element.offsetWidth * this.deviceRatio
    var imgWidth = closest(this.sizes, elWidth)
    this._src = this.image.sizes[imgWidth]

    // load image
    var imageLoader = new Image()
    imageLoader.onload = () => this.onImageLoad()
    imageLoader.src = this._src
    if (imageLoader.complete) {
      this.onImageLoad() // ensure cached image triggers load
    }
  }

  onImageLoad () {
    if (this.loaded) return

    this.loaded = this._src
    this.rerender()
  }

  update () {
    return true
  }

  createElement (image, attributes) {
    this.image = image
    this.sizes = Object.keys(this.image.sizes).map(s => parseInt(s))

    // custom attributes
    attributes = typeof attributes === 'function'
      ? attributes(this.loaded)
      : isObj(attributes)
      ? clone(attributes)
      : {}

    assert(isObj(attributes), `attributes function must return an Object`)

    // ensure style property exists
    if (typeof attributes.style !== 'object') attributes.style = {}

    // default styles
    if (!attributes.style.display) attributes.style.display = 'block'
    if (!attributes.style.width) attributes.style.width = '100%'
    if (!attributes.style.height && !this.loaded) {
      attributes.style.paddingTop = image.dimensions.ratio + '%'
    }
    
    // convert to inline styles
    attributes.style = inlineStyle(attributes.style)

    // set src
    if (this.loaded) attributes.src = this.loaded

    return html`<img ${attributes}>`
  }
}
