<template>
  <div class="container">
    <header class="pieces__header">
      <h1 class="t-center">
        <span>#</span>{{ $route.params.id }}<span>{{ count }}</span>
      </h1>
    </header>
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
  async asyncData({ $sanityClient, params, store }) {
    const uid = params.id
    const queryLength = 10
    const queryCount = `count(*[_type == "work"][0].content.pieces[("${uid}" in data->tags[]->tagName)])`
    const query = `
      *[_type == "work"][0]{
        content {
          pieces[("${uid}" in data->tags[]->tagName)][0...${queryLength}] {
            ...,
            "title": data->title,
            "titleOverride": title,
            "date": data->date,
            "tags": data->tags,
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
    const document = await $sanityClient.fetch(query)
    const count = await $sanityClient.fetch(queryCount)
    // const theme = {
    //   background: document.theme.background,
    //   foreground: document.theme.foreground,
    //   accent: document.theme.accent
    // }

    store.commit('setCSSVars', 'light')

    return {
      hasMorePostsToLoad: document.content.pieces.length >= queryLength,
      // theme,
      count,
      queryLength,
      document
    }
  },
  data() {
    return {
      nextQuery: 0,
      currentlyFetching: false,
      date: null
    }
  },
  // head() {
  //   return this.$setPageMetadata(this.document.social)
  // },
  computed: {
    preferredTheme() {
      return this.$store.state.device.preferredTheme
    }
  },
  mounted() {
    this.$nuxt.$emit('page::mounted')
    this.$nuxt.$on('window::scrollNearBottom', this.scrollHandler)

    // setTimeout(() => {
    this.$store.commit('setFilterVisibility', true)
    // }, 1000)
  },
  beforeDestroy() {
    this.$store.commit('setFilterVisibility', false)
    this.$nuxt.$off('window::scrollNearBottom', this.scrollHandler)
  },
  methods: {
    scrollHandler(ev) {
      if (this.currentlyFetching || !this.hasMorePostsToLoad) return

      this.fetchNextPage()
    },
    async fetchNextPage() {
      this.lastQuery = this.document.content.pieces.length
      this.nextQuery = this.lastQuery + this.queryLength
      this.currentlyFetching = true

      // fetch items from sanity
      const query = `
        *[_type == "work"][0]{
          content {
            pieces[("${this.$route.params.id}" in data->tags[]->tagName)][${this.lastQuery}...${this.nextQuery}] {
              ...,
              "title": data->title,
              "titleOverride": title,
              "date": data->date,
              "tags": data->tags,
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

      const nextPosts = await this.$sanityClient.fetch(query)

      // determine if there are more posts to load or not
      if (nextPosts.content.pieces.length === 0) {
        this.hasMorePostsToLoad = false
      }

      // add items to array
      this.document.content.pieces.push(...nextPosts.content.pieces)
      this.currentlyFetching = false
    }
  }
}
</script>

<style lang="scss" scoped>
.pieces__header {
  border-bottom: 1px solid #000;
  border-top: 1px solid #000;
  width: calc(100% - var(--button-click-offset) * 2);
  margin: calc(var(--button-click-offset) * 2 + var(--button-height)) auto 0;
  padding: 15vmin 0;

  span {
    font-variation-settings: 'wght' 0;
  }

  h1 {
    font-size: clamp(44px, 5vw, 132px);
    font-variation-settings: 'wght' 1000;
    line-height: 0;
  }
}
</style>
