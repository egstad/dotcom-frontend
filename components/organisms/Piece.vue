<template>
  <Grid tag="article" class="piece" v-bind="gridProps">
    <Column v-bind="colProps">
      <div class="piece__content" :class="{ 'is-visible': inView }">
        <header class="piece__header" :class="headerClasses">
          <Type tag="h2" :size="1" class="piece__title">
            <span>{{ title }}</span>
          </Type>
        </header>

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
      </div>
    </Column>
  </Grid>
</template>

<script>
import Pic from '@/components/atoms/Pic'
import Vid from '@/components/atoms/Vid'
import Slideshow from '@/components/organisms/SlideshowNew'

export default {
  components: {
    Slideshow,
    Pic,
    Vid
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

<style lang="scss">
$captionHeight: 16px;

.piece {
  position: relative;

  &__content {
    display: flex;
    flex-direction: column;
    transition: opacity 500ms 250ms ease-in-out, transform 700ms ease-in-out;
    transform: translate3d(0, 5vw, 0);
    // opacity: 0;

    // &.is-visible {
    //   opacity: 1;
    //   transform: translate3d(0, 0, 0);
    // }
  }

  &__header {
    order: 2;
  }

  &__title {
    display: flex;
    justify-content: space-between;
    min-height: $captionHeight;
    line-height: $captionHeight !important;

    @include bp($xl) {
      min-height: calc-vw($captionHeight, $xl);
      line-height: calc-vw($captionHeight, $xl) !important;
    }

    span {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-left: 1em;
      text-align: right;
    }

    &::before {
      content: counters(piece, '.', decimal-leading-zero);
    }
  }
}
</style>
