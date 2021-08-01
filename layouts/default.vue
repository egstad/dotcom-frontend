<template>
  <div
    class="site"
    :style="cssVars"
    :class="[{ isCursor }, { isTouch }, { isMobile }, { isTransitioning }]"
  >
    <SiteHeader />

    <div class="site-content" :style="mainStyle">
      <main class="site-main">
        <nuxt />
      </main>

      <SiteFooter />
    </div>

    <!-- <Debug /> -->
    <Scrim />
  </div>
</template>

<script>
import SiteHeader from '@/components/organisms/site-header/SiteHeader'
import SiteFooter from '@/components/organisms/site-footer/SiteFooter'

// import Debug from '@/components/templates/Debug'
import Scrim from '@/components/templates/Scrim'

export default {
  components: {
    SiteHeader,
    SiteFooter,
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
    }
  },
  watch: {
    cssVars(state) {
      return state
    }
  },
  mounted() {
    this.$store.commit('layoutHasMounted', true)
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

  // site header and abacuses
  --header-item-gap: 8px;
  --button-height: 36px;
  --button-click-offset: 16px;
  @media (min-width: 1024px) {
    --button-click-offset: #{calc-vw(16px, 1024px)};
  }

  background-color: var(--background);
  color: var(--foreground);

  @media screen and (prefers-reduced-motion: no-preference) {
    transition: all var(--transition-page);
    transition-property: background-color, color;
  }

  ::selection {
    background: hsla(var(--a-h), var(--a-s), var(--a-l), 50%);
    color: var(--foreground);
  }

  a[href]:not([tabindex='-1']),
  area[href]:not([tabindex='-1']),
  input:not([disabled]):not([tabindex='-1']),
  select:not([disabled]):not([tabindex='-1']),
  textarea:not([disabled]):not([tabindex='-1']),
  button:not([disabled]):not([tabindex='-1']),
  video:not([disabled]):not([tabindex='-1']),
  iframe,
  [tabindex],
  [contentEditable='true'] {
    outline-color: var(--accent);
  }

  a {
    color: var(--accent);
  }

  &-content {
    display: flex;
    flex-direction: column;
    font-family: 'comic sans' !important;
  }
  &-main {
    width: 100%;
    overflow: hidden;
    flex: 1 0 auto;
  }
}

@font-face {
  font-family: 'S85';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('~assets/fonts/S85.ttf') format('truetype');
}
</style>
