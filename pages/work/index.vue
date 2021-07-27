<template>
  <div class="container">
    <pre>{{ date }}</pre>
    <Pieces :pieces="document.content.pieces" />
  </div>
</template>

<script>
import Pieces from '@/components/templates/Pieces'
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'
import { hsla } from '@/assets/js/utils/SanityHSL'

export default {
  components: {
    Pieces
  },
  mixins: [routeTransitionFade],
  async asyncData({ $egstad }) {
    const queryLength = 1
    const query = `*[_type == "work"][0]{
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
              "paletteImage": asset->metadata,
              ...,
            }
          }
        }
      }`

    return {
      queryLength,
      document: await $egstad.fetch(query)
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
  created() {
    // console.log(this.document)
    if (process.client) {
      const theme = this.document.theme
      this.$store.dispatch('updateTheme', {
        background: hsla(theme.background),
        foreground: hsla(theme.foreground),
        accent: hsla(theme.accent)
      })
    }
  },
  mounted() {
    // 'v2021-06-07'
    // this.date = `v${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()}`
    // this.$nuxt.$on('window::scrollNearBottom', this.scrollHandler)
    // this.$nuxt.$emit('page::mounted')
  }
  // beforeDestroy() {
  //   this.$nuxt.$off('window::scrollNearBottom', this.scrollHandler)
  // },
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
