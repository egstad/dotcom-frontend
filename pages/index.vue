<template>
  <div class="container">
    <Grid>
      <!-- <Column :xs="12" :sm="10" :md="8" :lg="6" :xl="4" style="background: red"
        >hello world</Column
      > -->
      <!-- <Column v-for="(i, index) in 12" :key="index" :lg="4" :lg-start="4">{{
        i
      }}</Column> -->
      <Column :xs="6"
        >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis
        doloribus exercitationem voluptatum consequuntur, porro omnis eum
        consectetur maxime! Fuga porro quos architecto voluptas incidunt optio?
        Cupiditate odio quia eum maxime.</Column
      >
      <Column
        :xs="2"
        :xs-start="11"
        :lg="4"
        :lg-start="9"
        tag="section"
      ></Column>
    </Grid>

    <Pieces :pieces="pieces" />
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import Pieces from '@/components/templates/Pieces'
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'
// import gsap from gsap;

export default {
  components: {
    Pieces
  },
  mixins: [routeTransitionFade],
  async asyncData({ $sanity }) {
    const queryPieces = groq`*[_type == "piece"] | order(order asc) { _id, content }`
    const queryIndex = groq`*[_type=='page' && content.slug.current=='index'][0]`

    return {
      page: await $sanity.fetch(queryIndex),
      pieces: await $sanity.fetch(queryPieces)
    }
  },
  fetch() {
    const theme = this.page.content.theme
    this.$store.commit('setTheme', {
      background: theme.background,
      foreground: theme.foreground,
      accent: theme.accent
    })
  },
  head() {
    return this.$setPageMetadata(this.page.content)
  },
  mounted() {
    this.$nuxt.$emit('page::mounted')
  }
}
</script>
