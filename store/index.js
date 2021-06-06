import { groq } from '@nuxtjs/sanity'
import ThemeChanger from '@/plugins/ThemeChanger'

export const state = () => ({
  isTransitioning: false,
  theme: {
    background: 'black',
    foreground: 'white',
    accent: 'blue'
  }
})

export const mutations = {
  setTransitionState(state, val) {
    state.isTransitioning = val
  },
  setTheme(state, val) {
    if (val.background) state.theme.background = val.background
    if (val.foreground) state.theme.foreground = val.foreground
    if (val.accent) state.theme.accent = val.accent

    // update it boi!
    ThemeChanger.updateColor(state.theme)
  }
}

export const actions = {
  async fetchSiteSettings({ commit }, $sanity) {
    try {
      const query = groq`*[_type == "siteSettings"]`
      const settings = await $sanity.fetch(query)

      commit('navigation/setPrimary', settings[0].primaryNavigation)
    } catch (e) {
      // console.warn('error in fetchSiteSettings', e)
    }
  }
}
