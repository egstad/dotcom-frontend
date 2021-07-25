<template>
  <div class="slideshow">
    <div ref="slideshow" class="slideshow__content" tabindex="0">
      <div v-for="slide in slides" :key="slide._key" ref="slide">
        <Pic :alt="slide.alt" :asset="slide.asset._ref" @load="onSlideLoad" />
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import FlickityImagesLoaded from 'flickity-imagesloaded'

import Pic from '@/components/atoms/Pic'

export default {
  components: {
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
      flickityInstance: null,
      selectedIndex: null,
      maxIndex: null,
      nextIndex: null,
      prevIndex: null
    }
  },
  async mounted() {
    await this.initiateCarousel()
  },
  beforeDestroy() {
    this.flickityInstance.destroy()
    this.flickityInstance.off('change', this.onChange)
  },
  methods: {
    randomColor() {
      return `${Math.floor(Math.random() * 16777215).toString(16)}`
    },
    onSlideLoad() {
      console.log('slide loaded')
    },
    updateHeight() {},
    async initiateCarousel() {
      if (process.client) {
        const slideshow = this.$refs.slideshow
        this.maxIndex = this.$refs.slide.length - 1
        // const slides = this.$refs.slide

        const { default: FlickityImagesLoaded } = await import(
          'flickity-imagesloaded'
        )

        const { default: Flickity } = await import('Flickity')
        // const { default: FlickityFade } = await import('flickity-fade')

        this.flickityInstance = new Flickity(slideshow, {
          accessibility: true,
          adaptiveHeight: true,
          // autoPlay: 8000,
          cellAlign: 'left',
          freeScroll: false,
          percentPosition: true,
          resize: true,
          wrapAround: true,
          imagesLoaded: true,
          // prevNextButtons: false,
          lazyLoad: true,
          pageDots: false,
          fade: true,
          on: {
            ready: this.onReady,
            change: this.onChange
          }
        })
      }
    },
    onChange(index) {
      this.handleIndex(index)
      this.updateHeight()
    },
    onReady() {
      this.handleIndex(0)
    },
    handleIndex(index) {
      this.selectedIndex = index
      this.setPrevIndex(index)
      this.setNextIndex(index)
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
$size: 60%;

// .slideshow {
//   position: relative;

//   &__content {
//     width: 33vw;
//     display: none;

//     &.flickity-enabled {
//       display: block;
//       position: relative;
//     }

//     &:hover .slideshow__slide {
//       &.is-selected {
//         z-index: 1;
//         // next
//         mask-position: 100% 0%;

//         // prev
//         // mask-position: 0% 0%;
//       }
//     }

//     .slideshow__slide {
//       z-index: 0;
//       height: 33vw;
//       width: 33vw;

//       &.is-selected {
//         z-index: 1;
//         transition: mask-position 200ms ease-in-out;
//         mask-size: 200% 100%;
//         mask-position: 50% 0%;
//         mask-image: linear-gradient(
//           to right,
//           rgba(0, 0, 0, 0) 0%,
//           rgba(0, 0, 0, 1) 25%,
//           rgba(0, 0, 0, 1) 75%,
//           rgba(0, 0, 0, 0) 100%
//         );
//       }

//       &.is-next {
//         opacity: 1 !important;
//       }
//     }
//   }

//   img {
//     max-width: 100%;
//     display: block;
//   }

//   &__nav {
//     display: flex;
//     position: absolute;
//     top: 0;
//     left: 0;
//     height: 100%;
//     width: 100%;
//     z-index: 2;

//     &-button {
//       height: 100%;
//       width: 50%;
//     }
//   }
// }

::v-deep.flickity-enabled {
  position: relative;
}

::v-deep.flickity-viewport {
  overflow: hidden;
  position: relative;
  height: 100%;
}

::v-deep.flickity-slider {
  position: absolute;
  width: 100%;
  height: 100%;
}

/* draggable */

::v-deep.flickity-enabled.is-draggable {
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

::v-deep.flickity-enabled.is-draggable .flickity-viewport {
  cursor: move;
  cursor: -webkit-grab;
  cursor: grab;
}

::v-deep.flickity-enabled.is-draggable .flickity-viewport.is-pointer-down {
  cursor: -webkit-grabbing;
  cursor: grabbing;
}

/* ---- flickity-button ---- */

::v-deep .flickity-button {
  position: absolute;
  background: hsla(0, 0%, 100%, 0.75);
  border: none;
  color: #333;
  top: 50%;
}

::v-deep .flickity-button:hover {
  background: white;
  cursor: pointer;
}

::v-deep .flickity-button:focus {
  // outline: none;
  box-shadow: 0 0 0 5px #19f;
}

::v-deep .flickity-button:active {
  opacity: 0.6;
}

::v-deep .flickity-button:disabled {
  opacity: 0.3;
  cursor: auto;
  /* prevent disabled button from capturing pointer up event. #716 */
  pointer-events: none;
}

::v-deep .flickity-button-icon {
  fill: currentColor;
}

/* ---- previous/next buttons ---- */

::v-deep .flickity-prev-next-button {
  top: 50%;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  /* vertically center */
  transform: translateY(-50%);
}

::v-deep .flickity-prev-next-button.previous {
  left: 10px;
}
::v-deep .flickity-prev-next-button.next {
  right: 10px;
}
/* right to left */
::v-deep .flickity-rtl .flickity-prev-next-button.previous {
  left: auto;
  right: 10px;
}
::v-deep .flickity-rtl .flickity-prev-next-button.next {
  right: auto;
  left: 10px;
}

::v-deep .flickity-prev-next-button .flickity-button-icon {
  display: none;
  position: absolute;
  left: 20%;
  top: 20%;
  width: 60%;
  height: 60%;
}

/* ---- page dots ---- */

// ::v-deep .flickity-page-dots {
//   position: absolute;
//   width: 100%;
//   bottom: -25px;
//   padding: 0;
//   margin: 0;
//   list-style: none;
//   text-align: center;
//   line-height: 1;
// }

// ::v-deep .flickity-rtl .flickity-page-dots {
//   direction: rtl;
// }

// ::v-deep .flickity-page-dots .dot {
//   display: inline-block;
//   width: 10px;
//   height: 10px;
//   margin: 0 8px;
//   background: #333;
//   border-radius: 50%;
//   opacity: 0.25;
//   cursor: pointer;
// }

// ::v-deep .flickity-page-dots .dot.is-selected {
//   opacity: 1;
// }

/* flickity-fade */

::v-deep .flickity-enabled.is-fade .flickity-slider .slideshow {
  pointer-events: none;
  z-index: 0;
}

::v-deep .flickity-enabled.is-fade .flickity-slider > .is-selected {
  pointer-events: auto;
  z-index: 1;
}
</style>
