<template>
  <div class="container">
    <h1>Hello World, it me</h1>

    <Slices :slices="document.content.slices"></Slices>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import Slices from '@/components/templates/Slices'

export default {
  components: {
    Slices
  },
  asyncData({ $sanity }) {
    const query = groq`{ "document": *[_type == "piece"][0] }`

    return $sanity.fetch(query)
  }
  // head() {
  //   return this.$setPageMetadata(this.document.content)
  // }
}
</script>
