<template>
  <div class="bio">
    <hr class="hr" />
    <h2 ref="text" class="text" :class="{ 'is-hidden': !textIsVisible }">
      {{ text }}
    </h2>
    <hr class="hr" />
  </div>
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
      textIsVisible: false,
      text:
        'Hello world, I’m Jordan Egstad. I’m a graphic designer and web developer creating expressive and enduring brand identities, websites, apps, typefaces, imagery, and more.'
    }
  },
  mounted() {
    this.initGSAP()
    this.$nuxt.$on('animate::bio', this.animateText)
  },
  beforeDestroy() {
    this.timeline.kill()
  },
  methods: {
    initGSAP() {
      if (!this.$refs.text) return

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
      const hrEls = this.$el.querySelectorAll('.hr')
      this.textIsVisible = true

      this.timeline.set(this.wordsInner.words, { opacity: 0, yPercent: 50 })
      this.timeline.set(hrEls, { opacity: 0, width: 0 })

      this.timeline
        .to(this.wordsInner.words, {
          delay: 0.5,
          duration: 0.5,
          opacity: 1,
          yPercent: 0,
          stagger: 0.025,
          onComplete: () => {
            this.wordsInner.revert()
            this.wordsOuter.revert()
            this.$nuxt.$emit('animate::details')
          }
        })
        .to(
          hrEls,
          {
            duration: 0.5,
            opacity: 1,
            width: '100%',
            stagger: 0.5
          },
          '-=1'
        )
    }
  }
}
</script>

<style lang="scss">
.bio {
  position: relative;
  z-index: 0;
  width: calc(100% - var(--button-click-offset) * 2);
  margin-left: var(--button-click-offset);

  hr {
    margin: 0;
    width: 0;
    opacity: 0;
    border: 0;
    border-bottom: 1px solid var(--foreground);

    @include transition {
      transition: border-color var(--transition-page);
    }
  }

  .text {
    font-family: var(--sans);
    font-variation-settings: 'wght' 600;

    font-size: 6.75vw;
    line-height: 1.05;
    padding-top: 4vw;
    padding-bottom: 4vw;
    letter-spacing: -0.04em;

    @include bp($md) {
      font-size: 6.15vw;
      letter-spacing: -0.05em;
      line-height: 1;
      padding-top: 3vw;
      padding-bottom: 3vw;
    }

    @include bp($lg) {
      font-variation-settings: 'wght' 550;
      font-size: calc(5.15vw - 1px);
      padding-top: 1.8vw;
      padding-bottom: 2vw;
      margin-top: 0.2vw;
    }

    @include bp($xl) {
      line-height: 0.97;
      font-size: calc(4.2vw - 1px);
      letter-spacing: -0.055em;
      padding-top: 1.1vw;
      padding-bottom: 1.3vw;
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
      font-family: var(--sans);
    }

    .split-outer {
      overflow: hidden;
      font-family: var(--sans);
    }
    .split-inner {
      display: inline-block;
      font-family: var(--sans);
    }
  }
}
</style>
