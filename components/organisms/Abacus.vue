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
        {{ link.title }}
      </nuxt-link>
    </li>
    <div v-show="showBead" ref="bead" class="abacus__bead"></div>
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
      this.$refs.bead.style.transform = `translate3d(${100 * self}%,0,0)`
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
$height: 36px;
$inset: 0px;
$gap: 8px;
$blur: 8px;

.abacus {
  position: relative;
  display: flex;
  width: 100%;
  flex: 1;
  border-radius: $height;
  // background-color: var(--accent);
  background-color: hsla(var(--b-h), var(--b-s), calc(var(--b-l) - 7%), 100%);

  @media screen and (prefers-reduced-motion: no-preference) {
    transition: background-color var(--transition-page);
  }

  &__item {
    position: relative;
    z-index: 2;
    display: flex;
    flex: 1;
  }

  &__link {
    display: block;
    border-radius: $height;
    height: $height;
    // outline: none;
    outline-offset: 4px;
    flex: 1 1;
    color: var(--foreground);
    font-family: var(--mono);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-decoration: none;
    text-align: center;
    line-height: $height + ($inset * 2);
    font-size: 0.9em;
    padding-left: 0 1em;

    @media screen and (prefers-reduced-motion: no-preference) {
      transition: color var(--trans-short) var(--ease-back);
    }

    @media (max-width: 400px) {
      font-size: 0.9em;
    }

    .is-active:not(.is-hovered) & {
      color: var(--foreground);
    }

    .is-hovered &,
    .is-active & {
      color: var(--background);
    }
  }

  &__bead {
    position: absolute;
    height: calc(100% - #{$inset});
    border-radius: $height;
    z-index: 1;
    top: $inset;
    bottom: $inset;
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
