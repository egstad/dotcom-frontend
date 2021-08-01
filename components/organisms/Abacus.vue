<template>
  <ul class="abacus" :class="[{ 'bead-is-trans': beadIsTransitioning }]">
    <li
      v-for="(link, i) in links"
      :key="i"
      ref="item"
      :class="[
        'abacus__item',
        { 'is-hovered': i === hoveredIndex },
        { 'is-active': i === activeIndex }
      ]"
      @mouseenter="onHover($event, i)"
      @mouseleave="onLeave"
    >
      <nuxt-link
        ref="link"
        class="abacus__link"
        :to="link.path"
        @click.native="onClick"
        @focus.native="onFocus($event, i)"
        @blur.native="init"
      >
        <template v-if="link.abbr">
          <span v-if="largeBreakpoint">{{ link.title }}</span>
          <abbr v-else :title="link.title">{{ link.abbr }}</abbr>
        </template>
        <template v-else>
          {{ link.title }}
        </template>
      </nuxt-link>
    </li>
    <div v-show="showBead" ref="bead" class="abacus__bead"></div>
    <div class="abacus__row"></div>
  </ul>
</template>

<script>
export default {
  props: {
    links: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      mounted: false,
      activeIndex: null,
      // lastIndex: null,
      hoveredIndex: undefined,
      hasClickedLink: false,
      showBead: false,
      beadIsTransitioning: null
    }
  },
  computed: {
    activeNavigationRoute() {
      return this.$store.state.activeNavigationRoute
    },

    largeBreakpoint() {
      return this.$store.state.device.windWidth >= 1600
    }
  },
  watch: {
    hoveredIndex(newValue) {
      // if (newValue === undefined) return
      this.styleBead(newValue)
    },
    activeNavigationRoute(newValue) {
      this.selectByIndex(this.getIndexOfPath(newValue))
      this.styleBead()
    }
  },
  mounted() {
    this.init()
    this.$nuxt.$on('window::resize', this.styleBead)
  },
  beforeDestroy() {
    this.$nuxt.$off('window::resize', this.styleBead)

    if (this.$refs.bead)
      this.$refs.bead.removeEventListener(
        'transitionend',
        this.beadOnTransitionEnd
      )
  },
  methods: {
    init() {
      this.selectByActiveNuxtLink()
      // this.lastIndex = this.activeIndex
      this.hasClickedLink = false
    },
    onHover(ev, index) {
      this.hoveredIndex = index
    },
    selectByIndex(index) {
      // this.lastIndex = this.activeIndex
      this.activeIndex = index
      this.hoveredIndex = index
    },
    onLeave() {
      if (this.hasClickedLink) return
      this.hoveredIndex = this.activeIndex
      // this.selectByIndex(this.activeIndex)
    },
    onFocus(ev, index) {
      this.hoveredIndex = index
    },
    onClick() {
      this.hasClickedLink = true

      // fire animation if clicked page is already active
      if (this.activeIndex === this.getActiveIndex()) {
        this.$emit('activeLinkClicked')
      }
    },
    styleBead() {
      const self = this.hoveredIndex ?? this.activeIndex
      this.hasClickedLink = false
      this.showBead = true
      this.$refs.bead.style.transform = `scale(1.01) translate3d(${100 *
        self}%,-50%,0)`
      this.$refs.bead.style.width = `${100 / this.$refs.item.length}%`

      // update state
      this.beadIsTransitioning = true
      this.$refs.bead.addEventListener(
        'transitionend',
        this.beadOnTransitionEnd
      )
    },
    beadOnTransitionEnd() {
      if (!this.$refs.bead) return
      this.$refs.bead.removeEventListener(
        'transitionend',
        this.beadOnTransitionEnd
      )
      this.beadIsTransitioning = false
    },
    getActiveIndex() {
      let activeLinkIndex
      this.$refs.item.forEach((listItem, index) => {
        if (listItem.children[0].classList.contains('nuxt-link-exact-active'))
          activeLinkIndex = index
      })

      // fallback if exact item isn't in nav
      if (!activeLinkIndex) {
        this.$refs.item.forEach((listItem, index) => {
          if (listItem.children[0].classList.contains('nuxt-link-active'))
            activeLinkIndex = index
        })
      }

      return activeLinkIndex
    },
    getIndexOfPath(path) {
      let activeLinkIndex

      this.$refs.link.forEach((nuxtLink, index) => {
        const url = new URL(nuxtLink.$el.href)
        const rel = url.toString().substring(url.origin.length)

        if (rel === path) activeLinkIndex = index
      })

      return activeLinkIndex
    },
    selectByActiveNuxtLink() {
      this.selectByIndex(this.getActiveIndex())
    }
  }
}
</script>

<style lang="scss" scoped>
.abacus {
  position: relative;
  display: flex;
  width: 100%;
  flex: 1;
  border-radius: var(--button-height);

  &__item {
    position: relative;
    z-index: 2;
    display: flex;
    flex: 1;
  }

  &__link {
    display: block;
    border-radius: var(--button-height);
    flex: 1 1;
    color: var(--foreground);
    font-family: var(--mono);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-decoration: none;
    text-align: center;
    line-height: var(--button-height);
    font-size: 12px;
    padding-top: var(--button-click-offset);
    padding-bottom: var(--button-click-offset);

    @media screen and (prefers-reduced-motion: no-preference) {
      transition: color var(--trans-short) var(--ease-back);
    }

    @media (max-width: 600px) {
      font-size: 0.9em;
    }

    .is-active:not(.is-hovered) & {
      color: var(--foreground);
    }

    .is-hovered &,
    .is-active & {
      color: var(--background);
    }

    abbr {
      text-decoration: none;
    }
  }

  &__row {
    position: absolute;
    z-index: 0;
    top: var(--button-click-offset);
    left: 0;
    right: 0;
    height: var(--button-height);
    border-radius: 100vw;
    pointer-events: none;
    background-color: hsla(var(--b-h), var(--b-s), calc(var(--b-l) - 7%), 100%);
    width: 100%;

    @media screen and (prefers-reduced-motion: no-preference) {
      transition: background-color var(--transition-page);
    }
  }

  &__bead {
    position: absolute;
    height: var(--button-height);
    border-radius: var(--button-height);
    z-index: 1;
    top: 50%;
    left: 0;
    background-color: var(--foreground);
    pointer-events: none;
    transform: translate3d(0, -50%, 0);

    @media screen and (prefers-reduced-motion: no-preference) {
      transition: background-color var(--transition-page),
        transform var(--trans-medium) var(--ease-back);
    }
  }
}

// quickly transition text color when the bead is moving
.bead-is-trans {
  .abacus__link {
    @media screen and (prefers-reduced-motion: no-preference) {
      transition: color var(--trans-short) var(--ease);
    }
  }
}

// page is transitioning
.isTransitioning {
  // disable hovers
  .abacus {
    pointer-events: none;
  }

  // match page transition
  .abacus__link {
    @media screen and (prefers-reduced-motion: no-preference) {
      transition: color var(--transition-page);
    }
  }
}
</style>
