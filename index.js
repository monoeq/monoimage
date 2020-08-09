var html = require('nanohtml')
var MonoLazy = require('monolazy')
var closest = require('closest-number')

module.exports = class MonoImage extends MonoLazy {
  constructor(id, state, emit) {
    super(`MonoImage-${id}`)
    state = state || {components:{}}
    this.local = state.components[`MonoImage-${id}`] = {}

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
    this.handleCallback(this.element)
  }

  handleCallback () {
    // noop
  }

  update () {
    return true
  }

  createElement (image, opts) {
    opts = opts || {}

    this.image = image
    this.sizes = Object.keys(this.image.sizes).map(s => parseInt(s)).sort()
    if (typeof opts.onload === 'function') this.handleCallback = opts.onload

    var els = []

    // first iteration constructs lazy-loaded element
    // second iteration constructs noscript vanilla element
    for (var i = 0; i < 2; i++) {
      var noscript = (i == 1)

      var attributes = {
        class: `monoimage${(this.loaded || noscript) ? ' monoimage-loaded' : ''}`
      }

      var display = opts.inline ? 'inline-block' : 'block'

      // the lazy-loaded element should be hidden until
      // javascript runs on the client (only applicable for SSR)
      if (typeof window == 'undefined' && !noscript) {
        display = 'none'
      }

      var styles = `
        width:100%;
        display:${display};
      `

      if (opts.background) {
        styles += `
          background-position:center;
          background-repeat:no-repeat;
          background-size:${opts.background === 'contain' ? 'contain' : 'cover'};
        `
      }

      if (this.loaded || noscript) {
        // noscript elements load largest image size to be safe
        var largestWidth = this.sizes[this.sizes.length - 1]
        var src = this.loaded || this.image.sizes[largestWidth]

        if (opts.background) {
          styles += `
            background-image:url(${src});
          `
        } else {
          attributes.src = src
        }
      }

      if (opts.fill) {
        styles += 'height:100%;'
      } else if ((!this.loaded && !noscript) || opts.background) {
        styles += `padding-top:${image.dimensions.ratio}%;`
      }

      attributes.style = styles.replace((/  |\r\n|\n|\r/gm),"")

      var el = opts.background
        ? html`<div ${attributes}></div>`
        : html`<img ${attributes}>`

      if (noscript) {
        el = html`<noscript>${el}</noscript>`
      }

      els.push(el)
    }

    return html`<div>${els}</div>`
  }
}
