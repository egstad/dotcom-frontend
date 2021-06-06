const deviceInfo = {
  init() {
    this.set()
  },
  get() {
    return {
      isTouch: 'ontouchstart' in window || 'DocumentTouch' in window,
      isCursor: 'onmousedown' in document.documentElement,
      dpi: window.devicePixelRatio,
      isMobile: /Android|BlackBerry|iPhone|iPad|iPod|IEMobile|Opera Mini/gi.test(
        window.navigator.userAgent
      )
    }
  },
  set() {
    window.$nuxt.$store.commit('device/setDevice', this.get())
  }
}

export default deviceInfo
