// import { hexToRgb } from '@/assets/js/utils/Color'

const theme = {
  updateColor(options) {
    if (process.client) {
      // if (options.background) {
      //   const color = hexToRgb(options.background)
      //   document.documentElement.style.setProperty(
      //     'background',
      //     `${color.r}, ${color.g}, ${color.b}`
      //   )
      // }

      // if (options.foreground) {
      //   const color = hexToRgb(options.foreground)
      //   document.documentElement.style.setProperty(
      //     '--color-foreground',
      //     `${color.r}, ${color.g}, ${color.b}`
      //   )
      // }

      // if (options.accent) {
      //   const color = hexToRgb(options.accent)
      //   document.documentElement.style.setProperty(
      //     '--color-accent',
      //     `${color.r}, ${color.g}, ${color.b}`
      //   )
      // }

      document.documentElement.style.setProperty(
        '--background',
        options.background
      )
      document.documentElement.style.setProperty(
        '--foreground',
        options.foreground
      )
      document.documentElement.style.setProperty('--accent', options.accent)

      // change theme with javascript
      // window.$nuxt.$gsap.to('html', {
      //   '--background': window.$nuxt.$store.state.theme.background,
      //   '--foreground': window.$nuxt.$store.state.theme.foreground,
      //   '--accent': window.$nuxt.$store.state.theme.accent,
      //   duration: 0.7,
      //   ease: 'Power2.easeOut'
      // })
    }
  }
}

if (process.client) {
  window.onNuxtReady((app) => {
    theme.updateColor({
      background: window.$nuxt.$store.state.theme.background,
      foreground: window.$nuxt.$store.state.theme.foreground,
      accent: window.$nuxt.$store.state.theme.accent
    })
    window.$nuxt.$on('theme::update', theme.updateColor)
  })
}

export default theme
