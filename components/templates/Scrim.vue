<template>
  <transition @leave="leave">
    <div v-if="scrimShouldShow" ref="scrim" class="scrim">
      <div v-if="isShowing" ref="text" class="text">
        <span class="letter">E</span>
        <span class="letter">g</span>
        <span class="letter">s</span>
        <span class="letter">t</span>
        <span class="letter">a</span>
        <span class="letter">d</span>
      </div>
      <!-- <p v-if="javascriptIsDisabled" class="script">
        Hi you. Thanks for stopping by. To view this site, you'll need to
        <a href="https://www.enable-javascript.com/"> enable javascript</a>
      </p> -->
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
      loadDuration: 1500,
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
    this.tl.kill()
    this.tlLetters.kill()
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
        delay: 0.25,
        duration: 0.5,
        opacity: 0,
        y: this.$store.state.device.winHeight * 0.1,
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

      this.tlLetters.fromTo(
        this.letters,
        {
          opacity: 0
        },
        {
          delay: this.loadDuration * 0.25 * 0.001,
          duration: this.loadDuration * 0.75 * 0.001,
          ease: 'Power3.inOut',
          opacity: 1,
          stagger: 0.1
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.scrim {
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

    margin-left: -0.08em;
    letter-spacing: -0.08em;
    text-transform: uppercase;
    display: flex;

    .letter {
      opacity: 0;
    }
  }
}

.script {
  font-family: sans-serif;
  color: var(--background);
}
</style>
