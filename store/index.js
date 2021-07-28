import ThemeChanger from '@/plugins/ThemeChanger'
// import { hslaBreak } from '@/assets/js/utils/SanityHSL'

// import { hsla } from '@/assets/js/utils/SanityHSL'

export const state = () => ({
  isTransitioning: false,
  showScrim: true,
  cssVars: null
})

export const mutations = {
  showScrim(state, val) {
    state.showScrim = val
  },
  setTransitionState(state, val) {
    state.isTransitioning = val
  },
  setCSSVars(state, val) {
    state.cssVars = ThemeChanger.set(val)
  }

  // setTheme(state, val) {
  //   if (val.background) state.theme.background = val.background.hsl
  //   if (val.foreground) state.theme.foreground = val.foreground.hsl
  //   if (val.accent) state.theme.accent = val.accent.hsl

  //   // update it boi!
  //   // ThemeChanger.updateColor(state.theme)
  // }
}

export const actions = {
  // updateTheme({ commit }, colors) {
  //   ThemeChanger.updateColor({
  //     background: colors.background ? hslaBreak(colors.background) : null,
  //     foreground: colors.foreground ? hslaBreak(colors.foreground) : null,
  //     accent: colors.accent ? hslaBreak(colors.accent) : null
  //   })
  //   commit('setBackground', colors.background)
  //   commit('setForeground', colors.foreground)
  //   commit('setAccent', colors.accent)
  // }
  // async fetchSiteSettings({ commit }, $sanity) {
  //   try {
  //     const query = groq`*[_type == "siteSettings"]`
  //     const settings = await $sanity.fetch(query)
  //     commit('navigation/setPrimary', settings[0].primaryNavigation)
  //   } catch (e) {
  //     // console.warn('error in fetchSiteSettings', e)
  //   }
  // }
}
