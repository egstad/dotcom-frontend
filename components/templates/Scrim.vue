<template>
  <transition @leave="leave">
    <div v-if="scrimShouldShow" ref="scrim" class="scrim">
      <div v-if="isShowing" ref="text" class="text">
        <span class="letter">E</span>
        <span class="letter">G</span>
        <span class="letter">S</span>
        <span class="letter">T</span>
        <span class="letter">A</span>
        <span class="letter">D</span>
      </div>
      <p v-if="javascriptIsDisabled" class="script">Requires javascript!</p>
    </div>
  </transition>
</template>

<script>
import gsap from 'gsap'

export default {
  data() {
    return {
      isShowing: true,
      loadTimeout: null,
      loadDuration: 1000,
      tl: gsap.timeline(),
      tlLetters: gsap.timeline(),
      letters: null,
      javascriptIsDisabled: true
    }
  },
  computed: {
    hideAnimations() {
      return this.$store.state.device.hideAnimations
    },
    scrimShouldShow() {
      return this.isShowing && !this.$store.state.siteHasMounted
    }
  },
  watch: {
    isShowing(showing) {
      if (showing) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
  mounted() {
    this.javascriptIsDisabled = false
    this.animateLetters()
    this.$nuxt.$on('site::mounted', this.hide)
    this.$nuxt.$on('page::mounted', this.hide)
  },
  beforeDestroy() {
    clearTimeout(this.loadTimeout)
    this.isShowing = false
    this.$nuxt.$off('page::mounted')
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
    leave(el, done) {
      this.tlLetters.pause()

      this.tl.to(this.letters, {
        delay: 0.5,
        duration: 0.5,
        opacity: 0,
        y: this.$store.state.device.winHeight * 0.1,
        // rotation: 30,
        // skewY: 90,
        // skewX: 90,
        transformOrigin: '0% 50% -100%',
        ease: 'Power2.easeIn',
        stagger: 0.1
      })
      this.tl.to(this.$refs.scrim, {
        ease: 'Power2.easeIn',
        duration: 0.5,
        opacity: 0,
        onComplete: done
      })
    },
    animateLetters() {
      this.letters = this.$refs.text.querySelectorAll('.letter')
      this.tlLetters.set(this.letters, { opacity: 0 })

      this.tlLetters.fromTo(
        this.letters,
        {
          opacity: 0
        },
        {
          duration: 1,
          ease: 'Power3.inOut',
          opacity: 1,
          stagger: 0.1
        }
      )

      // this.tlLetters.fromTo(
      //   this.letters,
      //   {
      //     opacity: 0,
      //     repeat: -1
      //   },
      //   {
      //     duration: 0.5,
      //     ease: 'Power3.inOut',
      //     opacity: 1,
      //     stagger: {
      //       each: 0.1,
      //       yoyo: true,
      //       repeat: -1
      //     }
      //   }
      // )
    }
  }
}
</script>

<style lang="scss" scoped>
.scrim {
  background-color: black;
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

  @media (min-width: 1024px) {
    align-items: center;

    .text {
      font-size: clamp(96px, 40vmin, 200px) !important;
    }
  }

  .text {
    color: var(--background);
    pointer-events: none;
    font-family: sans-serif;
    font-size: 26vw;

    margin-left: -0.08em;
    letter-spacing: -0.08em;
    text-transform: uppercase;
    display: flex;
  }
}

.script {
  color: var(--background);
}
</style>
