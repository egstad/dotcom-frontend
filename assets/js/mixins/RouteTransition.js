import gsap from 'gsap'

const tl = gsap.timeline()

// const setTransitionToFalse = (doneCallback) => {
//   console.log(this)
//   this.$store.commit('setIsTransitioning', false)
//   doneCallback()
// }

export const routeTransitionFade = {
  transition: {
    name: 'page',
    mode: 'out-in',
    css: false,
    beforeEnter(el) {
      if (this.$store.state.device.hideAnimations) return
      this.$store.commit('setIsTransitioning', true)

      tl.set(el, {
        opacity: 0,
        y: 50
      })
    },
    enter(el, done) {
      if (this.$store.state.device.hideAnimations) done()

      tl.to(el, {
        ease: 'expo.out',
        duration: 1,
        delay: 0.5,
        opacity: 1,
        y: 0,
        onComplete: done
      })
    },
    afterEnter() {
      this.$store.commit('setIsTransitioning', false)
    },
    leave(el, done) {
      if (this.$store.state.device.hideAnimations) done()

      tl.to(el, {
        ease: 'Power2.easeIn',
        duration: 0.4,
        opacity: 0,
        y: 50,
        onComplete: done
      })
    }
  }
}
