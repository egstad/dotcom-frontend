import ThemeChanger from '@/plugins/ThemeChanger'
// import device from

// const device = require('@/plugins/Device.client.js')

export const state = () => ({
  layoutHasMounted: null,
  isTransitioning: null,
  activeNavigationRoute: null,
  menuIsOpen: false,
  menuIsTransitioning: false,
  filterIsVisible: null,
  cssVars: null
})

export const mutations = {
  layoutHasMounted(state, val) {
    state.layoutHasMounted = val
  },
  setCSSVars(state, val) {
    state.cssVars = ThemeChanger.set(val)
  },
  setIsTransitioning(state, val) {
    state.isTransitioning = val
  },
  setActiveNavigationRoute(state, val) {
    state.activeNavigationRoute = val
  },
  setFilterVisibility(state, val) {
    state.filterIsVisible = val
  },
  setMenuVisibility(state, val) {
    state.menuIsOpen = val
  },
  setMenuTransitionState(state, val) {
    state.menuIsTransitioning = val
  }
}

export const actions = {
  setNavigationColors(context) {
    // if (process.client) console.log(window.$nuxt.)
  },
  nuxtServerInit(context, { req }) {
    // if (process.client) device.init()
  }
}
