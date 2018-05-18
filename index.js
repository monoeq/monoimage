var assert = require('nanoassert')
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

  browser () {
    assert(this._monoEl instanceof Element, 'opts.element should return a dom node')
    this._monoEl.style.width = '100%'
    this._monoEl.style.display = 'block'
    var isImage = this._monoEl.tagName.toLowerCase() === 'img'
    if (!this.loaded || !isImage) this._monoEl.style.paddingTop = this.image.dimensions.ratio + '%'
    if (this.loaded && isImage) this._monoEl.src = this.loaded
    if (this.loaded && !isImage) this._monoEl.style.backgroundImage = `url(${this.loaded})`
  }

  server () {
    var styles = `padding-top:${this.image.dimensions.ratio}%;width:100%;display:block;`
    this._monoEl = this._monoEl.indexOf('style="') >= 0
      ? this._monoEl.replace('style="', `style="${styles}`)
      : this._monoEl.replace(/(<\w+)\s*/i, `$1 style="${styles}" `)
    this._monoEl = new String(this._monoEl)
    this._monoEl.__encoded = true
  }

  createElement (image, opts) {
    opts = opts || {}

    this.image = image
    this.sizes = Object.keys(this.image.sizes).map(s => parseInt(s))

    this._monoEl = typeof opts.element === 'function'
      ? opts.element(this.loaded)
      : html`<img>`

    typeof window !== 'undefined'
      ? this.browser()
      : this.server()
    
    return this._monoEl
  }
}
