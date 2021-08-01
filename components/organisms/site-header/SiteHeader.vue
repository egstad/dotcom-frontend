<template>
  <header
    :class="['site-header', { navIsHidden }, { navIsAtTop }, { isWiggling }]"
    @mouseenter="showNav"
  >
    <SiteHeaderNavigation
      class="site-header__nav"
      :show-scroll-button="showScrollButton"
      :links-primary="linksPrimary"
      :links-secondary="linksSecondary"
      @activeLinkClicked="wiggleNav"
    />

    <!-- <SiteHeaderMeta /> -->
    <!-- <div class="backdrop"></div> -->
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
      highlightedIndex: null,
      isWiggling: false,
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
          title: 'Design',
          abbr: 'Dsgn',
          path: '/work/design'
        },
        {
          title: 'Development',
          abbr: 'Devl',
          path: '/work/development'
        },
        {
          title: 'Typography',
          abbr: 'Type',
          path: '/work/development'
        },
        {
          title: 'Illustration',
          abbr: 'Illo',
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
    },
    wiggleNav() {
      this.isWiggling = true

      const onEnd = () => {
        this.isWiggling = false
        this.$el.removeEventListener('animationend', onEnd)
      }

      this.$el.addEventListener('animationend', onEnd)
    }
  }
}
</script>

<style lang="scss">
// var(--gutter): clamp(0.5em, 1.5vw, 2em);

.site-header {
  --gutter: 12px;
  // background-color: var(--background);
  // box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.008),
  //   0 6.7px 5.3px rgba(0, 0, 0, 0.012), 0 12.5px 10px rgba(0, 0, 0, 0.015),
  //   0 22.3px 17.9px rgba(0, 0, 0, 0.018), 0 41.8px 33.4px rgba(0, 0, 0, 0.022),
  //   0 100px 80px rgba(0, 0, 0, 0.03);
  // background-color: hsla(var(--b-h), var(--b-s), var(--b-l), 100%);

  @media (min-width: 1024px) {
    --gutter: #{calc-vw(12px, 1024px)};
  }

  position: fixed;
  z-index: 20;
  left: 0;
  width: 100%;
  padding-left: var(--gutter);
  padding-right: var(--gutter);
  display: flex;

  @media screen and (prefers-reduced-motion: no-preference) {
    transition: transform var(--trans-medium) var(--ease);
  }
  &.navIsHidden {
    transform: translate3d(0, calc(-200% - var(--gutter)), 0);
    box-shadow: none;
  }

  &.isWiggling {
    animation: shakeX 1s ease;
  }

  &.navIsAtTop {
    // box-shadow: none;
    // background-color: hsla(var(--b-h), var(--b-s), var(--b-l), 0%);
    // transition: transform var(--trans-medium) var(--ease),
    //   background-color var(--trans-short) 50ms, color var(--trans-short);

    // .backdrop {
    //   transform: translate3d(0, -120%, 0);
    // }
  }
}

.isTransitioning {
  // .site-header {
  //   background-color: hsla(var(--b-h), var(--b-s), var(--b-l), 0%);
  //   @media screen and (prefers-reduced-motion: no-preference) {
  //     transition: background-color var(--trans-medium);
  //   }
  // }
  .fab {
    @media screen and (prefers-reduced-motion: no-preference) {
      transition: background-color var(--transition-page),
        color var(--transition-page);
    }
  }
}

// .backdrop {
//   transform: translate3d(0, 0, 0);
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   z-index: -1;
//   height: 100%;
//   width: 100%;
//   background-color: var(--background);
//   transition: transform var(--trans-short) 200ms var(--ease);
//   box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.008),
//     0 6.7px 5.3px rgba(0, 0, 0, 0.012), 0 12.5px 10px rgba(0, 0, 0, 0.015),
//     0 22.3px 17.9px rgba(0, 0, 0, 0.018), 0 41.8px 33.4px rgba(0, 0, 0, 0.022),
//     0 100px 80px rgba(0, 0, 0, 0.03);
// }

@keyframes shakeX {
  from,
  to {
    transform: translate3d(0, 0, 0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translate3d(-10px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translate3d(10px, 0, 0);
  }
}
</style>
