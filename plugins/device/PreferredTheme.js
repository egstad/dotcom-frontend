// Detect theme: https://www.npmjs.com/package/@egstad/detect-theme
import detectTheme from '@egstad/detect-theme'

const preferredTheme = {
  init() {
    // watch for `colorSchemeUpdated` events
    window.addEventListener('colorSchemeUpdated', this.setPreference)

    // fetch preferred theme via 'colorSchemeUpdated' then watch for changes
    detectTheme.watch()
  },
  setPreference(ev) {
    window.$nuxt.$store.commit('device/setPreferredTheme', ev.detail.theme)
  }
}

export default preferredTheme
