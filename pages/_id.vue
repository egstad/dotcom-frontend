<template>
  <div class="container">
    <h1>
      Hello World, i'm the
      <pre>_id.vue</pre>
      page.
    </h1>
    <pre v-if="document">{{ document }}</pre>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'

export default {
  mixins: [routeTransitionFade],
  async asyncData({ $sanity, params, isDev, error }) {
    const uid = params.id
    const query = groq`*[_type == "page" && content.slug.current == "${uid}"][0]`
    const data = await $sanity.fetch(query).then((res) => {
      if (!res) {
        error({ statusCode: 404, message: `Document '${uid}' doesn't exist` })
      } else {
        return res
      }
    })

    return {
      document: data
    }
  },
  fetch() {
    this.$store.commit('setTheme', {
      background: '#0000ff',
      foreground: '#ffffff',
      accent: '#ffffff'
    })
  }
}
</script>
