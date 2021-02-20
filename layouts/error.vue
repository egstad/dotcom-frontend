<template>
  <div>
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-else>An error occurred</h1>
    <h2 v-if="error.message">{{ error.message }}</h2>
    <NuxtLink to="/">Home page</NuxtLink>
  </div>
</template>

<script>
export default {
  // you can set a custom layout for the error page
  layout: 'default',
  props: {
    error: {
      type: Object,
      required: true
    }
  }
  // beforeMount() {
  //   this.handleMemeGenerator()
  // },
  // methods: {
  //   handleMemeGenerator() {
  //     const isMemeRoute = this.$route.fullPath.startsWith('/is/')
  //     if (isMemeRoute) {
  //       const route = this.$route.fullPath
  //         .replace('/is/', '')
  //         .split('/')
  //         .join('-')
  //       this.$router.push({ path: `/is/${route}` })
  //     }
  //   }
  // }
}
</script>
