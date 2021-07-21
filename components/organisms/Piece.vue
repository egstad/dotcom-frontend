<template>
  <article class="piece">
    <header class="piece__header">
      <h2>{{ piece.content.title }}</h2>
    </header>

    <Slices :slices="piece.content.slices" class="piece__content"></Slices>
  </article>
</template>

<script>
import Slices from '@/components/templates/Slices'

export default {
  components: {
    Slices
  },
  props: {
    piece: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.piece {
  position: relative;
  border-bottom: 1px solid #000;
  display: grid;
  grid-template-rows: 1fr 44px;
}

.piece__header {
  order: 2;
}
</style>
