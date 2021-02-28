<template>
  <div class="container">
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
  fetch() {
    const theme = this.document.content.theme
    this.$store.commit('setTheme', {
      background: theme.background,
      foreground: theme.foreground,
      accent: theme.accent
    })
  },
  head() {
    return this.$setPageMetadata(this.document.content)
  },
  mounted() {
    this.$nuxt.$emit('page::mounted')
  }
}
</script>
