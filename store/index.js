import ThemeChanger from '@/plugins/ThemeChanger'

export const state = () => ({
  siteHasMouted: false,
  showScrim: true,
  cssVars: null
})

export const mutations = {
  showScrim(state, val) {
    state.showScrim = val
  },
  siteHasMouted(state, val) {
    state.siteHasMouted = val
  },
  setCSSVars(state, val) {
    state.cssVars = ThemeChanger.set(val)
  }
}
