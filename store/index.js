import ThemeChanger from '@/plugins/ThemeChanger'
// import device from

// const device = require('@/plugins/Device.client.js')

export const state = () => ({
  layoutHasMounted: null,
  isTransitioning: null,
  activeNavigationRoute: null,
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
