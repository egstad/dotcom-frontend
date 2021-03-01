<template>
  <div>
    <PrimaryNavigation />
    <nuxt />
  </div>
</template>

<script>
import PrimaryNavigation from '@/components/organisms/PrimaryNavigation'

export default {
  components: {
    PrimaryNavigation
  },
  watch: {
    // fired when route changes
    $route(to, from) {
      // tell plugins to teardown/restart
      this.$nuxt.$emit('route::updated')
    }
  }
  // async middleware({ store, $sanity }) {
  //   await store.dispatch('fetchSiteSettings', $sanity)
  // }
}
</script>
