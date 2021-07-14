import windowDimensions from '~/plugins/device/WindowDimensions'
import windowBreakpoints from '~/plugins/device/WindowBreakpoints'

const windowResize = {
  init() {
    this.resizeHandler = this.throttleResize.bind(this)
    this.throttled = false
    this.delay = 250

    window.addEventListener('resize', this.resizeHandler)
  },
  throttleResize() {
    if (!this.throttled) {
      this.throttled = true

      setTimeout(() => {
        this.throttled = false
        window.$nuxt.$emit('window::resize')
        windowDimensions.set()
        windowBreakpoints.set()
      }, this.delay)
    }
  }
}

export default windowResize
