<template>
  <header
    :class="['site-header', { navIsHidden: !headerIsVisible }, { navIsAtTop }]"
    @mouseenter="showNav"
  >
    <SiteHeaderNavigation
      class="site-header__nav"
      :show-scroll-button="showScrollButton"
      :show-time="navIsAtTop"
      :links-primary="linksPrimary"
      :links-secondary="linksSecondary"
    />
  </header>
</template>

<script>
import SiteHeaderNavigation from '~/components/organisms/site-header/SiteHeaderNavigation.vue'

export default {
  components: {
    SiteHeaderNavigation
    // SiteHeaderMeta
  },
  data() {
    return {
      activeItem: null,
      navIsAtTop: true,
      // navIsHidden: true,
      showScrollButton: false,
      highlightedIndex: null,
      linksPrimary: [
        {
          title: 'Egstad',
          path: '/'
        },
        {
          title: 'Work',
          path: 'work'
        },
        {
          title: 'About',
          path: 'profile'
        }
      ],
      linksSecondary: [
        {
          title: 'All',
          path: '/work'
        },
        {
          title: '#Design',
          abbr: '#Dsgn',
          path: '/'
        },
        {
          title: '#Development',
          abbr: '#Devl',
          path: '/work'
        },
        {
          title: '#Typography',
          abbr: '#Type',
          path: '/profile'
        },
        {
          title: '#Illustration',
          abbr: '#Illo',
          path: '/testing-page'
        }
      ]
    }
  },
  computed: {
    docHeight() {
      return this.$store.state.device.docHeight
    },
    winHeight() {
      return this.$store.state.device.winHeight
    },
    headerIsVisible() {
      return this.$store.state.headerIsVisible
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

      if (hasScrolledUp && !this.headerIsVisible) this.showNav()
      if (hasScrolledDown && this.headerIsVisible) this.hideNav()
      if (nearBottom && !this.headerIsVisible) this.showNav()
      if (nearTop && !this.headerIsVisible) this.showNav()
      this.navIsAtTop = nearTop
      this.showScrollButton = !nearTop
    },
    showNav() {
      this.$store.commit('setHeaderVisibility', true)
    },
    hideNav() {
      this.$store.commit('setHeaderVisibility', false)
    },
    updateActiveItem(val) {
      this.activeItem = val
    }
  }
}
</script>

<style lang="scss" scoped>
.site-header {
  /* Positioning */
  position: fixed;
  z-index: 20;
  left: 0;

  /* Display & Box Model */
  display: flex;
  width: 100%;
  padding-left: var(--button-click-offset);
  padding-right: var(--button-click-offset);
  // box-shadow: 0 1.3px 6.7px -15px rgba(0, 0, 0, 0.061),
  //   0 4.2px 22.3px -15px rgba(0, 0, 0, 0.089),
  //   0 19px 100px -15px rgba(0, 0, 0, 0.15);

  /* Color */
  // background-color: var(--background);
  // background-color: hsla(var(--b-h), var(--b-s), calc(var(--b-l)), 80%);

  /* Other */
  @include transition {
    transition: transform var(--trans-medium) var(--ease),
      background-color var(--trans-short) var(--trans-delay) var(--ease);
  }

  &.navIsHidden {
    transform: translate3d(0, calc(-200% - var(--button-click-offset)), 0);
    box-shadow: none;
  }

  &.navIsAtTop {
    background-color: hsla(var(--b-h), var(--b-s), var(--b-l), 0%);
    box-shadow: none;
  }
}

.site-header__nav {
  /* Positioning */
  position: relative;

  /* Display & Box Model */
  display: flex;
  width: 100%;

  /* Other */
  user-select: none;
  @include transition {
    transition: transform var(--trans-medium) ease-in-out;
  }
}
</style>
