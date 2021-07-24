<template>
  <div ref="slideshow" class="slideshow" tabindex="0">
    <div
      v-for="i in 21"
      :key="i"
      ref="slide"
      class="slideshow__slide"
      :style="{ backgroundColor: randomColor() }"
    >
      {{ i }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flickityInstance: null
    }
  },
  async mounted() {
    await this.initiateCarousel()
  },
  beforeDestroy() {
    this.flickityInstance.destroy()
  },
  methods: {
    randomColor() {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`
    },
    async initiateCarousel() {
      if (process.client) {
        const slideshow = this.$refs.slideshow
        // const slides = this.$refs.slide

        // eslint-disable-next-line
        // const { default: Flickity } = await import('Flickity')
        const { default: FlickityFade } = await import('flickity-fade')

        this.flickityInstance = new FlickityFade(slideshow, {
          accessibility: true,
          adaptiveHeight: true,
          autoPlay: 8000,
          cellAlign: 'left',
          freeScroll: false,
          percentPosition: true,
          resize: true,
          wrapAround: true,
          pageDots: false,
          fade: true
        })

        // https://flickity.metafizzy.co/events.html
        // this.flickityInstance.on('change', this.onReady)
        // this.flickityInstance.on('change', this.onChange)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$size: 60%;

.border,
hr {
  border: 0;
  border-top: 1px solid #000;
  height: 0;
}
.spacer {
  margin-top: 10vw;
}

.slideshow {
  width: 33vw;
  background: pink;

  &__slide {
    background: skyblue;
    height: 33vw;
    width: 33vw;

    transition: mask-position 200ms ease-in-out;
    mask-size: 200% 100%;
    mask-position: 50% 0%;
    mask-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  &:hover .slideshow__slide {
    // next
    mask-position: 100% 0%;

    // prev
    // mask-position: 0% 0%;
  }
}

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

::v-deep .flickity-enabled.is-fade .flickity-slider > * {
  pointer-events: none;
  z-index: 0;
}

::v-deep .flickity-enabled.is-fade .flickity-slider > .is-selected {
  pointer-events: auto;
  z-index: 1;
}
</style>
