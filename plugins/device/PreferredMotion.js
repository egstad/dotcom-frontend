// Detect Motion https://www.npmjs.com/package/@egstad/detect-motion
import detectMotion from '@egstad/detect-motion'

const preferredTheme = {
  init() {
    // watch for `reducedMotionUpdated` events
    window.addEventListener('reducedMotionUpdated', this.setPreference)

    // fetch current pref, dispatch via 'reducedMotionUpdated', watch for changes
    detectMotion.watch()
  },
  setPreference(ev) {
    window.$nuxt.$store.commit(
      'device/setPrefersReducedMotion',
      ev.detail.reduce
    )
  }
}

export default preferredTheme
