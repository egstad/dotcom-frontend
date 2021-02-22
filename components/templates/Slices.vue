<template>
  <section class="slices">
    <template v-for="slice in slices">
      <template v-if="slice._type === 'video'">
        <Vid
          :key="slice._key"
          :alt="slice.alt"
          :url="slice.url"
          :config="slice.settings"
        />
      </template>
    </template>
  </section>
</template>

<script>
import Vid from '@/components/atoms/Vid'

export default {
  components: {
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
