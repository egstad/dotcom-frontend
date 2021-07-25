<template>
  <client-only>
    <div class="slideshow">
      <nav class="slideshow__ui">
        <button
          class="button --next"
          aria-label="Next Slide"
          @click="next"
          @mouseenter="onMouseEnter('next')"
          @mouseout="onMouseOut('next')"
        >
          N
        </button>
        <button
          class="button --prev"
          aria-label="Previous Slide"
          @click="previous"
          @mouseenter="onMouseEnter('previous')"
          @mouseout="onMouseOut('previous')"
        >
          P
        </button>
      </nav>

      <Flickity ref="gallery" class="slideshow__slides" :options="options">
        <Pic
          v-for="slide in slides"
          :key="slide._key"
          ref="slide"
          :alt="slide.alt"
          :asset="slide.asset._ref"
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
      observer: null,
      observerOptions: null,
      flickity: null,
      options: {
        selectedAttraction: 1,
        friction: 1,
        accessibility: true,
        adaptiveHeight: true,
        percentPosition: true,
        resize: true,
        wrapAround: true,
        pageDots: false,
        fade: true
        // autoPlay: 8000,
        // cellAlign: 'left',
        // freeScroll: false,
        // prevNextButtons: false,
      }
    }
  },
  mounted() {
    this.$nextTick(() => (this.flickity = this.$refs.gallery.$flickity))
  },
  methods: {
    next() {
      this.$refs.gallery.next()
    },
    previous() {
      this.$refs.gallery.previous()
    },
    onMouseEnter(hoveredOn) {
      if (hoveredOn === 'next') {
        this.flickity.viewport.classList.add('is-hovered-next')
      } else if (hoveredOn === 'previous') {
        this.flickity.viewport.classList.add('is-hovered-prev')
      }
    },
    onMouseOut(mouseAwayFrom) {
      if (mouseAwayFrom === 'next') {
        this.flickity.viewport.classList.remove('is-hovered-next')
      } else if (mouseAwayFrom === 'previous') {
        this.flickity.viewport.classList.remove('is-hovered-prev')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.slideshow {
  position: relative;
  margin-top: 20vw;

  &__ui {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;

    .button {
      flex: 1 1;
      height: 100%;
      appearance: none;
      background: 0;
      border: 0;

      &.--prev {
        order: 1;
      }

      &.--next {
        order: 2;
      }
    }
  }
}
</style>
