<template>
  <Grid tag="article" class="piece" v-bind="gridProps">
    <Column v-bind="colProps" class="piece__wrap" tabindex="0">
      <header class="piece__header" :class="headerClasses">
        <Type tag="h2" :size="1" class="piece__title">{{ title }}</Type>
      </header>
      <Slices :slices="[content]" class="piece__content"></Slices>
    </Column>
  </Grid>
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
  },
  computed: {
    size() {
      return this.piece.size
    },
    content() {
      return this.piece.content
    },
    title() {
      return this.piece.titleOverride
        ? this.piece.titleOverride
        : this.piece.title
    },
    colProps() {
      switch (this.size) {
        case 'small':
          return {
            sm: 6,
            xl: 5,
            xx: 4
          }
        case 'medium':
          return {
            sm: 8,
            xl: 7,
            xx: 6
          }
        case 'large':
          return {
            sm: 10
          }
        case 'xlarge':
          return {}
        case 'full':
          return {
            padding: false
          }
        default:
          break
      }

      return null
    },
    gridProps() {
      return this.size === 'full' ? { padding: false } : null
    },
    headerClasses() {
      return this.size === 'full' ? 'padded' : null
    }
  }
}
</script>

<style lang="scss">
.piece {
  position: relative;

  &__wrap {
    display: flex;
    flex-direction: column;
  }

  &__header {
    order: 2;
  }

  &__title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    &::before {
      content: counter(piece);
    }
  }
}
</style>
