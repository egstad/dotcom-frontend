<template>
  <div class="container">
    <section>
      <header class="header">
        <Logo class="logo" />
        <Bio class="bio" />
      </header>
    </section>
    <Details />
    <Colophon />
    <Egg />
  </div>
</template>

<script>
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'
import Egg from '@/components/organisms/pages/homepage/Egg'
import Logo from '@/components/organisms/pages/homepage/Logo'
import Bio from '@/components/organisms/pages/homepage/Bio'
import Details from '@/components/organisms/pages/homepage/Details'
import Colophon from '@/components/organisms/pages/homepage/Colophon'

export default {
  components: {
    Egg,
    Logo,
    Bio,
    Details,
    Colophon
  },
  mixins: [routeTransitionFade],
  async asyncData({ $sanityClient, store }) {
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
    const document = await $sanityClient.fetch(query)

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
  data() {
    return {
      links: [
        {
          title: 'Egstad',
          path: '/'
        },
        {
          title: 'Work',
          path: 'work'
        },
        {
          title: 'About',
          path: 'profile'
        },
        {
          title: 'Egstad',
          path: '/'
        },
        {
          title: 'Work',
          path: 'work'
        },
        {
          title: 'About',
          path: 'profile'
        }
      ]
    }
  },

  head() {
    return this.$setPageMetadata(this.document.social)
  },
  mounted() {
    this.$nuxt.$emit('animate::logo')

    this.$nuxt.$emit('page::mounted')
  }
}
</script>

<style lang="scss" scoped>
.container {
  flex: 1;
  align-self: flex-end;
  // background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/2560px-President_Barack_Obama.jpg');
  // background-size: cover;
}
</style>
