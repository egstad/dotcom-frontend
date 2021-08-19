<template>
  <div class="container">
    <header class="pieces__header">
      <h1 class="t-center text" :class="{ showNumber }" :data-count="count">
        <abbr class="abbr" :title="$route.params.id">
          <span
            v-for="(letter, index) in abbreviation"
            :key="index + 'abbr'"
            ref="abbr"
            >{{ letter }}</span
          >
        </abbr>
        <span class="full">
          <span
            v-for="(letter, index) in $route.params.id"
            :key="index + 'full'"
            ref="full"
            >{{ letter }}</span
          >
        </span>
      </h1>
    </header>
    <hr />
    <Pieces :pieces="document.content.pieces" />
  </div>
</template>

<script>
import Pieces from '@/components/templates/Pieces'
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'
import gsap from 'gsap'

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
      date: null,
      tl: gsap.timeline(),
      showNumber: false
    }
  },
  // head() {
  //   return this.$setPageMetadata(this.document.social)
  // },
  computed: {
    preferredTheme() {
      return this.$store.state.device.preferredTheme
    },
    abbreviation() {
      let val
      switch (this.$route.params.id) {
        case 'illustration':
          val = 'illo'
          break
        case 'design':
          val = 'dsgn'
          break
        case 'development':
          val = 'devl'
          break
        case 'typography':
          val = 'type'
          break
        default:
          break
      }

      return val
    },
    largeBreakpoint() {
      return this.$store.state.device.winWidth >= 1920
    }
  },
  mounted() {
    this.$nuxt.$emit('page::mounted')
    this.$nuxt.$on('window::scrollNearBottom', this.scrollHandler)

    // setTimeout(() => {
    this.$store.commit('setFilterVisibility', true)
    this.animateHeader()
    // }, 1000)
  },
  beforeDestroy() {
    this.$store.commit('setFilterVisibility', false)
    this.$nuxt.$off('window::scrollNearBottom', this.scrollHandler)
    this.tl.kill()
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
    },
    animateHeader() {
      let transOverCalled = false

      this.tl.fromTo(
        this.largeBreakpoint ? this.$refs.full : this.$refs.abbr,
        {
          opacity: 0,
          skewY: -5,
          y: -10,
          transformOrigin: '0% 50% -100%'
        },
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          delay: 0.5,
          duration: 0.5,
          ease: 'Power3.inOut',
          stagger: {
            each: this.largeBreakpoint ? 0.05 : 0.1
          },
          onUpdate: () => {
            // waiting until the end took too long,
            // this waits until animatino has hit 50%
            if (!transOverCalled && this.tl.progress() >= 0.8) {
              transOverCalled = true
              this.showNumber = true
            }
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
$padding: 12vmin;

.pieces__header {
  padding: 0 var(--button-click-offset);
  padding: $padding 0;
  padding-top: calc(
    var(--button-click-offset) * 2 + var(--button-height) + #{$padding}
  );
  text-transform: uppercase;
  display: flex;
  justify-content: center;

  .text {
    display: flex;
    font-size: 20vw;
    font-size: clamp(72px, 25vw, 335px);
    margin-left: -3%;
    // font-size: clamp(44px, 5vw, 132px);
    letter-spacing: -0.02em;
    font-variation-settings: 'wght' 1000;
    line-height: 1;
    position: relative;

    &::after {
      content: attr(data-count);
      font-variation-settings: 'wght' 100, 'MONO' 1000, 'ital' 0;
      // font-variation-settings: 'wght' 0;
      position: absolute;
      top: 0.84em;
      right: 0;
      transform: translateX(115%);
      font-size: 25%;
      letter-spacing: 0;
      line-height: 0;
      opacity: 0;

      @include transition {
        transition: opacity var(--trans-medium) var(--ease);
      }
    }

    &.showNumber::after {
      opacity: 1;
    }
  }

  .abbr {
    text-decoration: none;

    span {
      display: inline-block;
    }

    @include bp($navBreakpoint) {
      display: none;
    }
  }

  .full {
    text-transform: lowercase;
    letter-spacing: -0.04em;
    font-size: 20vw;
    font-size: clamp(72px, 15vw, 335px);

    span {
      display: inline-block;
    }

    @include bp($navBreakpoint, max-width) {
      display: none;
    }
  }
}

hr {
  display: block;
  width: calc(100% - var(--button-click-offset) * 2);
  margin: 0;
  margin-left: var(--button-click-offset);
  margin-bottom: var(--button-click-offset);
  border: 0;
  border-bottom: 1px solid var(--foreground);
}
</style>
