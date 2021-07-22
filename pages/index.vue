<template>
  <div class="container">
    <pre>{{ document }}</pre>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'
import { hsla } from '@/assets/js/utils/SanityHSL'

export default {
  mixins: [routeTransitionFade],
  async asyncData({ $sanity }) {
    const query = groq`*[_type == "homepage" && _id == "index"][0]`

    return {
      document: await $sanity.fetch(query)
    }
  },
  head() {
    return this.$setPageMetadata(this.document)
  },
  created() {
    if (process.client) {
      const theme = this.document.theme
      this.$store.dispatch('updateTheme', {
        background: hsla(theme.background.hsl),
        foreground: hsla(theme.foreground.hsl),
        accent: hsla(theme.accent.hsl)
      })
    }
  },
  mounted() {
    this.$nuxt.$emit('page::mounted')
  }
}
</script>
