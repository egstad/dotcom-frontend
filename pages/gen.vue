<template>
  <div class="container">
    <pre>{{ document }}</pre>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import getPages from '../nuxtRoutes.js'

export default {
  async asyncData({ $sanity, params }) {
    const query = groq`{"document": *[_type == "page" && slug.current != "index"] {"slug": slug.current}}`
    const data = await $sanity.fetch(query)
    console.log(getPages)

    return data
  }
}
</script>
