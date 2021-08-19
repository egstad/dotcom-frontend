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
    this.$app.$on('animate::logo', this.animateText)
  },
  beforeDestroy() {
    this.$app.$off('animate::logo', this.animateText)
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
        opacity: 1,
        stagger: 0.15,
        onStart: () => {
          setTimeout(() => {
            this.$app.$emit('animate::bio')
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
          this.animBold(startIndex)
          break
        case 3:
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
    },
    animBold(startIndex) {
      this.timeline.fromTo(
        this.chars,
        {
          fontWeight: 550
        },
        {
          duration: 0.2,
          fontWeight: 800,
          ease: 'expo.inOut',
          stagger: {
            grid: [1, 6],
            yoyo: true,
            repeat: 1,
            from: startIndex,
            axis: 'x',
            each: 0.1,
            onUpdate() {
              this._targets[0].style.fontVariationSettings =
                "'wght' " + this._targets[0].style.fontWeight
            }
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
$kern-offset: 0.5vw;
$char-height: 23vw;

.logo {
  &-text {
    cursor: pointer !important;
    position: relative;
    height: $char-height;
    line-height: 0.725;
    left: 0;
    width: 100%;
    color: var(--color-accent);
    text-indent: -0.095em;
    user-select: none;
    font-size: calc(31.5vw - #{24px});
  }

  .char {
    position: absolute;
    height: $char-height;
    opacity: 0;
    font-variation-settings: 'wght' 550;
    font-weight: 550;

    @media screen and (min-width: $md) {
      font-variation-settings: 'wght' 500;
      font-weight: 500;
    }

    &[data-index='0'] {
      left: 0;
    }
    &[data-index='1'] {
      left: 15.7vw - $kern-offset;
    }
    &[data-index='2'] {
      left: 34.2vw - $kern-offset;
    }
    &[data-index='3'] {
      left: 49.5vw - $kern-offset;
    }
    &[data-index='4'] {
      left: 61vw - $kern-offset;
    }
    &[data-index='5'] {
      left: 78.5vw - $kern-offset;
    }
  }
}
</style>
