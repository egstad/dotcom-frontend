<template>
  <nav class="nav-primary" :class="{ 'is-hidden': navIsHidden }">
    <ul class="nav-primary__list">
      <li v-for="link in links" :key="link.title" class="nav-primary__item">
        <nuxt-link class="nav-primary__link" :to="{ path: link.route }">
          {{ link.title }}</nuxt-link
        >
      </li>
    </ul>
    <p v-if="activeItem">active: {{ activeItem }}</p>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      activeItem: null,
      navIsHidden: false,
      lastY: 0,
      links: [
        {
          title: 'Index',
          route: '/'
        },
        {
          title: 'Profile',
          route: '/profile'
        },
        {
          title: 'Contact',
          route: '/contact'
        }
      ]
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

<style lang="scss">
.nav-primary {
  position: fixed;
  z-index: 1;
  font-size: 1em;
  transform: translate3d(0, 0, 0);
  transition: transform calc(var(--time) * 0.5) var(--ease);

  &.is-hidden {
    transform: translate3d(0, -100%, 0);
  }
}

.nav-primary__list {
  list-style-type: none;
  display: flex;
  padding: 0.4em;
  /* position: fixed;
  top: 0;
  left: 0;
  z-index: 1000; */
}

.nav-primary__link {
  display: block;
  font-family: monospace;
  padding: 0.4em 0.6em;
  background: var(--foreground);
  color: var(--background);
  margin-right: 0.4em;
  text-decoration: none;
  opacity: 0.5;
  transition: color var(--time) var(--ease),
    background-color var(--time) var(--ease), opacity var(--time) var(--ease);

  &:hover {
    opacity: 1;
  }
}

.nuxt-link-exact-active {
  opacity: 1;
}
</style>
