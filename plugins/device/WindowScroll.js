import DetectScroll from '@egstad/detect-scroll'

const scroll = {
  init() {
    this.instance = new DetectScroll(window, {
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
  scrollUp() {
    window.$nuxt.$store.commit('device/setScrollingDirection', 'up')
  },
  scrollDown() {
    window.$nuxt.$store.commit('device/setScrollingDirection', 'down')
  },
  scrollStart() {
    window.$nuxt.$store.commit('device/setScrollingState', true)
  },
  scrollStop() {
    window.$nuxt.$store.commit('device/setScrollingState', false)
  },
  destroy() {
    this.instance.destroy()
  }
}

export default scroll
