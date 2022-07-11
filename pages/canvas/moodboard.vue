<template>
  <Uploader />
</template>

<script>
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'
import Uploader from '@/components/organisms/canvas/BlockMoodboardFileUploader.vue'

export default {
  components: {
    Uploader
  },
  mixins: [routeTransitionFade],
  async asyncData({ store }) {
    await store.commit('setCSSVars', 'dark')

    return {
      theme: 'dark'
    }
  }
}
</script>
