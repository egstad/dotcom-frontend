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
  async asyncData({ $sanityClient, store }) {
    const queryLength = 10
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
          pieces[0...${queryLength}] {
            ...,
            "title": data->title,
            "titleOverride": title,
            "date": data->date,
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
    const document = await $sanityClient.fetch(query)

    store.commit('setCSSVars', 'light')

    return {
      hasMorePostsToLoad: document.content.pieces.length >= queryLength,

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
  head() {
    return this.$setPageMetadata(this.document.social)
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
              pieces[${this.lastQuery}...${this.nextQuery}] {
                ...,
                "title": data->title,
                "titleOverride": title,
                "date": data->date,
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

      const nextPosts = await this.$sanityClient.fetch(query)

      // determine if there are more posts to load or not
      if (nextPosts.content.pieces.length === 0) {
        this.hasMorePostsToLoad = false
      }

      // add items to array
      this.document.content.pieces.push(...nextPosts.content.pieces)
      this.currentlyFetching = false

      this.$ga.event({
        eventCategory: 'Work Loaded',
        eventAction: 'scroll',
        eventLabel: `"${this.nextQuery}" items were loaded on the '/work' page`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// this class applies to the very first item, if it's size is full that is
::v-deep .extra-padding {
  margin-top: calc(var(--button-height) + var(--button-click-offset) * 2);

  @include bp($lg) {
    margin-top: 0;
  }
}
</style>
