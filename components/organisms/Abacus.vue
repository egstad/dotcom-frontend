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
      @mouseenter="onHover"
      @mouseleave="onLeave"
    >
      <nuxt-link
        v-touch:tap.self="onClick"
        class="abacus__link"
        :to="link.path"
        @focus.native="onFocus"
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
      hoveredIndex: undefined,
      hasClickedLink: false
    }
  },
  watch: {
    hoveredIndex(newValue) {
      if (newValue === undefined) return
      this.styleActiveLinkByIndex(newValue)
    }
  },
  mounted() {
    this.init()
    this.$nuxt.$on('window::resize', this.styleActiveLinkByIndex)
    this.$nuxt.$on('page::mounted', this.setToActiveLink)
    this.mounted = true
  },
  beforeDestroy() {
    this.$nuxt.$off('window::resize', this.styleActiveLinkByIndex)
    this.$nuxt.$off('page::mounted', this.setToActiveLink)
  },
  methods: {
    init() {
      this.activeIndex = this.getActiveLinkIndex()
      this.hoveredIndex = this.activeIndex
      this.hasClickedLink = false
    },
    onHover(ev) {
      this.hoveredIndex = this.getElementIndex(ev.target)
    },
    onLeave() {
      if (this.hasClickedLink) return
      this.setToActiveLink()
    },
    onFocus(ev) {
      this.hoveredIndex = this.getElementIndex(ev.target.parentNode)
    },
    onClick(ev) {
      this.activeIndex = this.getElementIndex(ev.target.parentNode)
      this.hasClickedLink = true

      // fire animation if clicked page is already active
      if (this.activeIndex === this.getActiveLinkIndex()) {
        this.$emit('activeLinkClicked')
      }
    },
    styleActiveLinkByIndex() {
      const self = this.hoveredIndex ?? this.activeIndex
      this.$refs.bead.style.transform = `translate3d(${100 * self}%,0,0)`
      this.$refs.bead.style.width = `${100 / this.$refs.item.length}%`
    },
    getActiveLinkIndex() {
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
    getElementIndex(element) {
      return [...element.parentNode.children].indexOf(element)
    },
    setToActiveLink() {
      this.activeIndex = this.getActiveLinkIndex()
      this.hoveredIndex = this.activeIndex
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

    @media screen and (prefers-reduced-motion: no-preference) {
      transition: color 400ms cubic-bezier(0.375, 0.39, 0, 1.175);
    }

    @media (max-width: 400px) {
      font-size: 0.9em;
    }

    // update text color on hover
    :not(.is-active):not(.is-hovered) &,
    .is-active:not(.is-hovered) & {
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

  .abacus__link {
    @media screen and (prefers-reduced-motion: no-preference) {
      transition: color 750ms 250ms ease-in-out;

      // update background on hover
      .is-hovered &,
      .is-hovered.is-active & {
        transition: color 400ms cubic-bezier(0.375, 0.39, 0, 1.175);
      }
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
