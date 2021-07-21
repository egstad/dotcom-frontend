<template>
  <div class="container">
    <Pieces :pieces="pieces" />
    <!-- <pre>{{ pieces }}</pre> -->
    <button @click="fetchNextPage">next</button>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import Pieces from '@/components/templates/Pieces'
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'
import { hsla } from '@/assets/js/utils/SanityHSL'

// import gsap from gsap;

export default {
  components: {
    Pieces
  },
  mixins: [routeTransitionFade],
  async asyncData({ $sanity }) {
    const queryLength = 5
    const queryPieces = groq`*[_type == "piece"] | order(order asc)[0...${queryLength}] { _id, content }`
    const queryIndex = groq`*[_type=='page' && content.slug.current=='index'][0]`

    return {
      queryLength,
      lastQuery: queryLength,
      page: await $sanity.fetch(queryIndex),
      pieces: await $sanity.fetch(queryPieces)
    }
  },
  data() {
    return {
      nextQuery: 0,
      currentlyFetching: false
    }
  },
  head() {
    return this.$setPageMetadata(this.page.content)
  },
  created() {
    if (process.client) {
      const theme = this.page.content.theme
      this.$store.dispatch('updateTheme', {
        background: hsla(theme.background.hsl),
        foreground: hsla(theme.foreground.hsl),
        accent: hsla(theme.accent.hsl)
      })
    }
  },
  mounted() {
    this.$nuxt.$on('window::scrollNearBottom', this.scrollHandler)
    this.$nuxt.$emit('page::mounted')
  },
  beforeDestroy() {
    this.$nuxt.$off('window::scrollNearBottom', this.scrollHandler)
  },
  methods: {
    scrollHandler(ev) {
      if (!this.currentlyFetching) this.fetchNextPage()
    },
    async fetchNextPage() {
      console.log('fetch')
      // update vars for next query
      this.lastQuery = this.pieces.length
      this.nextQuery = this.lastQuery + this.queryLength
      this.currentlyFetching = true
      // console.log(this.);
      // fetch items from sanity
      const query = groq`
        *[_type == "piece"] | order(order asc)
          [${this.lastQuery}...${this.nextQuery}]
          { _id, content }`
      const nextPosts = await this.$sanity.fetch(query)

      // add items to array
      this.pieces.push(...nextPosts)
      this.currentlyFetching = false
      console.log('fetched', this.pieces.length)
    }
  }
}
</script>
