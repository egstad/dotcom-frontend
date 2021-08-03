<template>
  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <div v-if="menuIsOpen" class="site-menu">
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
      tl: gsap.timeline(),
      links: [
        {
          title: '#All',
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
          path: '/work/development'
        },
        {
          title: '#Illustration',
          abbr: '#Illo',
          path: '/testing-page'
        }
        // {
        //   title: '#Development',
        //   abbr: '#Devl',
        //   path: '/work/development'
        // },
        // {
        //   title: '#Typography',
        //   abbr: '#Type',
        //   path: '/work/development'
        // },
        // {
        //   title: '#Illustration',
        //   abbr: '#Illo',
        //   path: '/testing-page'
        // }
      ]
    }
  },
  computed: {
    largeBreakpoint() {
      return this.$store.state.device.winWidth >= 375
    },
    menuIsOpen() {
      return this.$store.state.menuIsOpen
    },
    hideAnimations() {
      return this.$store.state.device.hideAnimations
    }
  },
  mounted() {
    document.body.style.overflowY = 'hidden'
  },
  beforeDestroy() {
    document.body.style.overflowY = ''
    this.tl.kill()
  },
  methods: {
    beforeEnter(el) {
      this.$store.commit('setMenuTransitionState', true)
      // hide element
      this.tl.set(el, {
        y: this.$store.state.device.winHeight
      })

      // hide links
      this.tl.set(this.$refs.item, {
        opacity: 0,
        y: this.$store.state.device.winHeight * 0.15
      })
    },
    enter(el, done) {
      // show nav
      this.tl.to(el, {
        y: 0,
        duration: this.hideAnimations ? 0 : 1,
        ease: 'Power4.easeInOut',
        onComplete: done
      })

      gsap.to(this.$refs.item, {
        delay: this.hideAnimations ? 0 : 0.6,
        opacity: 1,
        y: 0,
        stagger: this.hideAnimations ? 0 : 0.15,
        duration: this.hideAnimations ? 0 : 0.5,
        ease: 'back.out(1.5)'
      })
    },
    afterEnter() {
      this.$store.commit('setMenuTransitionState', false)
    },
    leave(el, done) {
      this.$store.commit('setMenuTransitionState', true)

      // hide menu
      this.tl.to(el, {
        y: -this.$store.state.device.winHeight,
        duration: this.hideAnimations ? 0 : 1,
        ease: 'Power4.easeInOut',
        onComplete: done
      })
    },
    afterLeave() {
      this.$store.commit('setMenuTransitionState', false)
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
  /* Display & Box Model */
  display: grid;
  grid-template-rows: 1fr var(--header-height);
  width: 100vw;
  height: 100vh;
  /* Color */
  background-color: var(--background);
}

.menu__list {
  /* Positioning */
  /* Display & Box Model */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: var(--header-height);
  padding: calc(var(--header-height) * 0.25) 0;

  /* Color */
  /* Text */
  /* Other */
}

.menu__item {
  opacity: 0;
}

.menu__link {
  /* Display & Box Model */
  display: block;
  padding: 0.6em 1.2em;
  border-radius: 100vw;

  /* Color */
  background-color: hsla(var(--b-h), var(--b-s), calc(var(--b-l) - 7%), 100%);
  /* Text */
  font-size: clamp(32px, 5vh, 96px);
  margin: 0.125em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--foreground);

  @media screen and (min-height: 600px) {
    font-size: clamp(28px, 5vmin, 200px);
  }

  @include transition {
    transition: color var(--trans-short) var(--ease),
      background-color var(--trans-short) var(--ease);
  }

  &:hover,
  &:focus-visible {
    color: var(--background);
    background-color: var(--foreground);
  }

  &.nuxt-link-exact-active {
    background-color: var(--foreground);
    color: var(--background);
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
  /* Color */
  /* Text */
  line-height: var(--header-height);
  /* Other */
}
</style>
