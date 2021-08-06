<template>
  <section class="pieces">
    <ul class="pieces__list">
      <template v-for="piece in pieces">
        <Piece :key="piece._id" :piece="piece" />
      </template>
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

<style lang="scss">
// initialize css counter
// tick for every list item
// for more, check out <Piece/>
.pieces {
  &__list {
    counter-reset: pieces;

    > .piece {
      counter-increment: piece;
    }
  }
}
</style>
