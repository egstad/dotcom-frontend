const windowDimensions = {
  init() {
    this.set()
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
