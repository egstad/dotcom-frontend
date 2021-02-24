<template>
  <section class="slices">
    <template v-for="slice in slices">
      <template v-if="slice._type === 'video'">
        <Vid
          :key="slice._key"
          :alt="slice.alt"
          :asset="slice.url"
          :config="slice.settings"
        />
        <!-- <pre :key="'hi' + slice._key">{{ slice.settings }}</pre> -->
      </template>

      <template v-else-if="slice._type === 'picture'">
        <Pic :key="slice._key" :alt="slice.alt" :asset="slice.asset._ref" />
        <pre :key="'hi' + slice._key">{{ slice }}</pre>
      </template>
    </template>
  </section>
</template>

<script>
import Pic from '@/components/atoms/Pic'
import Vid from '@/components/atoms/Vid'

export default {
  components: {
    Pic,
    Vid
  },
  props: {
    slices: {
      type: Array,
      required: true
    }
  }
}
</script>
