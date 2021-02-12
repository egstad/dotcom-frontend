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
  async middleware({ store, $sanity }) {
    await store.dispatch('fetchSiteSettings', $sanity)
  }
}
</script>
