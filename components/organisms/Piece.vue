<template>
  <article class="piece">
    <div class="piece__info t-1" :class="[{ 'small-header': !padding }]">
      <Copy
        v-if="titleOverride"
        :blocks="titleOverride"
        class="piece__credits"
      />
      <h2 v-else class="piece__title">{{ title }}</h2>

      <time v-if="date" :datetime="date" class="piece__date t-mono">{{
        date.substring(0, 4)
      }}</time>
    </div>

    <div
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
      </template>
    </div>
  </article>
</template>

<script>
import Pic from '@/components/atoms/Pic'
import Vid from '@/components/atoms/Vid'
import Copy from '@/components/organisms/Copy'
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
$captionHeight: 21px;
$paddingTopBottom: clamp(var(--button-click-offset), 10vw, 96px);

.piece {
  /* Positioning */
  position: relative;

  /* Display & Box Model */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.piece__content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 200vmin;

  &.padded {
    padding-left: var(--button-click-offset);
    padding-right: var(--button-click-offset);
    padding-top: $paddingTopBottom;
  }

  &.small {
    width: 80vw;

    @include bp($md) {
      min-width: min(250px, 40vmax);
      width: 50vw;
      max-width: min(1024px, 50vh);
    }
  }

  &.medium {
    @include bp($md) {
      min-width: min(250px, 70vmax);
      width: 70vw;
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
  width: calc(100% - var(--button-click-offset) * 2);

  // small bp
  padding-top: $paddingTopBottom;
  grid-template-columns: 1fr auto; // caption, date
  align-items: baseline;

  @include bp($lg) {
    padding-top: 0;
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
    padding: 0.25em 0;
  }

  // strip default styles
  ::v-deep p {
    margin-bottom: 0;
  }

  ::v-deep a {
    text-decoration: none;
  }

  .piece__title,
  ::v-deep .piece__credits {
    width: 100%;
    padding-right: 3em;

    @include bp($lg) {
      padding-right: 0;
      text-align: center;
      justify-content: center;
    }

    > * {
      width: 100%;
    }
  }

  // counter
  &::before {
    @extend .t-mono;
    content: counters(piece, '.', decimal-leading-zero);
    display: none;

    @include bp($lg) {
      display: flex;
    }
  }

  &::before,
  .piece__date {
    font-variation-settings: 'wght' 350, 'MONO' 1000;
    letter-spacing: 0;
  }

  .piece__date {
    // align-self: baseline;
    justify-self: flex-end;

    @include bp($lg) {
      align-self: flex-end;
    }
  }
}
</style>
