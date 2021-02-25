import { hexToRgb } from '@/assets/js/utils/Color'

const theme = {
  updateColor(options) {
    if (process.client) {
      if (options.background) {
        const color = hexToRgb(options.background)
        document.documentElement.style.setProperty(
          '--color-background',
          `${color.r}, ${color.g}, ${color.b}`
        )
      }

      if (options.foreground) {
        const color = hexToRgb(options.foreground)
        document.documentElement.style.setProperty(
          '--color-foreground',
          `${color.r}, ${color.g}, ${color.b}`
        )
      }

      if (options.accent) {
        const color = hexToRgb(options.accent)
        document.documentElement.style.setProperty(
          '--color-accent',
          `${color.r}, ${color.g}, ${color.b}`
        )
      }
    }
  }
}

if (process.client) {
  window.onNuxtReady((app) => {
    window.$nuxt.$on('theme::update', theme.updateColor)
  })
}

export default theme
