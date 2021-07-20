<template>
  <div class="container">
    <Slices :slices="document.content.slices"></Slices>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import Slices from '@/components/templates/Slices'
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'
import { hsla } from '@/assets/js/utils/SanityHSL'

export default {
  components: {
    Slices
  },
  mixins: [routeTransitionFade],
  async asyncData({ $sanity, params, isDev, error }) {
    const uid = params.id
    // query looks so odd because we're fetching internal link slugs
    const query = groq`*[content.slug.current == "${uid}"][0]{
      ...,
      content {
        ...,
        slices[] {
          ...,
          content[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": @.item->content.slug
              }
            }
          }
        }
      }
    }`
    const data = await $sanity.fetch(query).then((res) => {
      if (!res) {
        error({ statusCode: 404, message: `Document '${uid}' doesn't exist` })
      } else {
        return res
      }
    })

    return {
      document: data
    }
  },
  head() {
    return this.$setPageMetadata(this.document.content)
  },
  created() {
    if (process.client) {
      const theme = this.document.content.theme
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

<style lang="scss" scoped>
.container {
  margin-top: calc(10vmax + 10vmin);
}
</style>
