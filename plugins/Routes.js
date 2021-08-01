export default ({ app }) => {
  /**
   * Before each route begins...
   */
  app.router.beforeEach(async (to, from, next) => {
    await waitForHeaderTransitionToComplete(to)
    updateStoreBeforeRouteChanges(to)
    beginPageTransition()
    next()
  })

  /**
   * Check if the user prefers to not have transitions
   * @returns {boolean}
   */
  const reduceMotion = () => {
    return app.store.state.device.hideAnimations
  }

  /**
   * Update all abacus links before transition begins.
   * If motion is enabled, wait for header transition to complete
   * @param {object} nextRoute
   */
  const waitForHeaderTransitionToComplete = async (nextRoute) => {
    await app.store.commit('setActiveNavigationRoute', nextRoute.path)

    if (reduceMotion) {
      await new Promise((resolve) => setTimeout(resolve, getDelayDuration()))
    }
  }

  /**
   * Fetch the site navigation's transition duration
   * @returns {number}
   */
  const getDelayDuration = () => {
    if (process.server) return
    return parseFloat(
      getComputedStyle(document.querySelector('.site')).getPropertyValue(
        '--trans-short'
      )
    )
  }

  /**
   * Notify the store that the app is beginning to transition
   */
  const beginPageTransition = async () => {
    await app.store.commit('setIsTransitioning', true)
  }

  /**
   * Update the store before route changes
   * @param {object} nextRoute
   */
  const updateStoreBeforeRouteChanges = (nextRoute) => {
    if (nextRoute.name === 'work') {
      app.store.commit('setFilterVisibility', true)
    } else {
      app.store.commit('setFilterVisibility', false)
    }
  }
}
