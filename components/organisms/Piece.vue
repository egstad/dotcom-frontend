<template>
  <li class="piece" :class="[size]">
    <article class="piece__wrapper">
      <header class="piece__info t-1" :class="[{ 'small-header': !padding }]">
        <Copy
          v-if="titleOverride"
          :blocks="titleOverride"
          class="piece__title --alt"
        />
        <h2 v-else class="piece__title">{{ title }}</h2>

        <time v-if="date" :datetime="date" class="piece__date">{{
          date.substring(0, 4)
        }}</time>
      </header>

      <div
        v-animate.once
        class="piece__content"
        :class="[size, padding, { 'is-visible': inView }]"
      >
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

          <template v-else-if="slice._type === 'svg'">
            <PicSVG :key="'svg-' + slice._key" :data="slice.document" />
            <!-- <pre :key="'pre-' + slice._key">{{ slice }}</pre> -->
          </template>
        </template>
      </div>
    </article>
  </li>
</template>

<script>
import Pic from '@/components/atoms/Pic'
import PicSVG from '@/components/atoms/PicSVG'
import Vid from '@/components/atoms/Vid'
import Copy from '@/components/organisms/Copy'
import Slideshow from '@/components/organisms/SlideshowNew'

export default {
  components: {
    Slideshow,
    Pic,
    Vid,
    Copy,
    PicSVG
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
      return this.piece.title
    },
    titleOverride() {
      return this.piece.titleOverride
    },
    padding() {
      return this.size !== 'full' ? 'padded' : null
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
$paddingTopBottom: clamp(var(--button-click-offset), 10vw, 72px);

.piece {
  /* Positioning */
  position: relative;

  /* Display & Box Model */
  display: flex;
  flex-direction: column;
  align-items: center;

  // space the full sized items out if they are siblings
  &.piece + .full {
    margin-top: var(--button-click-offset);
  }

  // &:not(.full).no-border {
  //   margin-bottom: var(--button-click-offset);
  //   // margin-top: 0;

  //   // .piece__info {
  //   //   border: 0;
  //   // }
  // }

  // space the full sized items out if they are siblings
  // &.full + .piece.full {
  //   margin-top: $paddingTopBottom;
  // }
}

.piece__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
}

.piece__content {
  width: 100%;
  max-width: 200vmin;

  @include transition {
    opacity: 0;
    transition: transform 600ms var(--ease-back),
      opacity 500ms 100ms var(--ease);

    &.is-here {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }

    &.is-above {
      transform: translate3d(0, -8vmax, 0);
    }

    &.is-below {
      transform: translate3d(0, 8vmax, 0);
    }
  }

  &.padded {
    padding-top: $paddingTopBottom;

    // ::v-deep .pic--svg svg {
    :deep(.pic--svg svg) {
      padding-left: var(--button-click-offset);
      padding-right: var(--button-click-offset);
    }

    @include bp($md) {
      padding-left: var(--button-click-offset);
      padding-right: var(--button-click-offset);
    }
  }

  &.small {
    width: 70vw;

    @include bp($md) {
      min-width: min(250px, 40vmax);
      width: 40vw;
      max-width: min(1024px, 60vh);
    }

    @include bp(800px, max-height) {
      max-width: 500px;
    }
  }

  &.medium {
    @include bp($md) {
      min-width: min(250px, 60vmax);
      width: 60vw;
      max-width: 1024px * 1.25;
    }
  }

  &.large {
    @include bp($md) {
      min-width: min(250px, 80vmax);
      width: 80vw;
      max-width: 1024px * 1.5;
    }
  }

  &.xlarge {
    @include bp($md) {
      min-width: min(250px, 90vmax);
      width: 90vw;
      max-width: 1024px * 1.75;
    }
  }

  &.full {
    width: 100%;
    max-width: none;
  }
}

.piece__info {
  /* Display & Box Model */
  width: 100%;
  display: grid;
  order: 2;
  border-bottom: 1px solid var(--foreground);
  width: 100%;
  // padding-left: var(--button-click-offset);
  // padding-right: var(--button-click-offset);
  width: calc(100% - var(--button-click-offset) * 2);

  @media (prefers-color-scheme: dark) {
    border-bottom: 1px solid hsla(var(--f-h), var(--f-s), var(--f-l), 40%);
  }

  // small bp
  padding-top: $paddingTopBottom;
  grid-template-columns: 1fr; // caption, date
  align-items: baseline;

  @include bp($lg) {
    padding: 0;
    // width: calc(100% - var(--button-click-offset) * 2);
    grid-template-columns: 10vw 1fr 10vw; // number, caption, date
    align-items: flex-end;
    height: $paddingTopBottom;
  }

  // full sized pieces get small headers
  &.small-header {
    height: auto;
    padding-top: 0;
  }

  // caption and date columns
  > *,
  &::before {
    position: relative;
    top: 0.08em;
    display: flex;
    align-items: flex-end;
    font-variation-settings: 'wght' 600;
    padding: 0.5em 0;
  }

  // strip default styles
  // ::v-deep p {
  :deep(p) {
    margin-bottom: 0;
  }

  // ::v-deep a {
  :deep(a) {
    text-decoration: none;
  }

  .piece__title,
  // ::v-deep .piece__title {
  :deep(.piece__title) {
    width: 100%;
    font-family: var(--sans);

    @include bp($lg) {
      padding-right: 0;
      text-align: center;
      justify-content: center;
    }

    > h2,
    > p {
      width: 100%;

      em {
        color: hsl(var(--f-h), var(--f-s), var(--f-l), 50%);
      }

      a {
        font-variation-settings: 'wght' 600;
      }
    }
  }

  // place the counter inline for mobile devices
  // ::v-deep .piece__title.--alt > *,
  :deep(.piece__title.--alt > *),
  .piece__title:not(.--alt) {
    &::before {
      font-variation-settings: 'wght' 350;
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.055em;

      @include bp($lg, max-width) {
        content: counters(piece, '.', decimal-leading-zero);
        margin-right: 1em;
      }
    }
  }

  // on larger screens, position the counter in left column
  &::before {
    content: counters(piece, '.', decimal-leading-zero);
    display: none;

    @include bp($lg) {
      display: flex;
    }
  }

  // numbers should be monospaced, thank yew
  &::before,
  .piece__date {
    font-variation-settings: 'wght' 350;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.055em;
  }

  .piece__date {
    justify-self: flex-end;
    display: none;

    @include bp($lg) {
      display: block;
      align-self: flex-end;
    }
  }
}
</style>
