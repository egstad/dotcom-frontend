import gsap from 'gsap'

const tl = gsap.timeline()

export const routeTransitionFade = {
  transition: {
    name: 'page',
    mode: 'out-in',
    css: false,
    beforeEnter(el) {
      if (this.$store.state.device.hideAnimations) return

      tl.set(el, {
        opacity: 0,
        y: 50
      })
    },
    enter(el, done) {
      if (this.$store.state.device.hideAnimations) done()
      let transOverCalled = false

      tl.to(el, {
        ease: 'expo.out',
        duration: 1,
        delay: 0.5,
        opacity: 1,
        y: 0,
        onUpdate: () => {
          // waiting until the end took too long,
          // this waits until animatino has hit 50%
          if (!transOverCalled && tl.progress() >= 0.5) {
            transOverCalled = true
            this.$store.commit('setIsTransitioning', false)
          }
        },
        onComplete: done
      })
    },
    // afterEnter() {
    //   if (this.$store.state.isTransitioning) {
    //     this.$store.commit('setIsTransitioning', false)
    //   }
    // },
    // beforeLeave() {
    //   // this is set in Routes.js instead
    //   if (!this.$store.state.isTransitioning) {
    //     this.$store.commit('setIsTransitioning', true)
    //   }
    // },
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
