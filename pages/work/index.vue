<template>
  <div class="container">
    <Pieces :pieces="document.content.pieces" />
  </div>
</template>

<script>
import Pieces from '@/components/templates/Pieces'
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'

export default {
  components: {
    Pieces
  },
  mixins: [routeTransitionFade],
  async asyncData({ $egstad, store }) {
    const queryLength = 1
    const query = `
      *[_type == "work"][0]{
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

    return {
      queryLength,
      document
    }
  },
  data() {
    return {
      nextQuery: 0,
      currentlyFetching: false,
      hasMorePostsToLoad: true,
      date: null
    }
  },
  head() {
    return this.$setPageMetadata(this.document.social)
  },
  mounted() {
    this.$nuxt.$emit('page::mounted')
  }
  // methods: {
  //   scrollHandler(ev) {
  //     if (!this.currentlyFetching) this.fetchNextPage()
  //   },
  //   async fetchNextPage() {
  //     if (this.hasMorePostsToLoad) {
  //       this.lastQuery = this.pieces.length
  //       this.nextQuery = this.lastQuery + this.queryLength
  //       this.currentlyFetching = true

  //       // fetch items from sanity
  //       const query = groq`
  //       *[_type == "piece"] | order(order asc)
  //         [${this.lastQuery}...${this.nextQuery}]
  //         { _id, content }`
  //       const nextPosts = await this.$sanity.fetch(query)

  //       // add items to array
  //       this.pieces.push(...nextPosts)
  //       this.currentlyFetching = false

  //       // determine if there are more posts to load or not
  //       if (nextPosts.length < this.queryLength) this.hasMorePostsToLoad = false
  //     }
  //   }
  // }
}
</script>

<style lang="scss" scoped>
pre {
  margin-top: 20vw;
}
</style>
