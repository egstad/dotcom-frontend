<template>
  <div class="logo">
    <h1 ref="text" class="logo-text" @mousedown="reanimate($event)">
      <span class="char">E</span>
      <span class="char">G</span>
      <span class="char">S</span>
      <span class="char">T</span>
      <span class="char">A</span>
      <span class="char">D</span>
    </h1>
  </div>
</template>

<script>
import gsap from 'gsap'
import { CustomEase } from '@/plugins/gsap/CustomEase'
import { CustomWiggle } from '@/plugins/gsap/CustomWiggle'

if (process.client) {
  gsap.registerPlugin(CustomEase, CustomWiggle)
}

export default {
  data() {
    return {
      timeline: null,
      chars: null,
      themesIndex: -1,
      themes: [
        // sky blue
        {
          background: {
            h: 212,
            s: 0.89,
            l: 0.57,
            a: 1
          },
          foreground: {
            h: 32,
            s: 0.72,
            l: 0.95,
            a: 1
          },
          accent: {
            h: 32,
            s: 0.72,
            l: 0.95,
            a: 0.1
          }
        },
        // khaki
        {
          background: {
            h: 27,
            s: 0.33,
            l: 0.49,
            a: 1
          },
          foreground: {
            h: 216,
            s: 0.66,
            l: 0.93,
            a: 1
          },
          accent: {
            h: 216,
            s: 0.66,
            l: 0.93,
            a: 0.1
          }
        },
        // red
        {
          background: {
            h: 2,
            s: 0.89,
            l: 0.58,
            a: 1
          },
          foreground: {
            h: 137,
            s: 0.32,
            l: 0.93,
            a: 1
          },
          accent: {
            h: 137,
            s: 0.32,
            l: 0.93,
            a: 0.1
          }
        },
        // olive
        {
          background: {
            h: 179,
            s: 0.97,
            l: 0.13,
            a: 1
          },
          foreground: {
            h: 126,
            s: 0.22,
            l: 0.88,
            a: 1
          },
          accent: {
            h: 126,
            s: 0.22,
            l: 0.88,
            a: 0.1
          }
        },
        // green
        {
          background: {
            h: 151,
            s: 0.95,
            l: 0.35,
            a: 1
          },
          foreground: {
            h: 72,
            s: 0.19,
            l: 0.95,
            a: 1
          },
          accent: {
            h: 72,
            s: 0.19,
            l: 0.95,
            a: 0.1
          }
        },
        // yellow
        {
          background: {
            h: 41,
            s: 1,
            l: 0.5,
            a: 1
          },
          foreground: {
            h: 0,
            s: 0.95,
            l: 0.47,
            a: 1
          },
          accent: {
            h: 0,
            s: 0.95,
            l: 0.47,
            a: 0.1
          }
        },
        // pink
        {
          background: {
            h: 310,
            s: 0.81,
            l: 0.85,
            a: 1
          },
          foreground: {
            h: 0,
            s: 0.95,
            l: 0.47,
            a: 1
          },
          accent: {
            h: 0,
            s: 0.95,
            l: 0.47,
            a: 0.1
          }
        },
        // gray
        {
          background: {
            h: 197,
            s: 0.24,
            l: 0.8,
            a: 1
          },
          foreground: {
            h: 44,
            s: 0.69,
            l: 0.26,
            a: 1
          },
          accent: {
            h: 44,
            s: 0.69,
            l: 0.26,
            a: 0.1
          }
        },
        // blue
        {
          background: {
            h: 248,
            s: 0.85,
            l: 0.35,
            a: 1
          },
          foreground: {
            h: 209,
            s: 0.3,
            l: 0.8,
            a: 1
          },
          accent: {
            h: 209,
            s: 0.3,
            l: 0.8,
            a: 0.1
          }
        },
        // black
        {
          background: {
            h: 40,
            s: 0.4,
            l: 0.14,
            a: 1
          },
          foreground: {
            h: 54,
            s: 0.4,
            l: 0.86,
            a: 1
          },
          accent: {
            h: 54,
            s: 0.4,
            l: 0.86,
            a: 0.1
          }
        },
        // cyan
        {
          background: {
            h: 169,
            s: 1,
            l: 0.81,
            a: 1
          },
          foreground: {
            h: 266,
            s: 0.91,
            l: 0.79,
            a: 1
          },
          accent: {
            h: 266,
            s: 0.91,
            l: 0.79,
            a: 0.1
          }
        },
        // pink/red
        {
          background: {
            h: 309,
            s: 0.92,
            l: 0.52,
            a: 1
          },
          foreground: {
            h: 347,
            s: 1,
            l: 0.44,
            a: 1
          },
          accent: {
            h: 347,
            s: 1,
            l: 0.44,
            a: 0.1
          }
        },
        // orange/gray
        {
          background: {
            h: 19,
            s: 1,
            l: 0.5,
            a: 1
          },
          foreground: {
            h: 202,
            s: 0.21,
            l: 0.68,
            a: 1
          },
          accent: {
            h: 202,
            s: 0.21,
            l: 0.68,
            a: 0.1
          }
        },
        // yellow/blue
        {
          background: {
            h: 52,
            s: 0.99,
            l: 0.56,
            a: 1
          },
          foreground: {
            h: 223,
            s: 0.87,
            l: 0.42,
            a: 1
          },
          accent: {
            h: 223,
            s: 0.87,
            l: 0.42,
            a: 0.1
          }
        },
        // lavendar/yellow
        {
          background: {
            h: 248,
            s: 1,
            l: 0.85,
            a: 1
          },
          foreground: {
            h: 65,
            s: 1,
            l: 0.49,
            a: 1
          },
          accent: {
            h: 65,
            s: 1,
            l: 0.49,
            a: 0.1
          }
        },
        // white
        {
          background: {
            h: 47,
            s: 0.14,
            l: 0.87,
            a: 1
          },
          foreground: {
            h: 40,
            s: 0.4,
            l: 0.14,
            a: 1
          },
          accent: {
            h: 40,
            s: 0.4,
            l: 0.14,
            a: 0.1
          }
        }
      ],
      hintTimeout: null,
      hintTimeoutReset: null,
      hintIntervalDurattion: 5000,
      numOfClicks: 0,
      isTransitioning: false
    }
  },
  mounted() {
    this.gsapInit()
    this.initHintTimeout()
    this.$nuxt.$on('animate::logo', this.animateText)
  },
  beforeDestroy() {
    this.$nuxt.$off('animate::logo', this.animateText)
  },
  methods: {
    gsapInit() {
      // create gsap timeline
      this.timeline = gsap.timeline()
      // cache a reference to each character
      this.chars = this.$refs.text.querySelectorAll('.char')
      // add a data-prop for accessing
      this.chars.forEach((el, index) => {
        el.setAttribute('data-index', index)
      })
      this.isHidden = false
    },
    animateText(animationIndex) {
      this.timeline.to(this.chars, {
        duration: 0.8,
        delay: 0,
        opacity: 1,
        stagger: 0.15,
        onStart: () => {
          setTimeout(() => {
            this.$nuxt.$emit('animate::bio')
          }, 500)
        }
      })
    },
    reanimate(ev) {
      if (this.isTransitioning) return

      // which character is clicked? start there
      const startIndex = parseFloat(ev.target.dataset.index)

      this.numOfClicks++

      this.handleTimeouts()

      switch (startIndex) {
        case 0:
          this.animWave(startIndex)
          break
        case 1:
          this.animRotate(startIndex)
          break
        case 2:
          this.animTheme()
          break
        case 3:
          this.animVariableType(startIndex)
          break
        case 4:
          this.animFade(startIndex)
          break
        case 5:
          this.animSqueeze(startIndex)
          break
        default:
          break
      }

      this.$ga.event({
        eventCategory: 'Logo Interaction',
        eventAction: 'click',
        eventLabel: `The "${this.chars[startIndex].innerHTML}" was clicked. eventValue = index of letter clicked`,
        eventValue: startIndex
      })
    },
    animWave(startIndex) {
      this.isTransitioning = true

      this.timeline.to(this.chars, {
        duration: 0.2,
        y: window.innerHeight * -0.05,
        ease: 'Power3.inOut',
        onComplete: () => {
          gsap.set(this.chars, { clearProps: 'y' })
          this.isTransitioning = false
        },
        // transformOrigin: 'center center',
        stagger: {
          grid: [1, 6],
          yoyo: true,
          repeat: 1,
          from: startIndex,
          axis: 'x',
          each: 0.05
        }
      })
    },
    animRotate(startIndex) {
      this.isTransitioning = true
      const rotation = Math.round(Math.random() * 24 * 15)
      const plusOrMinus = Math.random() < 0.5 ? -1 : 1

      this.timeline.to(this.chars, {
        duration: 0.5,
        scaleX: 0.65,
        rotation: plusOrMinus * rotation,
        // transformOrigin: 'center center',
        onComplete: () => {
          gsap.set(this.chars, { clearProps: 'rotation' })
          this.isTransitioning = false
        },
        ease: 'Power2.easeInOut',
        stagger: {
          grid: [1, 6],
          yoyo: true,
          repeat: 1,
          repeatDelay: 0.25,
          from: startIndex,
          axis: 'x',
          each: 0.025
        }
      })
    },
    animSqueeze(startIndex) {
      this.isTransitioning = true
      const multiplier = parseInt(startIndex) * 0.01

      this.timeline.to(this.chars, {
        duration: 0.5,
        scaleX: 0.1,
        transformOrigin: 'left center',
        ease: 'expo.inOut',
        onComplete: () => {
          gsap.set(this.chars, { clearProps: 'transformOrigin, scaleX' })
          this.isTransitioning = false
        },
        stagger: {
          grid: [1, 6],
          yoyo: true,
          repeat: 1,
          from: startIndex,
          axis: 'x',
          each: multiplier + 0.05
        }
      })
    },
    animVariableType(startIndex) {
      this.isTransitioning = true

      this.timeline.fromTo(
        this.chars,
        {
          '--font-width': 700
        },
        {
          duration: 0.75,
          '--font-width': 0,
          ease: 'expo.inOut',
          onComplete: () => {
            gsap.set(this.chars, { clearProps: '--font-width' })
            this.isTransitioning = false
          },
          stagger: {
            grid: [1, 6],
            yoyo: true,
            repeat: 1,
            from: startIndex,
            axis: 'x',
            each: 0.1
          }
        }
      )
      // const multiplier = parseInt(startIndex) * 0.01

      // this.timeline.to(this.chars, {
      //   duration: 1,
      //   opacity: 0,
      //   y: -window.innerHeight,
      //   rotation: 30,
      //   skewX: 60,
      //   transformOrigin: '0% 50% -100%',
      //   ease: 'expo.inOut',
      //   stagger: {
      //     grid: [1, 6],
      //     from: startIndex,
      //     axis: 'x',
      //     each: multiplier + 0.05
      //   }
      // })

      // this.timeline.set(this.chars, {
      //   y: 0,
      //   opacity: 0,
      //   rotation: 0,
      //   skewX: 0
      // })

      // this.timeline.to(this.chars, {
      //   duration: 0.5,
      //   opacity: 1,
      //   ease: 'expo.inOut',
      //   stagger: 0.1
      // })
    },
    animFade(startIndex) {
      const multiplier = parseInt(startIndex) * 0.01
      this.isTransitioning = true

      this.timeline.to(this.chars, {
        duration: 0.5,
        opacity: 0.25,
        ease: 'expo.inOut',
        onComplete: () => {
          this.isTransitioning = false
        },
        stagger: {
          grid: [1, 6],
          yoyo: true,
          repeat: 1,
          from: startIndex,
          axis: 'x',
          each: multiplier + 0.05
        }
      })
    },
    animTheme() {
      this.isTransitioning = true

      this.themesIndex =
        this.themesIndex === this.themes.length - 1 ? 0 : this.themesIndex + 1

      this.timeline.to(this.chars[2], {
        duration: 0.125,
        opacity: 0.25,
        ease: 'expo.inOut',
        repeat: 3,
        yoyo: true,
        onComplete: () => {
          this.$store.commit('setIsTransitioning', true)
          this.$store.commit('setCSSVars', this.themes[this.themesIndex])
          this.$nuxt.$emit(
            'egg::updateTheme',
            this.themes[this.themesIndex].background
          )
          this.isTransitioning = false
        }
      })

      setTimeout(() => {
        this.$store.commit('setIsTransitioning', false)
      }, 750)
    },
    initHintTimeout() {
      this.hintTimeout = setInterval(() => {
        this.wiggleLetter()
      }, this.hintIntervalDurattion)
    },
    handleTimeouts() {
      clearInterval(this.hintTimeout)
      clearTimeout(this.hintTimeoutReset)

      // wait a few secs and then start the hint process again
      this.hintTimeoutReset = setTimeout(() => {
        this.initHintTimeout()
      }, this.hintIntervalDurattion * 1.5)
    },
    wiggleLetter() {
      const shuffleNum = Math.round(Math.random() * (this.chars.length - 1))

      // Create a wiggle with 6 oscillations (default type:"easeOut")
      CustomWiggle.create('myWiggle', { wiggles: 5 })

      if (!document.hidden) {
        gsap.to(this.chars[shuffleNum], {
          duration: 1,
          rotation: 7.5,
          skewX: 3.75,
          ease: 'myWiggle',
          onComplete: () => {
            gsap.set(this.chars, { clearProps: 'rotation, skewX' })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$kern-offset: 0.5vw;
$char-height: 28.25vw;

.logo {
  --font-width: 700;

  position: relative;
  z-index: 0;
  padding: 0 var(--button-click-offset);
  margin-top: 45vh;
  margin-bottom: 4vw;

  @include bp($md) {
    margin-bottom: 3.5vw;
  }

  @include bp($lg) {
    margin-bottom: 2vw;
  }

  @include bp($xl) {
    margin-top: 47.5vh;
    margin-bottom: 1vw;
  }

  &-text {
    font-family: var(--sans);
    position: relative;
    line-height: 1;
    width: 100%;
    color: var(--foreground);
    text-indent: -0.075em;
    user-select: none;
    height: calc(#{$char-height - 5.75vw} - (var(--button-click-offset) * 0.5));
    font-size: calc(#{$char-height} - (var(--button-click-offset) * 0.5));
    cursor: pointer !important;

    @include transition {
      transition: color var(--transition-page);
    }
  }

  .char {
    font-variation-settings: 'wght' var(--font-width);
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
