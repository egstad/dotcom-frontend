<template>
  <header
    :class="['site-header', { navIsHidden }, { navIsAtTop }]"
    @mouseenter="showNav"
  >
    <SiteHeaderNavigation
      :show-scroll-button="showScrollButton"
      class="site-header__nav"
    />
  </header>
</template>

<script>
import SiteHeaderNavigation from '~/components/organisms/site-header/SiteHeaderNavigation.vue'
// import SiteHeaderMeta from '~/components/organisms/site-header/SiteHeaderMeta.vue'

export default {
  components: {
    SiteHeaderNavigation
    // SiteHeaderNavPrimary,
    // SiteHeaderMeta
  },
  data() {
    return {
      activeItem: null,
      navIsAtTop: true,
      navIsHidden: 0,
      showScrollButton: false,
      highlightedIndex: null
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
      this.scrollHandler()
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
      const nearBottomOffset = 25
      const nearBottom = this.winHeight + y + nearBottomOffset >= this.docHeight

      if (hasScrolledUp && this.navIsHidden) this.showNav()
      if (hasScrolledDown && !this.navIsHidden) this.hideNav()
      if (nearBottom && this.navIsHidden) this.showNav()
      if (nearTop && this.navIsHidden) this.showNav()
      this.navIsAtTop = nearTop
      this.showScrollButton = !nearTop
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

    // setHighlight(index) {
    //   this.highlightedIndex
    // }
  }
}
</script>

<style lang="scss" scoped>
$margin: clamp(0.5em, 1.5vw, 2em);

.site-header {
  position: fixed;
  z-index: 20;
  top: 3px;
  left: 0;
  width: 100%;
  min-width: 300px;
  padding: $margin;

  &.navIsHidden {
    @media screen and (prefers-reduced-motion: no-preference) {
      ::v-deep .site-header__nav,
      ::v-deep .--toggle-menu,
      ::v-deep .--scroll-up {
        transform: translate3d(0, calc(-150% - #{$margin}), 0);
      }
      ::v-deep .--toggle-menu {
        transition-delay: 100ms;
      }
      ::v-deep .--scroll-up {
        transition-delay: 50ms;
      }
    }
  }

  // &.navIsAtTop {
  //   .row {
  //     background: hsla(var(--b-h), var(--b-s), calc(var(--b-l) - 10%), 100%);
  //     box-shadow: none;
  //   }
  // }
}
</style>
