<template>
  <nav class="nav-primary">
    <ul class="nav-primary__list">
      <li v-for="link in links" :key="link.title" class="nav-primary__item">
        <nuxt-link class="nav-primary__link" :to="{ path: link.route }">{{
          link.title
        }}</nuxt-link>
      </li>
      <li>{{ this.height }}</li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      height: null,
      scrollSpeedOffset: 4,
      posY: undefined,
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
    this.height = this.setHeight()

    window.addEventListener('scrollY', this.scrollY)
  },
  methods: {
    scrollY(ev) {
      if (ev.detail) this.scrollY = ev.detail.y

      if (this.scrollY < this.height) {
        this.posY = Math.round(this.scrollY)
        this.$el.style.transform = this.setTransform(this.posY)
      }
    },
    setTransform(y) {
      return `translate3d(0,-${this.posY * 0.5}px,0)`
    },
    setHeight() {
      return Math.round(
        this.$el.getBoundingClientRect().height * this.scrollSpeedOffset
      )
    }
  }
}
</script>

<style>
.nav-primary {
  position: fixed;
  /* transition: transform 100ms ease-out; */
  font-size: 1em;
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
  background: #555;
  color: white;
  margin-right: 0.4em;
  text-decoration: none;
}

.nuxt-link-exact-active {
  background: #000;
}
</style>
