<template>
  <div class="container">
    <h1>
      Hello World, i'm the
      <pre>_id.vue</pre>
      page.
    </h1>
    <pre>{{ document }}</pre>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'

export default {
  async asyncData({ $sanity, params }) {
    const uid = params.id
    const query = groq`{"document": *[_type == "page" && slug.current == "${uid}"][0]}`
    const data = await $sanity.fetch(query)

    return data
  }
}
</script>
