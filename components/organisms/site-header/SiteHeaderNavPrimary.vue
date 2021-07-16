<template>
  <nav class="header-nav">
    <ul class="header-nav__list" align-items="start">
      <li v-for="(link, linkIndex) in links" :key="linkIndex">
        <Type class="header-nav__item" :size="2">
          <nuxt-link class="header-nav__link" :to="{ path: link.route }">
            {{ link.title }}
          </nuxt-link>
        </Type>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      links: [
        {
          title: 'Work',
          route: '/'
        },
        {
          title: 'Profile',
          route: '/profile'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
// .nav-primary {}

.header-nav__list {
  list-style-type: none;
  display: flex;
  flex-direction: row;
}

.header-nav__link {
  display: inline-block;
  color: var(--foreground);
  text-decoration: none;
  opacity: 0.5;
  transition: color var(--time) var(--ease),
    opacity calc(var(--time) * 0.5) var(--ease);
  text-transform: lowercase;
  padding: 0.6em 0;
  margin-left: 1.2em;

  html.is-touch & {
    padding: 0.4em 0;
  }

  &:hover {
    opacity: 1;
  }
}

.nuxt-link-exact-active {
  opacity: 1;
}
</style>
