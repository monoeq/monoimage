var html = require('nanohtml')
var MonoLazy = require('monolazy')
var closest = require('closest-number')

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

  createElement (image, opts) {
    opts = opts || {}
    
    this.image = image
    this.sizes = Object.keys(this.image.sizes).map(s => parseInt(s))
    
    return html`
      <div style="
        background-size:cover;
        background-position:center;
        background-repeat:no-repeat;
        ${opts.fill
          ? `width:100%;height:100%;`
          : `padding-top:${image.dimensions.ratio}%;`
        }
        ${this.loaded 
          ? `background-image:url(${this.loaded});` 
          : ''
        }
      "></div>
    `
  }
}
