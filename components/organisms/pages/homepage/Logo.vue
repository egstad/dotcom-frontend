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

export default {
  data() {
    return {
      timeline: null,
      chars: null
    }
  },
  mounted() {
    this.gsapInit()
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
        delay: 0.5,
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
      // which character is clicked? start there
      const startIndex = ev.target.dataset.index
      // number of animations
      const shuffleNum = Math.round(Math.random() * 3)

      switch (shuffleNum) {
        case 0:
          this.animWave(startIndex)
          break
        case 1:
          this.animSqueeze(startIndex)
          break
        case 2:
          this.animSqueeze(startIndex)
          break
        default:
          break
      }
    },
    animWave(startIndex) {
      const multiplier = (parseInt(startIndex) + 1) * 0.01

      this.timeline.to(this.chars, {
        duration: 0.2 + multiplier,
        y: `-${50}%`,
        ease: 'Power3.inOut',

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
    animRotate(startIndex) {
      const rotation = Math.round(Math.random() * 360)
      const plusOrMinus = Math.random() < 0.5 ? -1 : 1

      this.timeline.to(this.chars, {
        duration: 0.5,
        scaleX: 0.65,
        rotation: plusOrMinus * rotation,
        transformOrigin: 'center center',
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
      const multiplier = parseInt(startIndex) * 0.01

      this.timeline.to(this.chars, {
        duration: 0.5,
        scaleY: 0.1,
        transformOrigin: 'left bottom',
        ease: 'expo.inOut',
        stagger: {
          grid: [1, 6],
          yoyo: true,
          repeat: 1,
          from: startIndex,
          axis: 'x',
          each: multiplier + 0.05
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$kern-offset: 0.5vw;
$char-height: 28.25vw;

.logo {
  padding: 0 var(--button-click-offset);
  margin-top: 35vh;

  @include bp($lg) {
    margin-top: 45vh;
    margin-bottom: 1vw;
  }

  @include bp($xl) {
    margin-top: 32vh;
    margin-bottom: 0.5vw;
  }

  &-text {
    cursor: pointer !important;
    position: relative;
    height: 20vw;
    line-height: 20vw;
    width: 100%;
    color: var(--foreground);
    text-indent: -0.075em;
    user-select: none;
    font-size: calc(#{$char-height} - (var(--button-click-offset) * 0.5));
  }

  .char {
    font-variation-settings: 'wght' 700;
    font-weight: normal;
    position: absolute;
    opacity: 0;

    &[data-index='0'] {
      left: 0;
    }
    &[data-index='1'] {
      left: 0.54em;
    }
    &[data-index='2'] {
      left: 1.23em;
    }
    &[data-index='3'] {
      left: 1.81em;
    }
    &[data-index='4'] {
      left: 2.25em;
    }
    &[data-index='5'] {
      left: 2.9em;
    }
  }
}
</style>
