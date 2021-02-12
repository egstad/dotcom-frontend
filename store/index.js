import { groq } from '@nuxtjs/sanity'

export const state = () => ({
  primary: null
})

export const mutations = {
  setPrimary(state, links) {}
}

export const actions = {
  async fetchSiteSettings({ commit }, $sanity) {
    try {
      const query = groq`*[_type == "siteSettings"]`
      const settings = await $sanity.fetch(query)

      commit('navigation/setPrimary', settings[0].primaryNavigation)
    } catch (e) {
      console.warn('error in fetchSiteSettings', e)
    }
  }
}
