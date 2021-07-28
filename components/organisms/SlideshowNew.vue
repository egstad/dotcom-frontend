<!--

Todo:
1. Provide a pause button for autoplay
2. Tell the user how many slides there are, and where they are in that slideshow.
// https://www.w3.org/TR/wai-aria-practices/examples/carousel/carousel-1.html#
-->

<template>
  <section
    ref="slideshow"
    v-touch:swipe.left="swipeLeft"
    v-touch:swipe.right="swipeRight"
    :class="[
      'slideshow',
      { 'is-hovered-next': hoverNext && !isTouch },
      { 'is-hovered-prev': hoverPrev && !isTouch },
      { 'hide-ui': isPlaying && !hoverNext && !hoverPrev }
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
        v-for="(slide, index) in content"
        :key="slide._key"
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
        <Pic
          :alt="slide.alt"
          :asset="slide.asset._ref"
          :palette="slide.paletteImage"
        />
      </li>
    </ul>
    <!-- <pre>{{ content[0] }}</pre> -->
  </section>
</template>

<script>
import Pic from '@/components/atoms/Pic.vue'
import SlideshowArrow from '@/components/atoms/Slideshow/SlideshowArrow.vue'
import IntersectionObserverAdmin from 'intersection-observer-admin'

export default {
  components: {
    Pic,
    SlideshowArrow
  },
  props: {
    content: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // a11y
      ariaLive: false,

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
      isPlaying: false,
      hasBeenInteractedWith: false,
      isTransitioning: false,
      autoplayInterval: null,

      // animation
      hidePrev: false,
      hideNext: false,

      // intersection observer for autoplay
      observerAutoplay: new IntersectionObserverAdmin()
    }
  },
  computed: {
    reduceMotion() {
      return this.$store.state.device.hideAnimations
    },
    isTouch() {
      return this.$store.state.device.isMobile
    },
    isAutoplay() {
      return this.options.isAutoplay || false
    },
    autoplayDuration() {
      return this.options.autoplayDuration || 3000
    },
    ariaDescription() {
      return this.options.description || null
    },
    startIndex() {
      return this.options.startIndex || 0
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

      // setup an additional observer to handle autolaying
      this.observerAutoplay.addEnterCallback(this.$el, this.inView)
      this.observerAutoplay.addExitCallback(this.$el, this.outOfView)
      this.observerAutoplay.observe(this.$el)
    },
    destroy() {
      this.$nuxt.$off('window::resize')
      this.stopAutoplay()
      this.observerAutoplay.destroy()
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

      // if user interacts via input event, stop autoplaying
      if (this.isAutoplay && ev) {
        this.hasBeenInteractedWith = true
        this.stopAutoplay()
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
      if (this.slides[this.indexTransFrom]) {
        this.slides[this.indexTransFrom].removeEventListener(
          'transitionend',
          this.onTransitionEnd
        )
      }

      // update all indexes now that transition is complete
      this.indexCurr = this.indexTransTo
      this.setSiblingsIndex()

      // resets
      this.indexTransFrom = null
      this.indexTransTo = null
      this.isTransitioning = false
    },
    setHeight(index) {
      setTimeout(() => {
        this.slideHeight = this.slides[index].getBoundingClientRect().height
      }, 1)
    },
    startAutoplay() {
      if (this.hasBeenInteractedWith) return

      if (this.isAutoplay && !this.isPlaying && !this.reduceMotion) {
        this.isPlaying = true
        this.autoplayInterval = setInterval(() => {
          this.goTo('next')
        }, this.autoplayDuration)
      }
    },
    stopAutoplay() {
      this.isPlaying = false
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
      this.stopAutoplay()

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

      if (!direction && !this.hasBeenInteractedWith) {
        this.startAutoplay()
        return
      }

      switch (true) {
        case event.type === 'mouseout' && direction === 'next':
          this.mouseOutNext()
          break
        case event.type === 'mouseout' && direction === 'previous':
          this.mouseOutPrev()
          break
      }
    },
    swipeLeft(ev) {
      this.goTo('next', {})
    },
    swipeRight(ev) {
      this.goTo('previous', {})
    },
    inView() {
      this.setHeight(this.indexCurr)
      this.startAutoplay()
    },
    outOfView() {
      this.stopAutoplay()
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
    position: relative;
    overflow: hidden;
    width: 100%;

    @media screen and (prefers-reduced-motion: no-preference) {
      transition: min-height 300ms ease-in-out;
    }
  }

  &__ui {
    position: absolute;
    height: 100%;
    z-index: 4;
    top: 0;
    padding: 0 1em;
    padding: 0 clamp(1em, 1vw, 2em);

    appearance: none;
    background: 0;
    border: 0;
    outline: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    // svg arrows
    .arrow {
      stroke: var(--foreground);

      @media screen and (prefers-reduced-motion: no-preference) {
        transition: stroke var(--time) var(--ease);
      }
    }

    &.next {
      right: 0;
      cursor: e-resize;

      .arrow {
        position: relative;
        left: 0.1em;
      }

      &:focus-visible .pill {
        background-color: hsla(var(--b-h), var(--b-s), var(--b-l), 100%);
        outline: 4px solid hsla(var(--a-h), var(--a-s), var(--a-l), 100%);
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
        background-color: hsla(var(--b-h), var(--b-s), var(--b-l), 100%);
        outline: 4px solid hsla(var(--a-h), var(--a-s), var(--a-l), 100%);
      }
    }

    .pill {
      pointer-events: none;
      background-color: hsla(var(--b-h), var(--b-s), var(--b-l), 60%);
      outline-offset: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      min-height: 72px;
      // width: clamp(44px, 1vw, 64px);
      padding-top: 1.2em;
      padding-bottom: 1.2em;
      border-radius: 0.75em;
      backdrop-filter: blur(15px);
      margin: 0;

      @media screen and (prefers-reduced-motion: no-preference) {
        transition: background-color 400ms ease-in-out,
          opacity 400ms ease-in-out;
      }

      .arrow {
        width: 35%;
        height: auto;
      }
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

      @media screen and (prefers-reduced-motion: no-preference) {
        transition: mask-position 300ms 100ms ease-in-out;
      }
    }

    &.is-peaking,
    &.trans-to {
      z-index: 2;
      opacity: 1;
      visibility: visible;
    }

    &.trans-from {
      // needed for transition end
      transition: opacity 1ms linear;

      @media screen and (prefers-reduced-motion: no-preference) {
        transition: opacity 400ms var(--ease);
      }
      opacity: 0;
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
      background-color: hsla(var(--b-h), var(--b-s), var(--b-l), 100%);
    }
  }
  &.is-hovered-prev {
    .is-curr {
      mask-position: 0% 100%;
    }

    .prev .pill {
      background-color: hsla(var(--b-h), var(--b-s), var(--b-l), 100%);
    }
  }

  &.hide-ui {
    .pill {
      opacity: 0;
    }
    &:hover .pill,
    &:focus-visible .pill,
    &:focus-within .pill {
      opacity: 1;
    }
  }
}
</style>
