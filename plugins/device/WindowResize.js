import windowDimensions from '~/plugins/device/WindowDimensions'
import windowBreakpoints from '~/plugins/device/WindowBreakpoints'

const windowResize = {
  init() {
    this.resizeHandler = this.throttleResize.bind(this)
    this.timeout = false
    this.delay = 200

    window.addEventListener('resize', this.resizeHandler)
  },
  throttleResize() {
    clearTimeout(this.timeout)

    this.timeout = setTimeout(() => {
      windowDimensions.set()
      windowBreakpoints.set()
      window.$nuxt.$emit('window::resize')
    }, this.delay)
  }
}

export default windowResize
