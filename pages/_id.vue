<template>
  <div class="container">
    <Slices :slices="document.content"></Slices>
  </div>
</template>

<script>
import Slices from '@/components/templates/Slices'
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'

export default {
  components: {
    Slices
  },
  mixins: [routeTransitionFade],
  async asyncData({ $sanityClient, params, error, store }) {
    const uid = params.id
    // query looks so odd because we're fetching internal link slugs
    const query = `
      *[slug.current == "${uid}"][0]{
        _id,
        title,
        theme{
  			  "accent": accent.hsl,
          "background": background.hsl,
          "foreground": foreground.hsl,
				},
        "content": content[]{
          ...,
          text[] {
          	...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": @.item->slug.current,
                "title": @.item->title
              }
            }
          },
          "paletteVideo": poster.asset->metadata.palette,
          "paletteImage": asset->metadata.palette,
          "slides": slides[]{
            ...,
            "paletteImage":asset->metadata.palette
          }
        },
        social,
      }`
    const document = await $sanityClient.fetch(query).then((res) => {
      if (!res) {
        error({ statusCode: 404, message: `Document '${uid}' doesn't exist` })
      } else {
        return res
      }
    })

    // set theme
    await store.commit('setCSSVars', {
      background: document.theme.background,
      foreground: document.theme.foreground,
      accent: document.theme.accent
    })

    return {
      document
    }
  },
  head() {
    return this.$setPageMetadata(this.document.social)
  },
  mounted() {
    this.$nuxt.$emit('page::mounted')
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: calc(10vmax + 10vmin);
}
</style>
