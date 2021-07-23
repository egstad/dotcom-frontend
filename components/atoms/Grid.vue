<template>
  <component :is="tag" :style="style" :class="['grid', { padded: padding }]">
    <slot />
  </component>
</template>

<script>
export default {
  name: 'Grid',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    padding: {
      type: Boolean,
      default: true
    },
    xsColumns: {
      type: Number,
      required: false,
      default(val) {
        return val || 12
      }
    },
    smColumns: {
      type: Number,
      required: false,
      default(val) {
        return val || this.xsColumns
      }
    },
    mdColumns: {
      type: Number,
      required: false,
      default(val) {
        return val || this.smColumns
      }
    },
    lgColumns: {
      type: Number,
      required: false,
      default(val) {
        return val || this.mdColumns
      }
    },
    xlColumns: {
      type: Number,
      required: false,
      default(val) {
        return val || this.lgColumns
      }
    },
    xxColumns: {
      type: Number,
      required: false,
      default(val) {
        return val || this.xlColumns
      }
    },
    alignItems: {
      type: String,
      default: 'normal',
      validator: (prop) =>
        [
          'normal',
          'start',
          'end',
          'center',
          'stretch',
          'space-around',
          'space-between',
          'space-evenly',
          'baseline',
          'first baseline',
          'last baseline'
        ].includes(prop)
    }
  },
  computed: {
    breakpoint() {
      return this.$store.state.device.breakpoint
    },
    style() {
      const styles = []

      styles.push({ 'grid-template-columns': this.getGridColumns() })
      styles.push({ 'align-items': this.alignItems })

      return styles
    }
  },
  methods: {
    getGridColumns() {
      let columns = ''

      switch (this.breakpoint) {
        case 'xs':
          columns = this.xsColumns
          break
        case 'sm':
          columns = this.smColumns
          break
        case 'md':
          columns = this.mdColumns
          break
        case 'lg':
          columns = this.lgColumns
          break
        case 'xl':
          columns = this.xlColumns
          break
        case 'xx':
          columns = this.xxColumns
          break
        default:
          break
      }
      return `repeat(${columns}, 1fr`
    }
  }
}
</script>

<style lang="scss">
$grid-gap: 16px;

.grid {
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: math.div($grid-gap, 2);

  @include bp($md) {
    grid-gap: calc-vw(math.div($grid-gap, 2), $md);
  }
}

// remove child padding
.grid .grid {
  padding-left: 0;
  padding-right: 0;
}

.padded {
  padding-left: $grid-gap;
  padding-right: $grid-gap;

  @include bp($md) {
    padding-left: calc-vw($grid-gap, $md);
    padding-right: calc-vw($grid-gap, $md);
  }
}
</style>
