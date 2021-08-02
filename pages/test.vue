<template>
  <div>{{ document }}</div>
</template>

<script>
export default {
  async asyncData({ $sanityClient }) {
    const query = `*[_type == "work"][0]{
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
              "paletteImage": asset->metadata,
              ...,
            }
          }
        }
      }`

    return {
      document: await $sanityClient.fetch(query)
    }
  },
  mounted() {
    this.$nuxt.$emit('page::mounted')
  }
}
</script>

<style lang="scss" scoped></style>
