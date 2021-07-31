export default ({ app }) => {
  // if (!process.client) return
  // const getDocumentTransitionDuration = () => {
  //   const doc = document.querySelector('.site')
  //   const dur = parseFloat(getComputedStyle(doc).transitionDuration)
  //   const del = parseFloat(getComputedStyle(doc).transitionDelay)
  //   return dur + del
  // }
  app.router.beforeEach((to, from, next) => {
    app.store.commit('setIsTransitioning', true)
    next()
  })
  // called right before the navigation is confirmed
  // app.router.beforeResolve(async (to, from, next) => {
  //   await next()
  // })
  // app.router.afterEach(async (to, from) => {
  //   await new Promise((resolve) =>
  //     setTimeout(resolve, getDocumentTransitionDuration())
  //   )
  //   await app.store.commit('setIsTransitioning', false)
  // })
}
