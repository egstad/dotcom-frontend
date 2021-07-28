<template>
  <div class="container">
    <br /><br /><br /><br /><br /><br />
    <pre>{{ document }}</pre>
  </div>
</template>

<script>
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'
// import { hsla } from '@/assets/js/utils/SanityHSL'

export default {
  mixins: [routeTransitionFade],
  async asyncData({ $egstad, store }) {
    // fetch data
    const query = `
      *[_type == "homepage" && _id == "index"][0]{
        _id,
        title,
        theme{
  			  "accent": accent.hsl,
          "background": background.hsl,
          "foreground": foreground.hsl,
				},
        social,
        content {
          pieces[] {
            ...,
            "title": data->title,
            "titleOverride": title,
            size,
            "content": data->content[0] {
              ...,
              "paletteVideo": poster.asset->metadata.palette,
              "paletteImage": asset->metadata.palette,
              "slides": slides[]{
                ...,
                "paletteImage":asset->metadata.palette
              }
            }
          }
        }
      }
    `
    const document = await $egstad.fetch(query)

    // set theme
    await store.commit('setCSSVars', {
      background: document.theme.background,
      foreground: document.theme.foreground,
      accent: document.theme.accent
    })

    // let's go!
    return {
      document
    }
  },
  // async fetch({ $theme }) {
  // if (process.client) {
  //   const theme = this.document.theme
  //   console.log('theme', theme)
  //   await $theme.updateColor({
  //     background: hsla(theme.background.hsl),
  //     foreground: hsla(theme.foreground.hsl),
  //     accent: hsla(theme.accent.hsl)
  //   })
  // }
  // },
  head() {
    return this.$setPageMetadata(this.document.social)
  },
  // created() {
  //   if (process.client) {
  //     const theme = this.document.theme
  //     this.$store.dispatch('updateTheme', {
  //       background: hsla(theme.background.hsl),
  //       foreground: hsla(theme.foreground.hsl),
  //       accent: hsla(theme.accent.hsl)
  //     })
  //   }
  // },
  mounted() {
    this.$nuxt.$emit('page::mounted')
  }
}
</script>
