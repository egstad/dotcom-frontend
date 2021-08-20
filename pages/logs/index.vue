<template>
  <div></div>
</template>

<script>
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'

export default {
  mixins: [routeTransitionFade],
  async asyncData({ $sanityClient, store }) {
    // set theme
    await store.commit('setCSSVars', 'dark')
  },
  mounted() {
    this.$nuxt.$emit('page::mounted')
  }
}
</script>

<style lang="scss">
div {
  font-family: var(--mono), monospace;
}
</style>
