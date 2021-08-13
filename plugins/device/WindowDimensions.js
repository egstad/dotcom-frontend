const windowDimensions = {
  init() {
    this.set()

    // page::mounted should exist on every page within the mounted() lifecycle hook
    window.$nuxt.$on('page::mounted', () => {
      windowDimensions.set()
    })

    window.$nuxt.$on('window::scrollStop', () => {
      windowDimensions.set()
    })
  },
  get() {
    return {
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
      docHeight: document.body.scrollHeight,
      docWidth: document.body.scrollWidth
    }
  },
  set() {
    window.$nuxt.$store.commit('device/setDimensions', this.get())
  }
}

export default windowDimensions
