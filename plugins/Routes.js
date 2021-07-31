export default ({ app }) => {
  const reduceMotion = app.store.state.device.reduceMotion

  app.router.beforeResolve(async (to, from, next) => {
    console.log('b4 each', app.store.state)
    // tell the store where where going (the nav needs to know)
    await app.store.commit('setActiveNavigationRoute', to.path)
    // wait for nav text transition to complete
    if (reduceMotion) await new Promise((resolve) => setTimeout(resolve, 300))
    // tell the store that the transition is beginning
    await app.store.commit('setIsTransitioning', true)
    // kk bye now
    next()
  })
  // called right before the navigation is confirmed
  // app.router.beforeResolve(async (to, from, next) => {
  //   console.log('b4 res', app.store.state)

  //   await next()
  // })
  // app.router.afterEach(async (to, from) => {
  //   await new Promise((resolve) =>
  //     setTimeout(resolve, getDocumentTransitionDuration())
  //   )
  //   await app.store.commit('setIsTransitioning', false)
  // })
}
