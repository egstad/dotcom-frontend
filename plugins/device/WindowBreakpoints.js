const windowBreakpoints = {
  init() {
    this.set()
  },
  set() {
    const width = window.$nuxt.$store.state.device.winWidth
    const currentBreakpoint = window.$nuxt.$store.state.device.breakpoint
    let breakpoint = ''

    switch (true) {
      case width < this.getBreakpoint('sm'):
        breakpoint = 'xs'
        break
      case width < this.getBreakpoint('md'):
        breakpoint = 'sm'
        break
      case width < this.getBreakpoint('lg'):
        breakpoint = 'md'
        break
      case width < this.getBreakpoint('xl'):
        breakpoint = 'lg'
        break
      case width < this.getBreakpoint('xx'):
        breakpoint = 'xl'
        break
      default:
        breakpoint = 'xx'
        break
    }

    if (breakpoint !== currentBreakpoint) {
      window.$nuxt.$store.commit('device/setBreakpoint', breakpoint)
    }
  },
  getBreakpoint(size) {
    if (process.client) {
      return getComputedStyle(document.body)
        .getPropertyValue(`--${size}`)
        .replace('px', '')
    }
  }
}

export default windowBreakpoints
