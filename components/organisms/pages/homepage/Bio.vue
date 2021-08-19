<template>
  <h2 ref="text" class="para is-hidden">{{ text }}</h2>
</template>

<script>
import gsap from 'gsap'
import { SplitText } from '@/plugins/gsap/SplitText'

export default {
  data() {
    return {
      timeline: null,
      splitText: null,
      splitWrap: null,
      chars: null,
      lines: null,
      text:
        'Hello world, I’m Jordan Egstad. I’m a graphic designer and web developer creating expressive and enduring brand identities, websites, apps, typefaces, and more.'
    }
  },
  mounted() {
    this.initGSAP()
    this.$app.$on('animate::bio', this.animateText)
  },
  methods: {
    initGSAP() {
      this.timeline = gsap.timeline()
      this.splitText = new SplitText(this.$refs.text, {
        type: 'lines',
        linesClass: 'line-child'
      })
      this.splitWrap = new SplitText(this.$refs.text, {
        type: 'lines',
        linesClass: 'line-parent hidden'
      })
      this.lines = this.splitText.lines
    },
    animateText() {
      this.$refs.text.classList.remove('is-hidden')

      this.timeline.from(
        '.line-child',
        {
          duration: 0.8,
          opacity: 0,
          y: '100%',
          ease: 'Power2.easeOut',
          stagger: 0.15,
          onStart: () => {
            setTimeout(() => {
              this.$app.$emit('animate::details')
            }, 500)
          },
          onComplete: () => {
            // split in reverse order of initialization
            this.splitWrap.revert()
            this.splitText.revert()

            setTimeout(() => {
              this.$app.$emit('animate::links')
            }, 500)
          }
        },
        '+=0'
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.para {
  font-variation-settings: 'wght' 500;
  line-height: 1;
  font-size: 6.8vw;
  letter-spacing: -0.04em;
  padding-top: 0.2em;
  padding-bottom: 0.4em;

  &.is-hidden {
    opacity: 0;
  }

  @media (min-width: $md) {
    line-height: 1;
    font-size: 4.74vw;
  }
}
</style>
