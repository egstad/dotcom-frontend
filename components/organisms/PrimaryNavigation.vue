<template>
  <nav>
    <ul>
      <li v-for="link in links" :key="link.title">
        <nuxt-link :to="link.route">{{ link.title }}</nuxt-link>
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
          title: 'index',
          route: '/'
        },
        {
          title: 'profile',
          route: 'profile'
        },
        {
          title: 'contact',
          route: 'contact'
        }
      ]
    }
  }
}
</script>
