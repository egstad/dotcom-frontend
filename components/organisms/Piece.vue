<template>
  <article class="piece">
    <header class="piece__header">
      <h2>{{ piece.content.title }}</h2>
    </header>
    <Slices :slices="piece.content.slices" class="piece__content"></Slices>

    <!-- <Theme :colors="piece.content.theme" fade-target="middle" /> -->
  </article>
</template>

<script>
import Slices from '@/components/templates/Slices'
// import Theme from '@/components/atoms/Theme'

export default {
  components: {
    Slices
    // Theme
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

/* wrapper for slices */
.piece >>> .piece__content {
  /* display: flex; */
  /* width: 100%; */
  /* height: 70vh; */
  /* min-height: 50vw; */
  /* padding-top: 44px; */
}

/* .piece >>> .pic,
.piece >>> .vid {
  object-fit: contain;
} */

.piece >>> .scroll-to-theme {
  position: absolute;
  top: 50%;
  left: 0;
}
</style>
