<!--

1. Provide a pause button and do NOT use autoplay
2. Normalize focus/blur a11y helpers
4. Tell the user how many slides there are, and where they are in that slideshow.
-->

<template>
  <section
    class="slideshow"
    :aria-live="ariaLive ? 'polite' : 'off'"
    :aria-label="`${ariaDescription} - Navigate with arrow keys`"
    aria-roledescription="carousel"
    tabindex="0"
    @keydown.right="goTo('next')"
    @keydown.left="goTo('previous')"
    @keydown.space.prevent="goTo('next')"
    @focus="onSlideshowFocus"
    @blur="onSlideshowBlur"
    @mouseenter="onSlideshowFocus"
    @mouseleave="onSlideshowBlur"
  >
    <button
      class="slideshow__ui next"
      aria-label="Next Slide"
      @click="goTo('next', $event)"
      @focus="ariaLive = true"
      @blur="ariaLive = false"
      @mouseenter="mouseInNext"
      @mouseout="mouseOutNext"
    >
      Next
    </button>
    <button
      class="slideshow__ui prev"
      aria-label="Previous Slide"
      @click="goTo('previous', $event)"
      @focus="ariaLive = true"
      @blur="ariaLive = false"
      @mouseenter="mouseInPrev"
      @mouseout="mouseOutPrev"
    >
      Previous
    </button>
    <ul
      :style="[{ minHeight: `${slideHeight}px` }]"
      :class="[
        'slides',
        { 'is-hovered-next': hoverNext },
        { 'is-hovered-prev': hoverPrev }
      ]"
    >
      <li
        v-for="(num, index) in images"
        :key="num"
        ref="slide"
        role="group"
        :aria-label="`${index + 1} of ${indexMax + 1}`"
        aria-roledescription="slide"
        :class="[
          'slide',
          { 'is-curr': index === indexCurr },
          { 'is-peaking': getIsPeaking(index) },
          { 'trans-to': index === indexTransTo },
          { 'trans-from': index === indexTransFrom }
        ]"
        @mouseenter="isAutoplay && !reduceMotion ? stopAutoplay() : null"
        @mouseleave="isAutoplay && !reduceMotion ? startAutoplay() : null"
      >
        <img :src="num" :alt="`this is an alt tag of number ${index}`" />
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {
      // a11y
      ariaLive: false,
      ariaDescription: '',

      // navigation
      indexStart: 0,
      indexCurr: null,
      indexNext: null,
      indexPrev: null,
      indexMax: null,
      indexTransFrom: null,
      indexTransTo: null,
      indexPeaking: null,

      // slide info
      slides: null,
      slideHeight: null,

      // interaction
      hoverNext: false,
      hoverPrev: false,
      hoverLast: null,
      hoveredOnButton: false,

      // state
      isTransitioning: false,
      isAutoplay: true,
      autoplayInterval: null,
      autoplayDuration: 1000,

      // animation
      hidePrev: false,
      hideNext: false,

      // fake
      images: [
        'https://www.ricardoferrol.com/thumbs/projects/peter-langer-shoots-beauty-for-the-dolder-grand/p_langer_dolder_01_hi_f-960x1344.jpg',
        'https://www.ricardoferrol.com/thumbs/projects/peter-langer-shoots-beauty-for-the-dolder-grand/p_langer_dolder_02_hi-960x1344.jpg',
        'https://www.ricardoferrol.com/thumbs/projects/peter-langer-shoots-beauty-for-the-dolder-grand/p_langer_dolder_03_hi-960x1344.jpg'
      ]
    }
  },
  computed: {
    reduceMotion() {
      return this.$store.state.device.hideAnimations
    }
  },
  watch: {
    hoverPrev(newVal) {
      newVal ? (this.hoveredOnButton = true) : this.mouseOutNextPrevDelay()
    },
    hoverNext(newVal) {
      newVal ? (this.hoveredOnButton = true) : this.mouseOutNextPrevDelay()
    }
  },
  mounted() {
    this.init(this.indexStart)
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    init(startIndex) {
      // setup indexing
      this.indexCurr = startIndex
      this.slides = this.$refs.slide
      this.indexMax = this.slides.length - 1
      this.setSiblingsIndex()

      // set height
      this.setHeight(this.indexStart)
      this.$nuxt.$on('window::resize', () => {
        this.setHeight(this.indexCurr)
      })

      if (this.isAutoplay && !this.reduceMotion) this.startAutoplay()
    },
    destroy() {
      this.$nuxt.$off('window::resize')
      this.stopAutoplay()
    },
    goTo(newIndex, ev) {
      let transTo

      switch (newIndex) {
        case 'next':
          transTo = this.getNextIndex()
          break
        case 'previous':
          transTo = this.getPrevIndex()
          break
        default:
          transTo = newIndex
          break
      }

      // If already transitioning, or next slide is already active, end func
      if (this.isTransitioning) return
      if (this.indexCurr === transTo) return

      // show the next active slide behind immediately
      this.indexTransTo = transTo
      this.isTransitioning = true
      this.setHeight(transTo)

      // fade out current
      this.indexTransFrom = this.indexCurr
      this.slides[this.indexTransFrom].addEventListener(
        'transitionend',
        this.onTransitionEnd
      )

      // if user interacts with click, stop autoplaying
      if (this.isAutoplay && ev && ev.type === 'click') {
        this.stopAutoplay()
        this.isAutoplay = false
      }
    },
    getNextIndex() {
      return this.indexCurr === this.indexMax ? 0 : this.indexCurr + 1
    },
    getPrevIndex() {
      return this.indexCurr === 0 ? this.indexMax : this.indexCurr - 1
    },
    getIsPeaking(index) {
      return (
        (this.hoveredOnButton &&
          this.hoverLast === 'next' &&
          index === this.indexNext) ||
        (this.hoveredOnButton &&
          this.hoverLast === 'prev' &&
          index === this.indexPrev)
      )
    },
    setSiblingsIndex() {
      this.indexNext = this.indexCurr < this.indexMax ? this.indexCurr + 1 : 0
      this.indexPrev = this.indexCurr === 0 ? this.indexMax : this.indexCurr - 1
    },
    onTransitionEnd() {
      this.slides[this.indexTransFrom].removeEventListener(
        'transitionend',
        this.onTransitionEnd
      )

      // update all indexes now that transition is complete
      this.indexCurr = this.indexTransTo
      this.setSiblingsIndex()

      // resets
      this.indexTransFrom = null
      this.indexTransTo = null
      this.isTransitioning = false
    },
    setHeight(index) {
      this.slideHeight = this.slides[index].getBoundingClientRect().height
    },
    startAutoplay() {
      this.autoplayInterval = setInterval(() => {
        this.goTo('next')
      }, this.autoplayDuration)
    },
    stopAutoplay() {
      clearInterval(this.autoplayInterval)
    },
    mouseInNext() {
      this.hoverNext = true
      this.hoverLast = 'next'
      this.autoplayPause()
    },
    mouseOutNext() {
      this.hoverNext = false
      this.autoplayResume()
    },
    mouseInPrev() {
      this.hoverPrev = true
      this.hoverLast = 'prev'
      this.autoplayPause()
    },
    mouseOutPrev() {
      this.hoverPrev = false
      this.autoplayResume()
    },
    mouseOutNextPrevDelay() {
      setTimeout(() => {
        this.hoveredOnButton = false
      }, 400)
    },
    onSlideshowFocus() {
      this.ariaLive = true
      this.autoplayPause()
    },
    onSlideshowBlur() {
      this.ariaLive = false
      this.autoplayResume()
    },
    autoplayPause() {
      if (this.isAutoplay && !this.reduceMotion) this.stopAutoplay()
    },
    autoplayResume() {
      if (this.isAutoplay && !this.reduceMotion) this.startAutoplay()
    }
  }
}
</script>

<style lang="scss" scoped>
.slideshow {
  position: relative;
  width: 500px;

  .slides {
    transition: min-height 400ms ease-in-out;
    position: relative;
    overflow: hidden;
    width: 100%;
  }

  &__ui {
    position: absolute;
    height: 100%;
    min-width: 44px;
    width: clamp(44px, 20%, 88px);
    z-index: 4;
    top: 0;
    appearance: none;
    background: 0;
    border: 0;
    outline: 0;

    &.next {
      right: 0;
      cursor: e-resize;
    }

    &.prev {
      left: 0;
      cursor: w-resize;
    }
  }

  button {
    z-index: 100;
  }

  .slide {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    visibility: hidden;

    &.is-curr {
      z-index: 3;
      visibility: visible;
    }

    &.is-peaking,
    &.trans-to {
      z-index: 2;
      opacity: 1;
      visibility: visible;
    }

    &.trans-from {
      transition: opacity 400ms var(--ease);
      opacity: 0;

      @media (prefers-reduced-motion) {
        transition: opacity 1ms linear;
      }
    }

    // fake
    width: 100%;
    // height: 300px;
    font-size: 10vw;

    img {
      width: 100%;
      height: auto;
      display: block;
      margin: 0;
      padding: 0;
    }
  }

  // mask animation
  .is-curr,
  .trans-to {
    transition: mask-position 400ms ease-in-out;
    mask-size: 300% 100%;
    mask-position: 50% 0%;
    mask-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 20%,
      rgba(0, 0, 0, 1) 80%,
      rgba(0, 0, 0, 0) 100%
    );
  }
  .is-hovered-next .is-curr {
    mask-position: 100% 0%;
  }
  .is-hovered-prev .is-curr {
    mask-position: 0% 0%;
  }
}
</style>
