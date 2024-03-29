<template>
  <ul
    class="abacus"
    :class="[{ beadIsTransitioning, beadIsHidden, isWiggling }]"
  >
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
      <template v-if="link.path.includes('mailto:')">
        <a class="abacus__link t-1 t-mono" :href="link.path">
          <span class="abacus__text">
            {{ link.title }}
          </span>
        </a>
      </template>
      <template v-else>
        <nuxt-link
          ref="link"
          class="abacus__link t-1 t-mono"
          :to="link.path"
          @click.native="onClick"
          @focus.native="onFocus($event, i)"
          @blur.native="init"
        >
          <template v-if="link.abbr">
            <span class="abacus__text">
              <span class="--full">{{ link.title }}</span>
              <abbr class="--abbr">{{ link.abbr }}</abbr>
            </span>
          </template>
          <template v-else>
            <span class="abacus__text">
              {{ link.title }}
            </span>
          </template>
        </nuxt-link>
      </template>
    </li>

    <div v-show="showBead" ref="bead" class="abacus__bead"></div>
    <div class="abacus__row"></div>

    <audio ref="click">
      <source src="/mp3/click.mp3" type="audio/mpeg" />
    </audio>
  </ul>
</template>

<script>
export default {
  props: {
    links: {
      type: Array,
      required: true
    },
    route: {
      type: String,
      required: false,
      default: '/'
    },
    beadIsHidden: {
      type: Boolean,
      required: false,
      default: false
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
      beadIsTransitioning: null,
      isWiggling: false
    }
  },
  watch: {
    hoveredIndex(newValue) {
      // if (newValue === undefined) return
      this.styleBead(newValue)
    },
    route(newValue, oldValue) {
      const isWork = newValue.includes('work')
      const index = isWork ? 1 : this.getIndexOfPath(newValue)

      // if route doesn't exist, highlight 'egstad'
      this.selectByIndex(index === undefined ? 0 : index)
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
      this.showBead = true

      this.playClickSound()
    },
    selectByIndex(index) {
      this.lastIndex = this.activeIndex
      this.activeIndex = index
      this.hoveredIndex = index
    },
    onLeave() {
      // if clicked, don't snap back to active
      if (this.hasClickedLink) return

      this.selectByActiveNuxtLink()
    },
    onFocus(ev, index) {
      this.hoveredIndex = index
      this.playClickSound()
    },
    onClick() {
      this.hasClickedLink = true

      // fire animation if clicked page is already active
      if (
        this.activeIndex === this.getActiveIndex() &&
        this.hoveredIndex === this.getActiveIndex() &&
        this.activeIndex === this.getIndexOfPath(this.$route.path)
      ) {
        this.wiggle()
      }
    },
    styleBead() {
      if (!this.$refs.bead) return
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
    },
    wiggle() {
      this.isWiggling = true

      const onEnd = () => {
        this.isWiggling = false
        this.$el.removeEventListener('animationend', onEnd)
      }

      this.$el.addEventListener('animationend', onEnd)
    },
    playClickSound() {
      this.$refs.click.currentTime = 0
      this.$refs.click.volume = 0.3

      const playPromise = this.$refs.click.play()

      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            // Automatic playback started!
            // Show playing UI.
          })
          .catch((error) => {
            /* eslint-disable-next-line */
            console.warn(error)
          })
      }
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
  min-width: 240px;

  &.beadIsHidden {
    .abacus__bead {
      opacity: 0;

      @include transition {
        transition: opacity var(--trans-short) var(--ease);
      }
    }

    // .is-hovered ::v-deep .abacus__link {
    .is-hovered :deep(.abacus__link) {
      color: var(--background);
    }

    // .is-active ::v-deep .abacus__link {
    .is-active :deep(.abacus__link) {
      color: var(--background);

      @include transition {
        transition: color var(--trans-short) var(--ease);
      }
    }
  }

  // quickly transition text color when the bead is moving
  &.beadIsTransitioning {
    // ::v-deep .abacus__link {
    :deep(.abacus__link) {
      @include transition {
        transition: color var(--trans-short) var(--ease);
      }
    }
  }

  // wiggle animation when user clicks
  &.isWiggling {
    animation: shakeX 1s ease;
  }

  // list item
  &__item {
    position: relative;
    z-index: 2;
    display: flex;
    flex: 1;

    // ::v-deep &.is-active:not(.is-hovered) .abacus__link {
    &.is-active:not(.is-hovered) .abacus__link {
      color: hsla(var(--b-h), var(--b-s), var(--b-l), 100%);
    }

    &.is-hovered :deep(.abacus__link),
    &.is-active :deep(.abacus__link) {
      color: hsla(var(--f-h), var(--f-s), var(--f-l), 100%);
    }
  }

  // nuxt-link

  &__link {
    /* Display & Box Model */
    display: flex;
    justify-content: center;
    flex: 1;
    padding-top: var(--button-click-offset);
    padding-bottom: var(--button-click-offset);

    /* Color */
    color: hsla(var(--b-h), var(--b-s), var(--b-l), 100%);

    /* Text */
    font-family: var(--mono);
    line-height: var(--button-height);
    text-transform: uppercase;
    text-decoration: none;
    text-align: center;
    font-size: 12px;
    font-feature-settings: 'ss04', 'ss05', 'ss06', 'ss07';
    @media (min-width: $navBreakpoint) {
      font-size: calc-vw(12px, $navBreakpoint);
      line-height: calc-leading(36px, 12px);
    }

    &:focus-visible {
      outline-offset: -4px;
      outline: 4px solid var(--a11y-color);
    }

    @include transition {
      transition: color var(--transition-page);
    }

    abbr {
      text-decoration: none;
    }
  }

  // span inside &__link
  &__text {
    @extend .t-mono;
    position: relative;
    top: 0.02em;

    > .--full {
      display: none;

      @include bp(1920px) {
        display: block;
      }
    }

    > .--abbr {
      display: block;

      @include bp(1920px) {
        display: none;
      }
    }
  }

  // background
  &__row {
    position: absolute;
    z-index: 0;
    top: var(--button-click-offset);
    left: 0;
    right: 0;
    height: var(--button-height);
    border-radius: 100vw;
    pointer-events: none;
    background-color: hsla(var(--f-h), var(--f-s), var(--f-l), 100%);
    width: 100%;
    box-shadow: 0 1.3px 5.3px rgba(0, 0, 0, 0.061),
      0 4.5px 17.9px rgba(0, 0, 0, 0.089), 0 20px 80px rgba(0, 0, 0, 0.15);

    @include transition {
      transition: background-color var(--transition-page);
    }
  }

  // active/hover element background
  &__bead {
    position: absolute;
    height: var(--button-height);
    border-radius: var(--button-height);
    z-index: 1;
    top: var(--button-click-offset);
    left: 0;
    background-color: hsla(var(--b-h), var(--b-s), var(--b-l), 100%);
    pointer-events: none;
    border: 4px solid hsla(var(--f-h), var(--f-s), var(--f-l), 100%);
    // transform-origin: top;

    @include transition {
      transition: background-color var(--transition-page),
        transform var(--trans-medium) var(--ease-back),
        opacity var(--transition-page), border-color var(--transition-page);
    }
  }
}

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
