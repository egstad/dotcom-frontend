<template>
  <div class="site-wrapper">
    <PrimaryNavigation />

    <main class="site-main">
      <Debug />
      <nuxt />
    </main>
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
  computed: {
    isCursor() {
      return this.$store.state.device.isCursor
    },
    isTouch() {
      return this.$store.state.device.isTouch
    },
    isMobile() {
      return this.$store.state.device.isMobile
    }
  },
  watch: {
    $route(to, from) {
      this.$nuxt.$emit('route::updated')
    },
    isTouch(state) {
      this.toggleDocClass('is-touch', state)
    },
    isCursor(state) {
      this.toggleDocClass('is-cursor', state)
    },
    isMobile(state) {
      this.toggleDocClass('is-mobile', state)
    }
  },
  methods: {
    toggleDocClass(className, valIsTrue) {
      const doc = document.documentElement

      if (valIsTrue) {
        doc.classList.add(className)
      } else {
        doc.classList.remove(className)
      }
    }
  }
  // async middleware({ store, $sanity }) {
  //   await store.dispatch('fetchSiteSettings', $sanity)
  // }
}
</script>

<style lang="scss" scoped>
.site {
  &-main {
    padding: 20vw;
  }
}
</style>
