<template>
  <div>
    <template v-for="slice in slices">
      <template v-if="slice._type === 'video'">
        <Vid
          :key="slice._key"
          :alt="slice.alt"
          :asset="slice.url"
          :poster="slice.poster"
          :config="slice.settings"
          :palette="slice.paletteVideo"
        />
        <!-- <pre :key="slice._key">{{ slice }}</pre> -->
      </template>

      <template v-else-if="slice._type === 'picture'">
        <!-- <pre :key="slice._key + 'hi'">{{ slice.paletteImage }}</pre> -->
        <Pic
          :key="slice._key"
          :alt="slice.alt"
          :asset="slice.asset._ref"
          :palette="slice.paletteImage"
        />
      </template>

      <template v-else-if="slice._type === 'themeScroller'">
        <Theme
          :key="slice._key"
          :colors="slice.theme"
          :fade-target="slice.target"
        />
        <!-- <pre :key="'pre-' + slice._key">{{ slice }}</pre> -->
      </template>

      <template v-else-if="slice._type === 'slideshow'">
        <Slideshow
          :key="slice._key"
          :content="slice.slides"
          :options="slice.options"
        />
        <!-- <pre :key="'pre-' + slice._key">{{ slice.options }}</pre> -->
      </template>

      <template v-else-if="slice._type === 'richText'">
        <Copy :key="slice._key" :blocks="slice.text" />
        <!-- <pre :key="slice._key + 'h'">{{ slice.text }}</pre> -->
      </template>
    </template>
  </div>
</template>

<script>
import Pic from '@/components/atoms/Pic'
import Vid from '@/components/atoms/Vid'
import Theme from '@/components/atoms/Theme'
import Copy from '@/components/organisms/Copy'
import Slideshow from '@/components/organisms/SlideshowNew'

export default {
  components: {
    Pic,
    Vid,
    Theme,
    Copy,
    Slideshow
  },
  props: {
    slices: {
      type: Array,
      required: true
    }
  }
}
</script>
