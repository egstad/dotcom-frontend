<template>
  <transition
    name="fade"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <div v-if="isShowing && !hideAnimations" class="scrim"></div>
  </transition>
</template>

<script>
import gsap from 'gsap'

export default {
  data() {
    return {
      isShowing: true,
      loadTimeout: null,
      loadDuration: 1500
    }
  },
  computed: {
    hideAnimations() {
      return this.$store.state.device.hideAnimations
    }
  },
  watch: {
    isShowing(showing) {
      if (showing) {
        console.log('show')
        document.body.style.overflow = 'hidden'
      } else {
        console.log('hide')
        document.body.style.overflow = ''
      }
    }
  },
  mounted() {
    // scrim::show
    //  this.$store.commit('setTransitionState', 'true')
    this.$nuxt.$on('page::mounted', this.show)
    this.$nuxt.$on('route::updated', this.hide)
    this.$nuxt.$on('scrim::hide', this.hide)
  },
  beforeDestroy() {
    this.$nuxt.$off('page::mounted')
    this.$nuxt.$off('route::updated')
    this.$nuxt.$on('scrim::hide')
    this.hide()
  },
  methods: {
    show() {
      this.isShowing = true
    },
    hide() {
      this.loadTimeout = setTimeout(
        () => (this.isShowing = false),
        this.loadDuration
      )
    },
    beforeEnter(el) {
      this.$store.commit('setTransitionState', 'true')
      gsap.set(el, {
        opacity: 0
      })
    },
    enter(el, done) {
      gsap.to(el, {
        ease: 'Power2.easeOut',
        duration: 0.5,
        opacity: 1,
        onComplete: done
      })
    },
    leave(el, done) {
      gsap.to(el, {
        ease: 'Power2.easeIn',
        duration: 0.3,
        opacity: 0,
        onComplete: done
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.scrim {
  background-color: var(--background);
  transition: background-color var(--time) var(--ease);
  z-index: 0;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 1;

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0;
  }

  // transition complete
  &.fade-enter,
  &.fade-leave-to {
    opacity: 0;
  }
}
</style>
