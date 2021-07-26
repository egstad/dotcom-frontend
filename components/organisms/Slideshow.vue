<template>
  <client-only>
    <div class="slideshow">
      <button
        class="button --next"
        aria-label="Next Slide"
        @click="next"
        @mouseenter="hoverNext = true"
        @mouseout="hoverNext = false"
      >
        N
      </button>
      <button
        class="button --prev"
        aria-label="Previous Slide"
        @click="previous"
        @mouseenter="hoverPrev = true"
        @mouseout="hoverPrev = false"
      >
        P
      </button>

      <Flickity
        ref="gallery"
        class="slideshow__slides"
        :options="options"
        :class="[
          { 'is-hovered-next': hoverNext },
          { 'is-hovered-prev': hoverPrev }
        ]"
      >
        <Pic
          v-for="(slide, index) in slides"
          :key="slide._key"
          ref="slide"
          :alt="slide.alt"
          :asset="slide.asset._ref"
          class="slideshow__slide"
          :class="[
            { 'is-next': index === nextIndex },
            { 'is-prev': index === prevIndex },
            { 'is-selected': index === selectedIndex }
          ]"
        />
      </Flickity>
    </div>
  </client-only>
</template>

<script>
import Pic from '@/components/atoms/Pic'
import Flickity from '~/node_modules/vue-flickity/src/flickity'
if (process.browser) require('flickity-fade')

export default {
  components: {
    Flickity,
    Pic
  },
  props: {
    slides: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      flickity: null,
      selectedIndex: null,
      maxIndex: null,
      nextIndex: null,
      prevIndex: null,
      hoverNext: false,
      hoverPrev: false,
      options: {
        selectedAttraction: 1,
        friction: 1,
        accessibility: true,
        adaptiveHeight: true,
        percentPosition: true,
        resize: true,
        wrapAround: true,
        prevNextButtons: false,
        pageDots: false,
        fade: true,
        on: {
          ready: this.handleIndex,
          change: this.handleIndex
        }
        // autoPlay: 8000,
        // cellAlign: 'left',
        // freeScroll: false,
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.flickity = this.$refs.gallery.$flickity
    })
  },
  beforeDestroy() {
    this.flickity.destroy()
  },
  methods: {
    next() {
      this.$refs.gallery.next()
    },
    previous() {
      this.$refs.gallery.previous()
    },
    handleIndex(index) {
      this.maxIndex = this.$refs.slide.length - 1
      this.selectedIndex = index || 0
      this.setPrevIndex(this.selectedIndex)
      this.setNextIndex(this.selectedIndex)
    },
    setNextIndex(index) {
      this.nextIndex = index < this.maxIndex ? index + 1 : 0
    },
    setPrevIndex(index) {
      this.prevIndex = index === 0 ? this.maxIndex : index - 1
    }
  }
}
</script>

<style lang="scss" scoped>
.slideshow {
  position: relative;
  margin-top: 20vw;

  .button {
    position: absolute;
    top: 0;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    // flex: 1 auto;
    height: 100%;
    appearance: none;
    background: 0;
    border: 0;
    cursor: pointer;
    min-width: 44px;
    width: clamp(44px, 20%, 96px);

    &.--prev {
      left: 0;
      order: 1;
    }

    &.--next {
      right: 0;
      order: 2;
    }
  }

  .is-selected {
    z-index: 1;
    transition: mask-position 400ms ease-in-out;
    mask-size: 200% 100%;
    mask-position: 50% 0%;
    mask-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 15%,
      rgba(0, 0, 0, 1) 85%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .is-hovered-next {
    .is-selected {
      z-index: 1;
      mask-position: 100% 0%;
    }

    .is-next {
      opacity: 0.7 !important;
    }
  }
  .is-hovered-prev {
    .is-selected {
      z-index: 1;
      mask-position: 0% 0%;
    }

    .is-prev {
      opacity: 0.7 !important;
    }

    .is-next {
      z-index: -1;
    }
  }
}
</style>
