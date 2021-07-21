<template>
  <section class="pieces">
    <ul class="pieces__list">
      <li v-for="piece in pieces" :key="piece._id" class="piece">
        <Piece :piece="piece" />
      </li>
    </ul>
  </section>
</template>

<script>
import Piece from '@/components/organisms/Piece'

export default {
  components: {
    Piece
  },
  props: {
    pieces: {
      type: Array,
      required: true
    }
  }
}
</script>
