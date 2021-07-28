import gsap from 'gsap'

export const routeTransitionFade = {
  transition: {
    name: 'page',
    mode: 'out-in',
    css: false,
    beforeEnter(el) {
      gsap.set(el, {
        opacity: 0,
        y: 25
      })
      this.$store.commit('setTransitionState', 'true')
      this.$nuxt.$emit('scrim::show')
    },
    enter(el, done) {
      // gsap.to('html', {
      //   '--background': this.$store.state.theme.background,
      //   '--foreground': this.$store.state.theme.foreground,
      //   '--accent': this.$store.state.theme.accent,
      //   duration: 0.7,
      //   ease: 'Power2.easeOut'
      // })

      gsap.to(el, {
        ease: 'Power2.easeOut',
        // duration: 0.5,
        delay: 0.5,
        opacity: 1,
        y: 0,
        onComplete: done
      })
    },
    leave(el, done) {
      gsap.to(el, {
        ease: 'Power2.easeIn',
        // duration: 0.3,
        opacity: 0,
        y: 25,
        onComplete: () => {
          this.$nuxt.$emit('scrim::hide')
          done()
        }
      })
    },
    afterLeave() {
      this.$store.commit('setTransitionState', 'false')
    }
  }
}
