export const state = () => ({
  isTouch: null,
  isCursor: null,
  isMobile: null,
  winWidth: null,
  winHeight: null,
  docWidth: null,
  docHeight: null,
  hideAnimations: null,
  preferredTheme: null,
  dpi: null,
  isScrolling: null,
  scrollDirection: undefined
})

export const mutations = {
  setPreferredTheme(state, boolean) {
    state.preferredTheme = boolean
  },
  setPrefersReducedMotion(state, boolean) {
    state.hideAnimations = boolean
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
    state.dpi = val.dpi
  },
  setScrollingState(state, boolean) {
    state.isScrolling = boolean
  },
  setScrollingDirection(state, val) {
    state.scrollDirection = val
  }
}
