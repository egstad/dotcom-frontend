<template>
  <ul class="abacus">
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
      hoveredIndex: undefined,
      hasClickedLink: false,
      showBead: false
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
  },
  methods: {
    init() {
      this.selectByActiveNuxtLink()
      this.hasClickedLink = false
    },
    onHover(ev, index) {
      this.hoveredIndex = index
    },
    selectByIndex(index) {
      this.activeIndex = index
      this.hoveredIndex = index
    },
    onLeave() {
      if (this.hasClickedLink) return
      this.selectByActiveNuxtLink()
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
$trans-time: 250ms;

.abacus {
  // overflow-x: hidden;
  position: relative;
  display: flex;
  width: 100%;
  flex: 1;
  border-radius: $height;
  background-color: var(--accent);
  background: hsla(var(--b-h), var(--b-s), calc(var(--b-l) - 7%), 100%);

  @media screen and (prefers-reduced-motion: no-preference) {
    transition: background-color 750ms 250ms ease-in-out;
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
      transition: color 300ms cubic-bezier(0.375, 0.39, 0, 1.175);
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
      transition: background-color 750ms 250ms ease-in-out,
        transform 400ms cubic-bezier(0.375, 0.39, 0, 1.175);
    }
  }
}

// match page transition
.isTransitioning {
  .abacus__link {
    @media screen and (prefers-reduced-motion: no-preference) {
      transition: color 750ms 250ms ease-in-out;
    }

    &.nuxt-link-exact-active {
      @media screen and (prefers-reduced-motion: no-preference) {
        transition: color 200ms ease-in-out;
      }
    }
  }
}
</style>
