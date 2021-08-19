<template>
  <h2 ref="text" class="bio is-hidden">
    {{ text }}
  </h2>
</template>

<script>
import gsap from 'gsap'
import { SplitText } from '@/plugins/gsap/SplitText'

if (process.client) {
  gsap.registerPlugin(SplitText)
}

export default {
  data() {
    return {
      wordsInner: null,
      wordsOuter: null,
      lines: null,
      timeline: gsap.timeline(),
      splitText: null,
      text:
        'Hello world, I’m Jordan Egstad. I’m a graphic designer and web developer creating expressive and enduring brand identities, websites, apps, typefaces, imagery, and more.'
    }
  },
  mounted() {
    this.initGSAP()
    this.$nuxt.$on('animate::bio', this.animateText)
  },
  methods: {
    initGSAP() {
      this.wordsOuter = new SplitText(this.$refs.text, {
        type: 'words',
        wordsClass: 'split-outer'
      })

      this.wordsInner = new SplitText(this.$refs.text, {
        type: 'words',
        wordsClass: 'split-inner'
      })
    },
    animateText() {
      this.innerSplit = new SplitText()

      if (this.$refs.text) {
        this.$refs.text.classList.remove('is-hidden')
      }

      this.timeline.set(this.wordsInner.words, { opacity: 0, yPercent: 50 })

      this.timeline.to(this.wordsInner.words, {
        delay: 0.5,
        duration: 0.5,
        opacity: 1,
        yPercent: 0,
        stagger: 0.025,
        onComplete: () => {
          // this.wordsInner.revert()
          // this.wordsOuter.revert()
          this.$nuxt.$emit('animate::details')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.bio {
  width: calc(100% - var(--button-click-offset) * 2);
  margin-left: var(--button-click-offset);

  border-top: 1px solid var(--foreground);
  border-bottom: 1px solid var(--foreground);
  font-variation-settings: 'wght' 600;

  font-size: 7vw;
  line-height: 1.05;
  margin-top: 2.25vw;
  padding-top: 4vw;
  padding-bottom: 4vw;
  letter-spacing: -0.04em;

  @include bp($md) {
    font-size: 6vw;
    letter-spacing: -0.055em;
    line-height: 1;
    padding-top: 3vw;
    padding-bottom: 3vw;
  }

  @include bp($lg) {
    font-variation-settings: 'wght' 500;
    font-size: calc(5.15vw - 1px);
    letter-spacing: -0.055em;
    padding-top: 2vw;
    padding-bottom: 2vw;
    margin-top: 0.2vw;
  }

  @include bp($xl) {
    line-height: 0.97;
    font-size: calc(4.38vw - 1px);
    padding-top: 1.5vw;
    padding-bottom: 1.5vw;
  }

  overflow: hidden;

  &.is-hidden {
    opacity: 0;
  }

  > span,
  > div {
    position: relative;
    margin: 0;
    display: inline !important;
  }

  .split-outer {
    overflow: hidden;
  }
  .split-inner {
    display: inline-block;
  }
}
</style>
