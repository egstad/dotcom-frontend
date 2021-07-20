const theme = {
  updateColor(colors) {
    const root = document.documentElement.style
    const background = colors.background
    const foreground = colors.foreground
    const accent = colors.accent

    if (background) {
      root.setProperty('--bH', background[0])
      root.setProperty('--bS', background[1])
      root.setProperty('--bL', background[2])
      root.setProperty('--bA', background[3])
    }

    if (foreground) {
      root.setProperty('--fH', foreground[0])
      root.setProperty('--fS', foreground[1])
      root.setProperty('--fL', foreground[2])
      root.setProperty('--fA', foreground[3])
    }

    if (accent) {
      root.setProperty('--aH', accent[0])
      root.setProperty('--aS', accent[1])
      root.setProperty('--aL', accent[2])
      root.setProperty('--aA', accent[3])
    }
  }
}

// if (process.client) {
//   window.onNuxtReady((app) => {
//     console.log(app.$store.state)
//     // theme.updateColor({
//     //   background: window.$nuxt.$store.state.theme.background,
//     //   foreground: window.$nuxt.$store.state.theme.foreground,
//     //   accent: window.$nuxt.$store.state.theme.accent
//     // })
//     // window.$nuxt.$on('theme::update', theme.updateColor)
//   })
// }

export default theme
