export const state = () => ({
  isTouch: null,
  isCursor: null,
  isMobile: null,
  winWidth: null,
  winHeight: null,
  docWidth: null,
  docHeight: null,
  prefersReducedMotion: false
})

export const mutations = {
  setPrefersReducedMotion(state, boolean) {
    state.prefersReducedMotion = boolean
  },
  setDimensions(state, val) {
    state.winWidth = val.winWidth
    state.winHeight = val.winHeight
    state.docWidth = val.docWidth
    state.docHeight = val.docHeight
  },
  setDevice(state, val) {
    state.isTouch = val.isTouch
    state.isCursor = val.isCursor
    state.isMobile = val.isMobile
  }
}
