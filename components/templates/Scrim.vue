<template>
  <transition @leave="leave">
    <div v-if="!layoutHasMounted && isShowing" ref="scrim" class="scrim">
      <div ref="text" class="scrim__text">
        <span
          v-for="(letter, index) in loadingText"
          :key="`letter${index}`"
          ref="letter"
          class="scrim__letter"
          >{{ letter }}</span
        >
      </div>
    </div>
  </transition>
</template>

<script>
import gsap from 'gsap'

export default {
  data() {
    return {
      loadingText: 'Egstad',
      isShowing: true,
      loadTimeout: null,
      loadDuration: 1500,
      tl: gsap.timeline()
    }
  },
  computed: {
    hideAnimations() {
      return this.$store.state.device.hideAnimations
    },
    layoutHasMounted() {
      return this.$store.state.layoutHasMounted
    },
    winHeight() {
      return this.$store.state.device.winHeight
    }
  },
  watch: {
    layoutHasMounted(hasMounted) {
      if (hasMounted) {
        this.loadTimeout = setTimeout(this.hide, this.loadDuration)
      }
    }
  },
  mounted() {
    if (!this.$nuxt.context.isDev) this.animateLetters()
  },
  beforeDestroy() {
    clearTimeout(this.loadTimeout)
    this.isShowing = false
    // this.$nuxt.$off('page::mounted')
    this.tl.kill()
  },
  methods: {
    show() {
      this.isShowing = true
    },
    hide() {
      this.isShowing = false
    },
    leave(el, done) {
      if (this.hideAnimations) done()

      let transOverCalled = false

      this.tl.to(this.$refs.scrim, {
        ease: 'Power4.easeInOut',
        duration: 1,
        y: el.getBoundingClientRect().height,
        // onStart: () => {
        //   // this.tl.to(this.$refs.letters, {
        //   //   duration: 0.5,
        //   //   y: this.winHeight * 0.1,
        //   //   transformOrigin: '0% 50% -100%',
        //   //   ease: 'Power2.easeIn',
        //   //   stagger: 0.1
        //   // })
        // },
        onUpdate: () => {
          // waiting until the end took too long,
          // this waits until animatino has hit 50%
          if (!transOverCalled && this.tl.progress() >= 0.2) {
            transOverCalled = true
            this.$store.commit('setHeaderVisibility', true)
          }
        },
        onComplete: () => {
          this.$store.commit('setIsTransitioning', false)
          done()
        }
      })
    },
    animateLetters() {
      if (this.hideAnimations) return

      this.tl.fromTo(
        this.$refs.letter,
        {
          opacity: 0
        },
        {
          delay: this.loadDuration * 0.25 * 0.001,
          duration: this.loadDuration * 0.75 * 0.001,
          ease: 'Power3.inOut',
          opacity: 1,
          stagger: {
            each: 0.1
          }
        }
      )
    }
  }
}
</script>

<style lang="scss">
.scrim {
  /* Positioning */
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;

  /* Display & Box Model */
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  opacity: 1;

  /* Color */
  background-color: var(--foreground);
  color: var(--background);

  /* Other */
  user-select: none;

  @include bp($xl) {
    align-items: center;
  }

  &__text {
    /* Positioning */
    transform: translateX(-0.11em);

    /* Display & Box Model */
    display: flex;

    /* Text */
    font-family: var(--mono);
    font-size: 24vw;
    text-transform: uppercase;
    letter-spacing: -0.08em;

    /* Other */
    pointer-events: none;

    @include bp($xl) {
      font-size: clamp(96px, 40vmin, 200px) !important;
    }
  }

  &__letter {
    opacity: 0;
  }
}
</style>
