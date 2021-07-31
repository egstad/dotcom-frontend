import ThemeChanger from '@/plugins/ThemeChanger'
// import device from

// const device = require('@/plugins/Device.client.js')

export const state = () => ({
  layoutHasMounted: null,
  isTransitioning: null,
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
  }
}

export const actions = {
  nuxtServerInit(context, { req }) {
    // if (process.client) device.init()
  }
}
