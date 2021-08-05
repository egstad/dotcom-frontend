<template>
  <section class="piece">
    <article class="piece__content" :class="[size, { 'is-visible': inView }]">
      <div class="piece__info t-1" :class="headerClasses">
        <div class="col-1">
          <header class="header">
            <h2 class="piece__title">{{ title }}</h2>
          </header>
          <Copy v-if="credits" :blocks="credits" class="piece__credits" />
        </div>
        <div class="col-2">
          <time v-if="date" :datetime="date" class="piece__date t-mono">{{
            date.substring(0, 4)
          }}</time>
        </div>
      </div>

      <template v-for="slice in [content]">
        <template v-if="slice._type === 'video'">
          <Vid
            :key="slice._key"
            :alt="slice.alt"
            :asset="slice.url"
            :poster="slice.poster"
            :config="slice.settings"
            :palette="slice.paletteVideo"
          />
          <!-- <pre :key="slice._key">{{ content }}</pre> -->
        </template>

        <template v-else-if="slice._type === 'picture'">
          <Pic
            :key="slice._key"
            :alt="slice.alt"
            :asset="slice.asset._ref"
            :palette="slice.paletteImage"
          />
          <!-- <pre :key="slice._key + 'pre'">{{ slice.paletteImage }}</pre> -->
        </template>

        <template v-else-if="slice._type === 'slideshow'">
          <Slideshow
            :key="slice._key"
            :content="slice.slides"
            :options="slice.options"
          />
          <!-- <pre :key="'pre-' + slice._key">{{ slice.options }}</pre> -->
        </template>
      </template>
    </article>
  </section>
</template>

<script>
import Pic from '@/components/atoms/Pic'
import Vid from '@/components/atoms/Vid'
import Copy from '@/components/atoms/Copy/Copy'
import Slideshow from '@/components/organisms/SlideshowNew'

export default {
  components: {
    Slideshow,
    Pic,
    Vid,
    Copy
  },
  props: {
    piece: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      inView: false
    }
  },
  computed: {
    size() {
      return this.piece.size
    },
    content() {
      return this.piece.content
    },
    title() {
      return this.piece.titleOverride
        ? this.piece.titleOverride
        : this.piece.title
    },
    credits() {
      return this.piece.credits
    },
    colProps() {
      switch (this.size) {
        case 'small':
          return {
            sm: 8,
            xl: 6,
            xx: 4
          }
        case 'medium':
          return {
            sm: 8,
            xl: 7,
            xx: 6
          }
        case 'large':
          return {
            sm: 10,
            xl: 9,
            xx: 8
          }
        case 'xlarge':
          return {
            sm: 12,
            xl: 11,
            xx: 10
          }
        case 'full':
          return {
            padding: false
          }
        default:
          break
      }

      return null
    },
    gridProps() {
      return this.size === 'full' ? { padding: false } : null
    },
    headerClasses() {
      return this.size === 'full' ? 'padded' : null
    },
    date() {
      return this.piece.date
    }
  },
  methods: {
    handleInView(ev) {
      this.inView = true
    },
    handleOutOfView() {
      this.inView = false
    }
  }
}
</script>

<style lang="scss" scoped>
$captionHeight: 21px;

.piece {
  position: relative;
  display: flex;
  padding-top: $captionHeight;
  padding-left: calc(var(--button-click-offset) * 0.5);
  padding-right: calc(var(--button-click-offset) * 0.5);
  border-bottom: 1px solid var(--foreground);

  @include bp($xl) {
    margin-bottom: calc-vw($captionHeight, $xl);
  }

  &__content {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 200vmin;

    // @include bp($xl) {
    //   padding-left: calc-vw($captionHeight, $xl);
    //   padding-right: calc-vw($captionHeight, $xl) !important;
    // }

    // &.small {
    //   width: 85%;

    //   @include bp($sm) {
    //     width: 70%;
    //   }

    //   @include bp($md) {
    //     width: 60%;
    //   }

    //   @include bp($lg) {
    //     width: 50%;
    //   }

    //   @include bp($xx) {
    //     width: 40%;
    //     max-width: 60vmin;
    //   }
    // }

    // &.medium {
    //   width: 85%;

    //   @include bp($sm) {
    //     width: 80%;
    //   }

    //   @include bp($md) {
    //     width: 70%;
    //   }

    //   @include bp($lg) {
    //     width: 65%;
    //   }

    //   @include bp($xx) {
    //     width: 55%;
    //   }
    // }

    // &.large {
    //   width: 100%;

    //   @include bp($sm) {
    //     width: 90%;
    //   }

    //   @include bp($md) {
    //     width: 80%;
    //   }

    //   @include bp($lg) {
    //     width: 75%;
    //   }

    //   @include bp($xx) {
    //     width: 70%;
    //   }
    // }

    // &.xlarge {
    //   width: 100%;

    //   @include bp($md) {
    //     width: 90%;
    //   }

    //   @include bp($xx) {
    //     width: 85%;
    //   }
    // }

    // &.full {
    //   width: 100%;
    //   max-width: none;
    //   padding-left: 0;
    //   padding-right: 0;
    // }
  }

  &__info {
    /* Positioning */
    display: flex;
    align-content: center;
    order: 2;
    margin-top: 0.1em;
    height: $captionHeight;
    // line-height: $captionHeight;

    @include bp($xx) {
      height: calc-vw($captionHeight, $xx);
    }

    /* Display & Box Model */
    display: grid;
    grid-template-columns: auto 1fr auto; // number, caption, date

    /* Text */
    font-variation-settings: 'wght' 600;

    // caption and date columns
    > * {
      display: flex;
      align-items: baseline;
    }

    // title & credits
    .col-1 {
      justify-self: center;
    }

    // .piece__title{}
    // .piece__credits{}
    // .piece__date{}

    // strip default styles
    ::v-deep p {
      margin-bottom: 0;
      font-variation-settings: 'wght' 350;

      &:before {
        content: '•';
        margin-left: 0.5em;
        margin-right: 0.5em;
      }
    }

    // counter
    &::before {
      @extend .t-mono;
      content: counters(piece, '.', decimal-leading-zero);
    }

    &::before,
    .piece__date {
      font-variation-settings: 'wght' 350, 'MONO' 1000;
      letter-spacing: 0;
    }
  }

  // &__title {
  //   display: flex;
  //   justify-content: space-between;
  //   min-height: $captionHeight;
  //   line-height: $captionHeight !important;

  //   @include bp($xl) {
  //     min-height: calc-vw($captionHeight, $xl);
  //     line-height: calc-vw($captionHeight, $xl) !important;
  //   }

  //   span {
  //     width: 100%;
  //     white-space: nowrap;
  //     overflow: hidden;
  //     text-overflow: ellipsis;
  //     padding-left: 1em;
  //     text-align: right;
  //   }

  //
  // }
}
</style>
