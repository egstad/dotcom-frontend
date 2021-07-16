<template>
  <div class="container">
    <Pieces :pieces="pieces" />
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import Pieces from '@/components/templates/Pieces'
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'
// import gsap from gsap;

export default {
  components: {
    Pieces
  },
  mixins: [routeTransitionFade],
  async asyncData({ $sanity }) {
    const queryPieces = groq`*[_type == "piece"] | order(order asc) { _id, content }`
    const queryIndex = groq`*[_type=='page' && content.slug.current=='index'][0]`

    return {
      page: await $sanity.fetch(queryIndex),
      pieces: await $sanity.fetch(queryPieces)
    }
  },
  fetch() {
    const theme = this.page.content.theme
    this.$store.commit('setTheme', {
      background: theme.background,
      foreground: theme.foreground,
      accent: theme.accent
    })
  },
  head() {
    return this.$setPageMetadata(this.page.content)
  },
  mounted() {
    this.$nuxt.$emit('page::mounted')
  }
}
</script>
