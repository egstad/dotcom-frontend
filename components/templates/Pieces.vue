<template>
  <section class="pieces">
    <ul class="pieces__list">
      <template v-for="(piece, pieceIndex) in pieces">
        <Piece
          :key="piece._id"
          :piece="piece"
          :class="[
            {
              'extra-padding':
                pieceIndex === 0 && pieces[pieceIndex].size === 'full'
            },
            {
              'no-border':
                pieces[pieceIndex + 1] && pieces[pieceIndex + 1].size === 'full'
            }
          ]"
        />
        <!-- <pre v-if="pieces[pieceIndex + 1]" :key="piece._id + 'pre'">{{
          pieces[pieceIndex + 1].size
        }}</pre> -->
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
  width: 100vw;

  &__list {
    counter-reset: pieces;

    > .piece {
      counter-increment: piece;
    }
  }
}
</style>
