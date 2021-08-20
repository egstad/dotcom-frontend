<template>
  <transition @leave="leave">
    <div
      v-if="!layoutHasMounted && isShowing && $route.name !== 'index'"
      ref="scrim"
      class="scrim"
    >
      <h1 ref="text" class="scrim-text" @mousedown="reanimate($event)">
        <span class="char">E</span>
        <span class="char">G</span>
        <span class="char">S</span>
        <span class="char">T</span>
        <span class="char">A</span>
        <span class="char">D</span>
      </h1>
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
      chars: null,
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
      if (this.hideAnimations || !this.$refs.text) return

      this.chars = this.$refs.text.querySelectorAll('.char')

      // add a data-prop for accessing
      this.chars.forEach((el, index) => {
        el.setAttribute('data-index', index)
      })

      this.tl.to(this.chars, {
        duration: 0.8,
        delay: 0.5,
        opacity: 1,
        stagger: 0.15,
        onStart: () => {
          setTimeout(() => {
            this.$nuxt.$emit('animate::bio')
          }, 500)
        }
      })
    }
  }
}
</script>

<style lang="scss">
$char-height: 28.25vw;

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

  @include bp($xl) {
    justify-content: flex-end;
  }

  /* Color */
  background-color: var(--foreground);
  color: var(--background);

  /* Other */
  user-select: none;

  &-text {
    font-family: var(--sans);
    position: relative;
    line-height: 1;
    width: 100%;
    color: var(--background);
    text-indent: -0.075em;
    user-select: none;
    height: calc(#{$char-height - 5.75vw} - (var(--button-click-offset) * 0.5));
    font-size: calc(#{$char-height} - (var(--button-click-offset) * 0.5));
    cursor: pointer !important;
    transform: translateX(var(--button-click-offset));

    @include transition {
      transition: color var(--transition-page);
    }
  }

  .char {
    font-variation-settings: 'wght' 700;
    position: absolute;
    top: -4.5vw;
    opacity: 0;
    height: $char-height;

    &[data-index='0'] {
      left: 0;
    }
    &[data-index='1'] {
      left: 0.552em;
    }
    &[data-index='2'] {
      left: 1.23em;
    }
    &[data-index='3'] {
      left: 1.8em;
    }
    &[data-index='4'] {
      left: 2.27em;
    }
    &[data-index='5'] {
      left: 2.9em;
    }
  }
}
</style>
