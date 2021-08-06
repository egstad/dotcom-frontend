import IntersectionObserverAdmin from 'intersection-observer-admin'

window.$observer = new IntersectionObserverAdmin()

if (process.browser) {
  window.onNuxtReady((app) => {
    // garbage collect between routes
    window.$nuxt.$on('route::updated', () => {
      window.$observer.destroy()
      window.$observer = new IntersectionObserverAdmin()
    })
  })
}
