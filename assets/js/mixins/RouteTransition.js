import gsap from 'gsap'

export const routeTransitionFade = {
  transition: {
    name: 'page',
    mode: 'out-in',
    css: false,
    beforeEnter(el) {
      if (this.$store.state.device.hideAnimations) return

      gsap.set(el, {
        opacity: 0,
        y: 50
      })
    },
    enter(el, done) {
      if (this.$store.state.device.hideAnimations) done()

      gsap.to(el, {
        ease: 'expo.out',
        duration: 1,
        delay: 0.5,
        opacity: 1,
        y: 0,
        onComplete: done
      })
    },
    leave(el, done) {
      if (this.$store.state.device.hideAnimations) done()

      gsap.to(el, {
        ease: 'Power2.easeIn',
        duration: 0.4,
        opacity: 0,
        y: 50,
        onComplete: () => {
          this.$nuxt.$emit('scrim::hide')
          done()
        }
      })
    },
    afterLeave() {
      // this.$store.commit('setTransitionState', 'false')
    }
  }
}
