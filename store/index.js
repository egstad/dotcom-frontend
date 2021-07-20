import { groq } from '@nuxtjs/sanity'
import ThemeChanger from '@/plugins/ThemeChanger'
import { hslaBreak } from '@/assets/js/utils/SanityHSL'

// import { hsla } from '@/assets/js/utils/SanityHSL'

export const state = () => ({
  isTransitioning: false,
  showScrim: true,
  theme: {
    background: 'hsla(0, 0% , 0%, 1)',
    foreground: 'hsla(0, 0% , 0%, 1)',
    accent: 'hsla(0, 0% , 0%, 1)'
  }
})

export const mutations = {
  showScrim(state, val) {
    state.showScrim = val
  },
  setTransitionState(state, val) {
    state.isTransitioning = val
  },
  setBackground(state, val) {
    state.theme.background = val
  },
  setForeground(state, val) {
    state.theme.foreground = val
  },
  setAccent(state, val) {
    state.theme.accent = val
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
  updateTheme({ commit }, colors) {
    ThemeChanger.updateColor({
      background: hslaBreak(colors.background),
      foreground: hslaBreak(colors.foreground),
      accent: hslaBreak(colors.accent)
    })

    commit('setBackground', colors.background)
    commit('setForeground', colors.foreground)
    commit('setAccent', colors.accent)
  },
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
