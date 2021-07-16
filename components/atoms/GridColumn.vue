<template>
  <component :is="tag" :style="style" class="grid__col">
    <slot />
  </component>
</template>

<script>
export default {
  name: 'Col',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    xs: {
      type: Number,
      required: false,
      default(val) {
        return val || 12
      }
    },
    sm: {
      type: Number,
      required: false,
      default(val) {
        return val || this.xs
      }
    },
    md: {
      type: Number,
      required: false,
      default(val) {
        return val || this.sm
      }
    },
    lg: {
      type: Number,
      required: false,
      default(val) {
        return val || this.md
      }
    },
    xl: {
      type: Number,
      required: false,
      default(val) {
        return val || this.lg
      }
    },
    xx: {
      type: Number,
      required: false,
      default(val) {
        return val || this.xl
      }
    },
    xsStart: {
      type: Number,
      required: false,
      default(val) {
        return val || null
      }
    },
    smStart: {
      type: Number,
      required: false,
      default(val) {
        return val || this.xsStart
      }
    },
    mdStart: {
      type: Number,
      required: false,
      default(val) {
        return val || this.smStart
      }
    },
    lgStart: {
      type: Number,
      required: false,
      default(val) {
        return val || this.mdStart
      }
    },
    xlStart: {
      type: Number,
      required: false,
      default(val) {
        return val || this.lgStart
      }
    },
    xxStart: {
      type: Number,
      required: false,
      default(val) {
        return val || this.xlStart
      }
    }
  },
  data() {
    return {
      width: null
    }
  },
  computed: {
    breakpoint() {
      return this.$store.state.device.breakpoint
    },
    style() {
      let offset = null
      const styles = []

      // xs
      if (this.breakpoint === 'xs') {
        offset = this.xsStart ? `${this.xsStart} /` : ''
        styles.push({ 'grid-column': `${offset} span ${this.xs}` })
      }

      // small
      else if (this.breakpoint === 'sm') {
        offset = this.smStart ? `${this.smStart} /` : ''
        styles.push({ 'grid-column': `${offset} span ${this.sm}` })
      }

      // medium
      else if (this.breakpoint === 'md') {
        offset = this.mdStart ? `${this.mdStart} /` : ''
        styles.push({ 'grid-column': `${offset} span ${this.md}` })
      }

      // large
      else if (this.breakpoint === 'lg') {
        offset = this.lgStart ? `${this.lgStart} /` : ''
        styles.push({ 'grid-column': `${offset} span ${this.lg}` })
      }

      // extra-large
      else if (this.breakpoint === 'xl') {
        offset = this.xlStart ? `${this.xlStart} /` : ''
        styles.push({ 'grid-column': `${offset} span ${this.xl}` })
      }

      // extra-extra-large
      else if (this.breakpoint === 'xx') {
        offset = this.xxStart ? `${this.xxStart} /` : ''
        styles.push({ 'grid-column': `${offset} span ${this.xx}` })
      }

      return styles
    }
  }
  // mounted() {
  //   this.setWidth()
  //   this.$nuxt.$on('window::resize', this.setWidth)
  // },
  // methods: {
  //   setWidth() {
  //     this.width = this.$el
  //       ? Math.round(this.$el.getBoundingClientRect().width)
  //       : null
  //   }
  // }
}
</script>

<style lang="scss" scoped>
// span all by default
.grid__col {
  grid-column: auto;
}
</style>
