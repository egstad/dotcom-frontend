<!--

1. Provide a pause button and do NOT use autoplay
2. Normalize focus/blur a11y helpers
4. Tell the user how many slides there are, and where they are in that slideshow.
-->

<template>
  <section
    :class="[
      'slideshow',
      { 'is-hovered-next': hoverNext && !isTouch },
      { 'is-hovered-prev': hoverPrev && !isTouch }
    ]"
    :aria-live="ariaLive ? 'polite' : 'off'"
    :aria-label="`${ariaDescription} - Navigate with arrow keys`"
    aria-roledescription="carousel"
    tabindex="0"
    @focus="onFocus"
    @blur="onBlur"
    @click="goTo('next', $event)"
    @keydown.self.right="goTo('next', $event)"
    @keydown.self.left="goTo('previous', $event)"
    @mouseenter.self="onFocus"
    @mouseleave.self="onBlur"
  >
    <button
      class="slideshow__ui next"
      aria-label="Next Slide"
      @click="goTo('next', $event)"
      @focus="onFocus($event, 'next')"
      @blur="onBlur($event, 'next')"
      @mouseenter="onFocus($event, 'next')"
      @mouseout="onBlur($event, 'next')"
      @keydown.self.right="goTo('next', $event)"
      @keydown.self.left="goTo('previous', $event)"
    >
      <span class="pill">
        <SlideshowArrow class="arrow" direction="right" />
      </span>
    </button>
    <button
      class="slideshow__ui prev"
      aria-label="Previous Slide"
      @click="goTo('previous', $event)"
      @focus="onFocus($event, 'previous')"
      @blur="onBlur($event, 'previous')"
      @mouseenter="onFocus($event, 'previous')"
      @mouseout="onBlur($event, 'previous')"
      @keydown.self.right="goTo('next', $event)"
      @keydown.self.left="goTo('previous', $event)"
    >
      <span class="pill">
        <SlideshowArrow class="arrow" direction="left" />
      </span>
    </button>
    <ul :style="[{ minHeight: `${slideHeight}px` }]" class="slides">
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
      >
        <img :src="num" :alt="`this is an alt tag of number ${index}`" />
      </li>
    </ul>
  </section>
</template>

<script>
import SlideshowArrow from '@/components/atoms/Slideshow/SlideshowArrow.vue'

export default {
  components: {
    SlideshowArrow
  },
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
        'https://www.ricardoferrol.com/thumbs/projects/peter-langer-shoots-beauty-for-the-dolder-grand/p_langer_dolder_02_hi-960x1344.jpg'
        // 'https://www.ricardoferrol.com/thumbs/projects/peter-langer-shoots-beauty-for-the-dolder-grand/p_langer_dolder_03_hi-960x1344.jpg'
      ]
    }
  },
  computed: {
    reduceMotion() {
      return this.$store.state.device.hideAnimations
    },
    isTouch() {
      return this.$store.state.device.isMobile
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
    },
    mouseOutNext() {
      this.hoverNext = false
    },
    mouseInPrev() {
      this.hoverPrev = true
      this.hoverLast = 'prev'
    },
    mouseOutPrev() {
      this.hoverPrev = false
    },
    mouseOutNextPrevDelay() {
      // this function delays this.hoveredOnButton's change to false.
      // when this variable is set to false, the 'is-peaking' class is removed
      // from the next transitioning element. Withoug this delay, there is an
      // unpleasant flash caused by the 'is-peaking' element's visiblility set to
      // hidden too soon and revealing the background color.

      const curr = this.indexCurr
      const transDur = parseFloat(
        getComputedStyle(this.slides[curr]).transitionDuration
      )
      const transDel = parseFloat(
        getComputedStyle(this.slides[curr]).transitionDelay
      )

      const onEnd = (ev) => {
        const isNotHovered =
          this.hoverNext === false && this.hoverPrev === false

        if (ev.propertyName.includes('mask')) {
          this.slides[curr].addEventListener('transitionend', onEnd)

          if (ev.elapsedTime >= transDur + transDel && isNotHovered)
            this.hoveredOnButton = false
        }
      }

      this.slides[curr].addEventListener('transitionend', onEnd)
    },
    onFocus(event, direction) {
      this.ariaLive = true
      if (this.isAutoplay && !this.reduceMotion) this.stopAutoplay()

      if (!direction) return

      switch (true) {
        case event.type === 'mouseenter' && direction === 'next':
          this.mouseInNext()
          break
        case event.type === 'mouseenter' && direction === 'previous':
          this.mouseInPrev()
          break
      }
    },
    onBlur(event, direction) {
      this.ariaLive = false
      if (this.isAutoplay && !this.reduceMotion && !direction)
        this.startAutoplay()

      if (!direction) return

      switch (true) {
        case event.type === 'mouseout' && direction === 'next':
          this.mouseOutNext()
          break
        case event.type === 'mouseout' && direction === 'previous':
          this.mouseOutPrev()
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.slideshow {
  position: relative;
  width: 100%;

  &:focus-visible {
    outline: 4px solid hsla(var(--aH), var(--aS), var(--aL), 100%);
  }

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
    display: flex;
    align-items: center;
    justify-content: center;

    // svg arrows
    .arrow {
      transition: stroke var(--time) var(--ease);
      stroke: var(--foreground);
    }

    &.next {
      right: 0;
      cursor: e-resize;

      .arrow {
        position: relative;
        left: 0.1em;
      }

      &:focus-visible .pill {
        background-color: hsla(var(--bH), var(--bS), var(--bL), 100%);
        outline: 4px solid hsla(var(--aH), var(--aS), var(--aL), 100%);
      }
    }

    &.prev {
      left: 0;
      cursor: w-resize;

      .arrow {
        position: relative;
        right: 0.1em;
      }

      &:focus-visible .pill {
        background-color: hsla(var(--bH), var(--bS), var(--bL), 100%);
        outline: 4px solid hsla(var(--aH), var(--aS), var(--aL), 100%);
      }
    }

    .pill {
      pointer-events: none;
      transition: background-color 400ms ease-in-out, opacity 400ms ease-in-out;
      background-color: hsla(var(--bH), var(--bS), var(--bL), 60%);
      outline-offset: 4px;
      display: block;
      min-width: 44px;
      min-height: 44px;
      width: clamp(44px, 1vw, 64px);
      padding-top: 1.2em;
      padding-bottom: 1.2em;
      border-radius: 0.75em;
      backdrop-filter: blur(15px);
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
    mask-size: 200% 100%;
    mask-position: 50% 0%;
    mask-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0) 5%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 0) 95%
    );

    &.is-curr {
      z-index: 3;
      visibility: visible;
      transition: mask-position 300ms 100ms ease-in-out;
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
  &.is-hovered-next {
    .is-curr {
      mask-position: 100% 100%;
    }

    .next .pill {
      background-color: hsla(var(--bH), var(--bS), var(--bL), 100%);
    }

    .prev .pill {
      opacity: 0;
    }
  }
  &.is-hovered-prev {
    .is-curr {
      mask-position: 0% 100%;
    }

    .prev .pill {
      background-color: hsla(var(--bH), var(--bS), var(--bL), 100%);
    }

    .next .pill {
      opacity: 0;
    }
  }
}
</style>
