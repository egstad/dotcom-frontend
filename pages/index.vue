<template>
  <div class="container">
    <Slices
      v-for="piece in pieces"
      :key="piece._id"
      :slices="piece.content.slices"
    ></Slices>
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
  async asyncData({ $sanity }) {
    const queryPieces = groq`*[_type == "piece"] | order(order desc) { _id, content }`
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
