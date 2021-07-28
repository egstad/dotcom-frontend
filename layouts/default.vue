<template>
  <div class="site-wrapper">
    <SiteHeader />

    <div class="site-content" :style="mainStyle">
      <main class="site-main">
        <nuxt />
      </main>

      <SiteFooter />
    </div>

    <!-- <Debug /> -->
    <!-- <Scrim /> -->
  </div>
</template>

<script>
import SiteHeader from '@/components/organisms/site-header/SiteHeader'
import SiteFooter from '@/components/organisms/site-footer/SiteFooter'

// import Debug from '@/components/templates/Debug'
// import Scrim from '@/components/templates/Scrim'

export default {
  components: {
    SiteHeader,
    SiteFooter
    // Debug
    // Scrim
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
    },
    winHeight() {
      return this.$store.state.device.winHeight
    },
    mainStyle() {
      return {
        minHeight: `${this.winHeight}px`
      }
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
  // mounted() {
  //   this.$nuxt.$on('route::updated', this.handlePageRoutes)
  //   this.$nuxt.$on('page::mounted', this.handlePageMounts)
  // },
  methods: {
    // handlePageRoutes() {
    //   // fires just before routing to new page
    //   this.$store.commit('showScrim', 'true')
    // },
    // handlePageMounts() {
    //   // fires just after route has completed + page has loaded
    //   this.$store.commit('showScrim', 'false')
    // },
    toggleDocClass(className, valIsTrue) {
      const doc = document.documentElement

      if (valIsTrue) {
        doc.classList.add(className)
      } else {
        doc.classList.remove(className)
      }
    }
  }
  // this was from the @nuxtjs/sanity package days...
  // maybe it'll come in handy tho?
  // async middleware({ store, $sanity }) {
  //   await store.dispatch('fetchSiteSettings', $sanity)
  // }
}
</script>

<style lang="scss" scoped>
.site {
  &-content {
    display: flex;
    flex-direction: column;
  }
  &-main {
    flex: 1 0 auto;
  }
}
</style>
