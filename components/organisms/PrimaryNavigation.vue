<template>
  <nav>
    <ul>
      <li v-for="link in links" :key="link.title">
        <nuxt-link :to="{ path: link.route }">{{ link.title }}</nuxt-link>
      </li>
      <li>
        <nuxt-link :to="{ path: '/is/a/bitch' }">test</nuxt-link>
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
