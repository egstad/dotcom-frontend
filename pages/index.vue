<template>
  <div class="container">
    <h1>Hello World, it me</h1>

    <Slices :slices="document.content.slices"></Slices>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import Slices from '@/components/templates/Slices'
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'
// import gsap from gsap;

export default {
  components: {
    Slices
  },
  mixins: [routeTransitionFade],
  asyncData({ $sanity }) {
    const query = groq`{ "document": *[_type == "piece"][0] }`

    return $sanity.fetch(query)
  },
  head() {
    return this.$setPageMetadata(this.document.content)
  },
  created() {
    this.$store.commit('setTheme', {
      background: '#ffffff',
      foreground: '#000000',
      accent: '#000000'
    })
  },
  mounted() {
    // console.log()
  }
}
</script>
