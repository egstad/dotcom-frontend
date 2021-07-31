<template>
  <ul class="abacus">
    <li
      v-for="(link, i) in links"
      :key="i"
      ref="item"
      :class="[
        'abacus__item',
        { 'is-hovered': i === hoveredIndex },
        { 'is-active': i === activeIndex },
        { 'is-last': i === lastIndex }
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
    <div v-show="mounted" ref="bead" class="abacus__bead"></div>
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
      lastIndex: null,
      hoveredIndex: undefined,
      hasClickedLink: false
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
    // this.$nuxt.$on('page::mounted', this.selectByActiveNuxtLink)
    // this.$nuxt.$on('setActiveNavigationRoute', this.selectByActiveNuxtLink)
    this.mounted = true
  },
  beforeDestroy() {
    this.$nuxt.$off('window::resize', this.styleBead)
    // this.$nuxt.$off('page::mounted', this.selectByActiveNuxtLink)
    // this.$nuxt.$off('setActiveNavigationRoute', this.selectByActiveNuxtLink)
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
      this.lastIndex = this.activeIndex ?? 0
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
      this.$refs.bead.style.transform = `translate3d(${100 * self}%,0,0)`
      this.$refs.bead.style.width = `${100 / this.$refs.item.length}%`
      this.hasClickedLink = false
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
  overflow-x: hidden;
  position: relative;
  display: flex;
  width: 100%;
  flex: 1;
  border-radius: $height;
  background-color: var(--accent);
  background: hsla(var(--b-h), var(--b-s), calc(var(--b-l) - 7%), 100%);

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
    outline: none;
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

    // @media screen and (prefers-reduced-motion: no-preference) {
    //   transition: color 400ms cubic-bezier(0.375, 0.39, 0, 1.175);
    // }

    @media (max-width: 400px) {
      font-size: 0.9em;
    }

    // update text color on hover
    :not(.is-active):not(.is-hovered) &,
    .is-active:not(.is-hovered) &,
    .is-last:not(.is-active):not(.is-hovered) {
      color: var(--foreground);
    }

    // update background on hover
    .is-hovered &,
    .is-hovered.is-active & {
      color: var(--background) !important;
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
      transition: transform 400ms cubic-bezier(0.375, 0.39, 0, 1.175);
    }
  }
}

.isTransitioning {
  .abacus {
    @media screen and (prefers-reduced-motion: no-preference) {
      transition: background-color 750ms 250ms ease-in-out;
    }
  }

  .abacus__item {
    // update background on hover &.is-hovered .abacus__link,
    &.is-active .abacus__link {
      @media screen and (prefers-reduced-motion: no-preference) {
        transition: color 200ms ease-in-out;
      }
    }
    // &.is-last .abacus__link {
    //   @media screen and (prefers-reduced-motion: no-preference) {
    //     transition: color 400ms cubic-bezier(0.375, 0.39, 0, 1.175);
    //   }
    // }
  }

  .abacus__link {
    @media screen and (prefers-reduced-motion: no-preference) {
      transition: color 600ms ease-in-out;
    }
  }

  .abacus__bead {
    @media screen and (prefers-reduced-motion: no-preference) {
      transition: background-color 750ms 250ms ease-in-out,
        transform 400ms cubic-bezier(0.375, 0.39, 0, 1.175);
    }
  }
}
</style>
