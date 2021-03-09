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
// import Pic from '@/components/atoms/Pic'
// import Vid from '@/components/atoms/Vid'

export default {
  components: {
    Piece
    // Pic,
    // Vid
  },
  props: {
    pieces: {
      type: Array,
      required: true
    }
  }
}
</script>
