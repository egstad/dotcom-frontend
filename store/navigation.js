export const state = () => ({
  primary: null
})

export const mutations = {
  setPrimary(state, links) {
    state.primary = links
  }
}
