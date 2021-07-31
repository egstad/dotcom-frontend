<template>
  <nav>
    <div class="list">
      <div
        v-for="(link, i) in links"
        :key="i"
        ref="item"
        class="list__item"
        :class="[
          { 'is-hovered': i === hoveredIndex },
          { 'is-active': i === activeIndex }
        ]"
        @mouseenter="onHover"
        @mouseleave="onLeave"
      >
        <nuxt-link
          v-touch:tap.self="onClick"
          class="list__link"
          :to="link.path"
          @focus.native="onFocus"
          @blur.native="init"
        >
          {{ link.title }}
        </nuxt-link>
      </div>
      <div v-show="mounted" ref="concierge" class="concierge"></div>
    </div>

    <ButtonScroll :show-scroll-button="showScrollButton" />
    <ButtonMenu />
  </nav>
</template>

<script>
// import gsap from 'gsap'
import ButtonScroll from '@/components/organisms/site-header/SiteHeaderButtonScroll.vue'
import ButtonMenu from '@/components/organisms/site-header/SiteHeaderButtonMenu.vue'

export default {
  components: {
    ButtonScroll,
    ButtonMenu
  },
  props: {
    showScrollButton: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      mounted: false,
      activeIndex: null,
      hoveredIndex: undefined,
      hasClickedLink: false,
      links: [
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
      ]
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
    this.$nuxt.$off('window::resize')
    this.$nuxt.$off('page::mounted')
  },
  methods: {
    init(ev) {
      this.activeIndex = this.getActiveLinkIndex()
      this.hoveredIndex = this.activeIndex
      this.hasClickedLink = false
    },
    onHover(ev) {
      this.hoveredIndex = this.getElementIndex(ev.target)
    },
    onLeave(ev) {
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
      this.$refs.concierge.style.transform = `translate3d(${100 * self}%,0,0)`
      this.$refs.concierge.style.width = `${100 / this.$refs.item.length}%`
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

<style lang="scss">
$height: 36px;
$inset: 0px;
$gap: 8px;
$blur: 8px;
$trans-time: 250ms;

.site-header__nav {
  user-select: none;
  width: 100%;
  flex: 1;
  position: relative;
  border-radius: $height;
  display: flex;

  @media screen and (prefers-reduced-motion: no-preference) {
    transition: transform $trans-time ease-in-out;
  }

  .list {
    position: relative;
    display: flex;
    flex: 1;
    width: 100%;
    overflow-x: hidden;
    border-radius: $height;
    background: hsla(var(--b-h), var(--b-s), calc(var(--b-l) - 10%), 100%);
    max-width: 350px;

    // backdrop-filter: blur(5px);

    &__item {
      flex: 1;
      text-align: center;
      display: flex;
      position: relative;
      z-index: 2;

      &.is-hovered {
        .list__link {
          color: var(--background);
        }
      }

      &.is-active:not(.is-hovered),
      &:not(.is-active):not(.is-hovered) {
        .list__link {
          color: var(--foreground);
        }
      }
    }

    &__link {
      flex: 1 1;
      display: block;
      line-height: $height + ($inset * 2);
      height: $height;
      text-transform: uppercase;
      color: var(--foreground);
      text-decoration: none;
      letter-spacing: 0.05em;
      border-radius: $height;
      font-size: 0.9em;
      font-family: var(--mono);
      // padding: 0 0.5em;
      outline: none;

      @media screen and (prefers-reduced-motion: no-preference) {
        transition: color 400ms cubic-bezier(0.375, 0.39, 0, 1.175);
      }

      @media (max-width: 400px) {
        font-size: 0.9em;
      }

      &.--search {
        appearance: none;
        background: 0;
        border: 0;
      }
    }

    .nuxt-link-exact-active {
      color: var(--background);
    }
  }
}

.button {
  display: block;
  width: $height + ($inset * 2);
  height: $height + ($inset * 2);
  line-height: $height;
  padding: 0;
  margin: 0;
  background: hsla(var(--b-h), var(--b-s), calc(var(--b-l) - 10%), 100%);
  appearance: none;
  border: 0;
  border-radius: 50%;
  font-family: var(--mono);
  margin-left: $gap;
  cursor: pointer;
  backdrop-filter: blur($blur);

  &.--toggle-menu {
    @media screen and (prefers-reduced-motion: no-preference) {
      transition: transform $trans-time 200ms ease-in-out,
        opacity $trans-time ease-in-out;
    }
  }
  &.--scroll-up {
    @media screen and (prefers-reduced-motion: no-preference) {
      transition: transform $trans-time 100ms ease-in-out,
        opacity $trans-time ease-in-out;
    }
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    &.fade-enter-active,
    &.fade-leave-active {
      transition: transform $trans-time var(--ease),
        width $trans-time var(--ease), margin-left $trans-time var(--ease),
        opacity $trans-time var(--ease);
    }
    &.fade-enter, &.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      transform: scale(0);
      width: 0;
      opacity: 0;
      margin-left: 0;
    }
  }
}

.concierge {
  position: absolute;
  height: calc(100% - #{$inset});
  border-radius: $height;
  z-index: 1;
  top: $inset;
  bottom: $inset;
  left: 0;
  background-color: var(--foreground);
  pointer-events: none;
  transform: scale(2) translate3d(0, -50%, 0);
  width: 33.333%;

  @media screen and (prefers-reduced-motion: no-preference) {
    transition: transform 400ms cubic-bezier(0.375, 0.39, 0, 1.175);
  }
}

.isTransitioning {
  .site-header {
    pointer-events: none;

    .list {
      @media screen and (prefers-reduced-motion: no-preference) {
        transition: background-color 750ms 250ms ease-in-out;
      }
    }

    .list__link {
      @media screen and (prefers-reduced-motion: no-preference) {
        transition: color 750ms 250ms ease-in-out;
      }
    }

    .concierge {
      @media screen and (prefers-reduced-motion: no-preference) {
        transition: background-color 750ms 250ms ease-in-out,
          transform 400ms cubic-bezier(0.375, 0.39, 0, 1.175);
      }
    }

    @media screen and (prefers-reduced-motion: no-preference) {
      transition: all 750ms 250ms ease-in-out;
      transition-property: background-color, color;
    }
  }
}
</style>
