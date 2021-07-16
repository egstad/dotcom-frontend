<template>
  <div class="container">
    <Slices :slices="document.content.slices"></Slices>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import Slices from '@/components/templates/Slices'
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'

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
  fetch() {
    const theme = this.document.content.theme
    this.$store.commit('setTheme', {
      background: theme.background,
      foreground: theme.foreground,
      accent: theme.accent
    })
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
