<template>
  <header class="site-header">
    <Grid :xs-columns="2">
      <SiteHeaderLogo style="order:2" />
      <SiteHeaderNavSecondary
        class="nav-secondary"
        :class="{ 'is-hidden': !navIsHidden }"
        @mouseenter.native="showNav"
      />

      <SiteHeaderNavPrimary
        class="nav-primary"
        :class="{ 'is-hidden': navIsHidden }"
      />
    </Grid>
  </header>
</template>

<script>
import SiteHeaderLogo from '~/components/organisms/SiteHeaderLogo.vue'
import SiteHeaderNavPrimary from '~/components/organisms/SiteHeaderNavPrimary.vue'
import SiteHeaderNavSecondary from '~/components/organisms/SiteHeaderNavSecondary.vue'

export default {
  components: {
    SiteHeaderLogo,
    SiteHeaderNavPrimary,
    SiteHeaderNavSecondary
  },
  data() {
    return {
      activeItem: null,
      navIsHidden: false,
      lastY: 0
    }
  },
  mounted() {
    this.$nuxt.$on('window::scrollY', this.scrollHandler)
    this.$nuxt.$on('window::scrollStop', this.scrollStop)
    this.$nuxt.$on('window::scrollUp', this.scrollDirectionChange)
    this.$nuxt.$on('window::scrollDown', this.scrollDirectionChange)
    this.$nuxt.$on('nav::updateActiveItem', this.updateActiveItem)

    this.scrollHandler(0)
  },
  beforeDestroy() {
    this.$nuxt.$off('window::scrollY', this.scrollHandler)
    this.$nuxt.$off('window::scrollStop', this.scrollStop)
    this.$nuxt.$off('window::scrollUp', this.scrollDirectionChange)
    this.$nuxt.$off('window::scrollDown', this.scrollDirectionChange)
    this.$nuxt.$off('nav::updateActiveItem', this.updateActiveItem)
  },
  methods: {
    scrollDirectionChange(y) {
      if (y) this.lastY = Math.round(y)
    },
    scrollStop(y) {
      this.lastY = Math.round(y)
    },
    scrollHandler() {
      if (!window.detectScroll) return
      const y = window.detectScroll.y
      const scrollDiff = this.lastY - y
      const scrollOffset = 50
      const hasScrolledDown = -scrollDiff > 0 && -scrollDiff > scrollOffset
      const hasScrolledUp = scrollDiff > 0 && scrollDiff > scrollOffset
      const nearTop = y < scrollOffset

      if (hasScrolledUp && this.navIsHidden) this.showNav()
      if (hasScrolledDown && !this.navIsHidden) this.hideNav()
      if (nearTop && this.navIsHidden) this.showNav()
    },
    showNav() {
      this.navIsHidden = 0
      console.log('hi')
    },
    hideNav() {
      this.navIsHidden = 1
    },
    updateActiveItem(val) {
      this.activeItem = val
    }
  }
}
</script>

<style lang="scss" scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding-top: 14px;

  .egstad-logo {
    order: 2;
  }

  .nav-primary {
    position: fixed;
    z-index: 1;
    // transform: translate3d(0, 0, 0);
    // transition: transform calc(var(--time) * 0.5) var(--ease);
    opacity: 1;
    transition: opacity calc(var(--time) * 0.5) var(--ease);

    &.is-hidden {
      // transform: translate3d(0, -200%, 0);
      opacity: 0;
    }
  }

  .nav-secondary {
    opacity: 1;
    z-index: 2;
    transition: opacity calc(var(--time) * 0.5) var(--ease);

    &.is-hidden {
      z-index: -1;
      opacity: 0;
    }
  }
}
</style>
