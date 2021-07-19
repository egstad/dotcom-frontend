<template>
  <Grid
    tag="header"
    class="site-header"
    :class="{ navIsHidden }"
    @mouseenter.native="showNav"
  >
    <Column class="header-nav__wrap" :md="6">
      <SiteHeaderLogo />
      <SiteHeaderNavPrimary class="shy" />
    </Column>
    <Column :md="6" class="hide-mobile">
      <SiteHeaderMeta class="shy" />
    </Column>

    <!-- <SiteHeaderBackground :hidden="navIsHidden" /> -->
  </Grid>
</template>

<script>
import SiteHeaderLogo from '~/components/organisms/site-header/SiteHeaderLogo.vue'
import SiteHeaderNavPrimary from '~/components/organisms/site-header/SiteHeaderNavPrimary.vue'
import SiteHeaderMeta from '~/components/organisms/site-header/SiteHeaderMeta.vue'
// import SiteHeaderBackground from '~/components/organisms/site-header/SiteHeaderBackground.vue'

export default {
  components: {
    SiteHeaderLogo,
    SiteHeaderNavPrimary,
    SiteHeaderMeta
    // SiteHeaderBackground
  },
  data() {
    return {
      activeItem: null,
      navIsHidden: 0,
      lastY: 0
    }
  },
  computed: {
    docHeight() {
      return this.$store.state.device.docHeight
    },
    winHeight() {
      return this.$store.state.device.winHeight
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
      const nearBottomOffset = 50
      const nearBottom = this.winHeight + y + nearBottomOffset >= this.docHeight

      if (hasScrolledUp && this.navIsHidden) this.showNav()
      if (hasScrolledDown && !this.navIsHidden) this.hideNav()
      if (nearTop && this.navIsHidden) this.showNav()
      if (nearBottom && this.navIsHidden) this.showNav()
    },
    showNav() {
      this.navIsHidden = 0
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
$dimHeight: 20vw;
$blur: 2vw;

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;

  &.navIsHidden {
    &::after {
      transform: translate3d(0, -3vw, 0);
    }

    .shy {
      opacity: 0;
      pointer-events: none;
    }
  }

  .shy {
    pointer-events: auto;
    transition: opacity calc(var(--time) * 0.5) var(--ease);
  }

  .egstad-logo,
  .header-nav {
    display: inline-block;
  }

  .header-nav {
    &__wrap {
      display: flex;
    }
  }
}
</style>
