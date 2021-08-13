import DetectScroll from '@egstad/detect-scroll'

const scroll = {
  init() {
    this.store = window.$nuxt.$store
    this.scrollUp = this.scrollUp.bind(this)
    this.scrollDown = this.scrollDown.bind(this)
    this.scrollStop = this.scrollStop.bind(this)
    window.detectScroll = new DetectScroll(window, {
      // debugMode: true,
      horizontal: false,
      vertical: true,
      events: {
        scrollY: this.scrollY,
        scrollUp: this.scrollUp,
        scrollDown: this.scrollDown,
        scrollStart: this.scrollStart,
        scrollStop: this.scrollStop,
        scrollMinY: this.scrollMinY,
        scrollMaxY: this.scrollMaxY
      }
    })
  },
  scrollY(ev) {
    const y = ev.detail.y
    const h = document.documentElement.scrollHeight
    const w = this.$nuxt.$store.state.device.winHeight
    const o = w + w

    // if near bottom
    if (y + w + o > h) {
      window.$nuxt.$emit('window::scrollNearBottom')
    }
    window.$nuxt.$emit('window::scrollY')
  },
  scrollUp(ev) {
    window.$nuxt.$emit('window::scrollUp', ev.detail.y)
    window.$nuxt.$store.dispatch('device/updateScrollDirection', 'up')
  },
  scrollDown(ev) {
    window.$nuxt.$emit('window::scrollDown', ev.detail.y)
    window.$nuxt.$store.dispatch('device/updateScrollDirection', 'down')
  },
  scrollStart() {
    window.$nuxt.$store.commit('device/setScrollingState', true)
  },
  scrollStop(ev) {
    window.$nuxt.$emit('window::scrollStop', window.detectScroll.y)
    window.$nuxt.$store.commit('device/setScrollingState', false)
  },
  destroy() {
    window.detectScroll.destroy()
  }
}

export default scroll
