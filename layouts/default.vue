<template>
  <div
    class="site"
    :style="cssVars"
    :class="[
      { isCursor },
      { isTouch },
      { isMobile },
      { isTransitioning },
      { isMenuOpen }
    ]"
  >
    <Scrim />
    <SiteHeader class="site-header" />

    <div class="site-content" :style="mainStyle">
      <main class="site-main">
        <nuxt />
      </main>
    </div>

    <SiteMenu class="site-menu" />
    <!-- <Debug /> -->
  </div>
</template>

<script>
import SiteHeader from '@/components/organisms/site-header/SiteHeader'
import SiteMenu from '@/components/organisms/site-menu/SiteMenu'
// import Debug from '@/components/templates/Debug'
import Scrim from '@/components/templates/Scrim'

export default {
  components: {
    SiteHeader,
    SiteMenu,
    // LazyTime
    Scrim
    // Debug
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
      return { minHeight: `${this.winHeight}px` }
    },
    cssVars() {
      return this.$store.state.cssVars
    },
    isTransitioning() {
      return this.$store.state.isTransitioning
    },
    isMenuOpen() {
      return this.$store.state.menuIsOpen
    }
  },
  watch: {
    cssVars(state) {
      return state
    },
    $route(newRoute) {
      if (newRoute) this.$nuxt.$emit('route::updated')
    }
  },
  mounted() {
    setTimeout(() => {
      this.timeInView = true
    }, 2000)

    setTimeout(() => {
      this.timeInView = false
    }, 4000)
    // remove when scrim is back
    this.$store.commit('setIsTransitioning', false)
    this.$store.commit('layoutHasMounted', true)
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
  // transition
  --trans-long: 750ms;
  --trans-medium: 400ms;
  --trans-short: 200ms;
  --trans-delay: 250ms;
  --ease: ease-in-out;
  --ease-back: cubic-bezier(0.375, 0.39, 0, 1.175);
  --transition-page: var(--trans-long) var(--trans-delay) var(--ease);
  --a11y-color: rgba(15, 86, 240, 0.8);
  --mono: 'S85', monospace;
  --sans: 'EG Metaphor', sans-serif;

  // site header and abacuses
  --header-item-gap: 8px;
  --button-height: 36px;
  --button-click-offset: 16px;

  @media (min-width: 1024px) {
    --header-item-gap: 12px;
  }

  @include bp($navBreakpoint) {
    --button-height: #{calc-vw(36px, $navBreakpoint)};
    --button-click-offset: #{calc-vw(16px, $navBreakpoint)};
  }

  // @media (min-width: $xx) {
  //   --button-height: 44px;
  // }

  background-color: var(--background);
  color: var(--foreground);

  @include transition {
    transition: all var(--transition-page);
    transition-property: background-color, color;
  }

  ::selection {
    background: hsla(var(--a-h), var(--a-s), var(--a-l), 50%);
  }

  &-content {
    display: flex;
    flex-direction: column;
  }
  &-main {
    width: 100%;
    overflow: hidden;
    flex: 1 0 auto;
    display: flex;
  }
}

.site.isTransitioning {
  .site-header {
    background-color: hsla(var(--b-h), var(--b-s), calc(var(--b-l) + 7%), 0%);

    @include transition {
      transition: background-color var(--trans-short) var(--ease);
    }
  }

  .site-menu {
    // background-color: hsla(var(--b-h), var(--b-s), calc(var(--b-l) + 7%), 0%);

    @include transition {
      transition: background-color var(--transition-page);
    }

    ::v-deep .menu__link {
      @include transition {
        transition: background-color var(--transition-page),
          color var(--transition-page);
      }
    }
  }

  // disable hovers
  ::v-deep .abacus {
    pointer-events: none;

    // match page transition
    .abacus__link {
      @include transition {
        transition: color var(--transition-page);
      }
    }
  }

  // Floating Action Button
  ::v-deep .fab__wrapper {
    @include transition {
      transition: background-color var(--transition-page),
        color var(--transition-page);
    }
  }
}
</style>
