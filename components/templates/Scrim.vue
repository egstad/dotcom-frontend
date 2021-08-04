<template>
  <transition @leave="leave">
    <div v-if="!layoutHasMounted && isShowing" ref="scrim" class="scrim">
      <div ref="text" class="text">
        <span
          v-for="(letter, index) in loadingText"
          :key="`letter${index}`"
          ref="letter"
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
    this.animateLetters()
    // this.$nuxt.$on('page::mounted', this.hide)
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
          if (!transOverCalled && this.tl.progress() >= 0.75) {
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

<style lang="scss" scoped>
.scrim {
  // blur
  // background-color: hsl(var(--b-h), var(--b-s), var(--b-l), 80%);
  // backdrop-filter: blur(5vmin);
  // color: var(--foreground);

  // background-color: var(--foreground);
  // color: var(--background);

  // @media (prefers-color-scheme: dark) {
  //   background-color: hsl(var(--b-h), var(--b-s), 40%, 100%);
  //   color: hsl(var(--f-h), var(--f-s), 55%, 100%);
  // }

  user-select: none;
  background-color: var(--foreground);
  color: var(--background);

  z-index: 0;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  line-height: 0.9;
  z-index: 1000;

  @media (min-width: 1024px) {
    align-items: center;

    .text {
      font-size: clamp(96px, 40vmin, 200px) !important;
    }
  }

  .text {
    pointer-events: none;
    font-family: sans-serif;
    font-size: 26vw;
    transform: translateX(-0.11em);
    letter-spacing: -0.08em;
    text-transform: uppercase;
    display: flex;

    .letter {
      opacity: 0;
      text-indent: 0;
    }
  }
}

.script {
  font-family: sans-serif;
  color: var(--background);
}
</style>
