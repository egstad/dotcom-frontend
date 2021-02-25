export const routeTransitionFade = {
  transition: {
    name: 'page',
    mode: 'out-in',
    css: false,
    beforeEnter(el) {
      this.$store.commit('setTransitionState', 'true')
      this.$gsap.set(el, {
        opacity: 0,
        y: 15
      })
    },
    enter(el, done) {
      this.$gsap.to('html', {
        '--background': this.$store.state.theme.background,
        '--foreground': this.$store.state.theme.foreground,
        '--accent': this.$store.state.theme.accent,
        duration: 0.7,
        ease: 'Power2.easeOut'
      })

      this.$gsap.to(el, {
        ease: 'Power2.easeOut',
        duration: 0.5,
        delay: 0.5,
        opacity: 1,
        y: 0,
        onComplete: done
      })
    },
    leave(el, done) {
      this.$gsap.to(el, {
        ease: 'Power2.easeIn',
        duration: 0.3,
        opacity: 0,
        y: 15,
        onComplete: done
      })
    },
    afterLeave() {
      this.$store.commit('setTransitionState', 'false')
    }
  }
}
