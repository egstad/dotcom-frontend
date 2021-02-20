<template>
  <div class="container">
    <h1>Hello World, it me</h1>
    <pre>{{ document }}</pre>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'

export default {
  asyncData({ $sanity }) {
    const query = groq`{ "document": *[_type == "page" && content.title == "Index"][0] }`

    return $sanity.fetch(query)
  },
  head() {
    return this.$setPageMetadata(this.document.content)
  }
}
</script>
