<template>
  <nav class="nav-primary">
    <ul class="nav-primary__list">
      <li v-for="link in links" :key="link.title" class="nav-primary__item">
        <nuxt-link class="nav-primary__link" :to="{ path: link.route }">{{
          link.title
        }}</nuxt-link>
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
  }
}
</script>

<style>
.nav-primary__list {
  list-style-type: none;
  display: flex;
  padding: 0.4em;
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
