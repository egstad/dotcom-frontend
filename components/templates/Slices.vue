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
        />
        <!-- <pre :key="slice._key">{{ slice }}</pre> -->
      </template>

      <template v-else-if="slice._type === 'picture'">
        <Pic :key="slice._key" :alt="slice.alt" :asset="slice.asset._ref" />
        <!-- <pre :key="slice._key">{{ slice }}</pre> -->
      </template>

      <template v-else-if="slice._type === 'themeScroller'">
        <Theme
          :key="slice._key"
          :colors="slice.theme"
          :fade-target="slice.target ? slice.target : 'middle'"
        />
        <!-- <pre :key="'pre-' + slice._key">{{ slice }}</pre> -->
      </template>

      <template v-else-if="slice._type === 'richText'">
        <Copy :key="slice._key" :blocks="slice.content" />
      </template>
    </template>
  </div>
</template>

<script>
import Pic from '@/components/atoms/Pic'
import Vid from '@/components/atoms/Vid'
import Theme from '@/components/atoms/Theme'
import Copy from '@/components/atoms/Copy/Copy'

export default {
  components: {
    Pic,
    Vid,
    Theme,
    Copy
  },
  props: {
    slices: {
      type: Array,
      required: true
    }
  }
}
</script>
