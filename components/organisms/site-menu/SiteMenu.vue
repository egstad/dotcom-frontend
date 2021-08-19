<template>
  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <div
      v-show="menuIsOpen"
      class="site-menu"
      role="dialog"
      aria-label="Filter work by category. To close this modal, press Escape."
      :aria-modal="menuIsOpen"
    >
      <ul class="menu__list">
        <li v-for="(link, i) in links" :key="i" ref="item" class="menu__item">
          <nuxt-link ref="link" class="menu__link" :to="link.path">
            <template v-if="link.abbr">
              <span v-if="largeBreakpoint">{{ link.title }}</span>
              <abbr v-else :title="link.title">{{ link.abbr }}</abbr>
            </template>
            <template v-else>
              {{ link.title }}
            </template>
          </nuxt-link>
        </li>
      </ul>

      <footer class="menu__footer">
        <p>Thanks for looking!</p>
        <p>&copy;2010-{{ new Date().getFullYear() }}</p>
      </footer>
    </div>
  </transition>
</template>

<script>
import gsap from 'gsap'

export default {
  data() {
    return {
      tl: null,
      trappedEls: null,
      trappedFirst: null,
      trappedLast: null,
      trappedToggle: null,
      trappedCurrentIndex: null,
      links: [
        {
          title: 'All',
          path: '/work'
        },
        {
          title: '#Design',
          abbr: '#Dsgn',
          path: '/work/design'
        },
        {
          title: '#Development',
          abbr: '#Devl',
          path: '/work/development'
        },
        {
          title: '#Typography',
          abbr: '#Type',
          path: '/work/typography'
        },
        {
          title: '#Illustration',
          abbr: '#Illo',
          path: '/work/illustration'
        }
      ]
    }
  },
  computed: {
    largeBreakpoint() {
      return this.$store.state.device.winWidth >= 375
    },
    hideAnimations() {
      return this.$store.state.device.hideAnimations
    },
    menuIsOpen() {
      return this.$store.state.menuIsOpen
    }
  },
  watch: {
    menuIsOpen(isOpen) {
      if (isOpen) {
        document.documentElement.style.overflow = 'hidden'
        this.trapInit()
      } else {
        document.documentElement.style.overflow = ''
        this.trapDestroy()
      }
    }
  },
  mounted() {
    this.trapGetEls()
  },
  beforeDestroy() {
    if (this.tl) this.tl.kill()
  },
  methods: {
    beforeEnter(el) {
      this.tl = gsap.timeline()
      this.$store.commit('setMenuTransitionState', true)

      if (this.hideAnimations) return

      // hide element
      this.tl.set(el, {
        // y: '100%',
        opacity: 0
      })

      // hide links
      this.tl.set(this.$refs.item, {
        opacity: 0,
        y: this.$store.state.device.winHeight * 0.15
      })
    },
    enter(el, done) {
      this.tl
        // animate menu into place
        .to(
          el,
          {
            // y: 0,
            opacity: 1,
            duration: this.hideAnimations ? 0 : 1,
            ease: 'Power4.easeInOut',
            onComplete: done
          },
          'menuShow'
        )
        // stagger menu items into place
        .to(
          this.$refs.item,
          {
            delay: this.hideAnimations ? 0 : 0.6,
            opacity: 1,
            y: 0,
            stagger: this.hideAnimations ? 0 : 0.15,
            duration: this.hideAnimations ? 0 : 0.5,
            ease: 'back.out(1.5)'
          },
          'menuShow'
        )
    },
    afterEnter() {
      this.$store.commit('setMenuTransitionState', false)
    },
    leave(el, done) {
      this.$store.commit('setMenuTransitionState', true)

      // hide menu
      this.tl.to(el, {
        // y: '-100%',
        opacity: 0,
        duration: this.hideAnimations ? 0 : 1,
        ease: 'Power4.easeInOut',
        onComplete: done
      })
    },
    afterLeave() {
      this.$store.commit('setMenuTransitionState', false)
      this.tl.kill()
    },
    trapGetEls() {
      // fetch all tabbable links
      const filters = this.$refs.link.map((component) => component.$el)
      // include the menu toggle
      const toggle = this.$parent.$el.querySelector('.menu-toggle')
      // include menu links
      const nav = this.$parent.$el.querySelectorAll(
        '.nav__primary .abacus__link'
      )

      this.trappedToggle = toggle
      this.trappedEls = [toggle, ...filters, ...nav]

      // Save the first and last focusable elements
      this.trappedFirst = this.trappedEls[0]
      this.trappedLast = this.trappedEls[this.trappedEls.length - 1]
    },
    trapInit() {
      window.addEventListener('keydown', this.onKeydown)
      this.trappedCurrentIndex = 0
    },
    trapDestroy() {
      window.removeEventListener('keydown', this.onKeydown)
      this.trappedToggle.focus()
    },
    onKeydown(ev) {
      const isTabPressed = ev.key === 'Tab' || ev.keyCode === 9
      const isEscPressed = ev.key === 'Escape'

      if (isEscPressed) {
        this.menuClose()
        return
      }

      if (!isTabPressed) {
        return
      }

      ev.preventDefault()

      if (ev.shiftKey) {
        if (document.activeElement === this.trappedFirst) {
          this.trappedCurrentIndex = this.trappedEls.length - 1
        } else {
          this.trappedCurrentIndex -= 1
        }
      }
      // tab was pressed at the last element
      else if (document.activeElement === this.trappedLast) {
        this.trappedCurrentIndex = 0
      }
      // default tab press
      else {
        this.trappedCurrentIndex += 1
      }

      this.trappedEls[this.trappedCurrentIndex].focus()
    },
    menuClose() {
      this.$store.commit('setMenuVisibility', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.site-menu {
  --header-height: calc(
    var(--button-height) + (var(--button-click-offset) * 2)
  );
  /* Positioning */
  position: fixed;
  z-index: 19;
  top: 0;
  left: 0;
  overflow-y: auto;
  backdrop-filter: blur(clamp(2em, 2vw, 8em)) brightness(80%) saturate(200%);
  /* Display & Box Model */
  display: grid;
  grid-template-rows: 1fr var(--header-height);
  width: 100vw;
  height: 100vh;
  height: -webkit-fill-available;
  /* Color */
  background-color: hsla(var(--b-h), var(--b-s), var(--b-l), 50%);
  /* Other */
  overscroll-behavior: contain;
}

.menu__list {
  /* Display & Box Model */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: var(--header-height);
  padding: calc(var(--header-height) * 0.25) 0;
}

.menu__link {
  /* Display & Box Model */
  display: block;
  padding: 0.6em 1.2em;
  border-radius: 100vw;
  outline-offset: 0.1em;
  /* Color */
  background-color: var(--foreground);
  color: var(--background);
  /* Text */
  font-size: clamp(32px, 5vh, 96px);
  margin: 0.25em;
  text-transform: uppercase;
  text-decoration: none;
  font-variation-settings: 'wght' 300, 'MONO' 1000, 'ital' 0;
  letter-spacing: 0.05em;

  @media screen and (min-height: 600px) {
    font-size: clamp(28px, 5vmin, 200px);
  }

  @include transition {
    transition: color var(--trans-short) var(--ease),
      background-color var(--trans-short) var(--ease);
  }

  &:hover,
  &:focus-visible {
    background-color: var(--background);
    color: var(--foreground);
  }

  &:focus-visible {
    outline-offset: 4px;
    outline: 4px solid var(--a11y-color);
  }

  &.nuxt-link-exact-active {
    background-color: var(--background);
    color: var(--foreground);
  }

  > abbr {
    text-decoration: none;
  }
}

.menu__footer {
  /* Display & Box Model */
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding-left: calc(var(--button-click-offset) * 1.5);
  padding-right: calc(var(--button-click-offset) * 1.5);
  font-size: 12px;
  text-transform: uppercase;
  /* Text */
  line-height: var(--header-height);
  /* Other */
}
</style>
