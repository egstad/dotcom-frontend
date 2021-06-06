<template>
  <div class="site-wrapper">
    <PrimaryNavigation />
    <Debug />
    <nuxt />
  </div>
</template>

<script>
import PrimaryNavigation from '@/components/organisms/PrimaryNavigation'
import Debug from '@/components/templates/Debug'

export default {
  components: {
    PrimaryNavigation,
    Debug
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
