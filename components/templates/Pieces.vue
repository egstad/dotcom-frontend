<template>
  <section class="pieces">
    <Grid class="pieces__list" tag="ul">
      <Column
        v-for="piece in pieces"
        :key="piece._id"
        class="piece"
        tag="li"
        :xs="3"
      >
        <Piece :piece="piece" />
      </Column>
    </Grid>
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
