<template>
  <span class="link">
    <a
      :href="href"
      :target="blank ? true : false"
      :rel="blank ? 'falsenoopener noreferer' : null"
      @mouseenter="$refs.tooltip.showTooltip()"
      @mousemove="$refs.tooltip.mouseHandler($event)"
      @mouseleave="$refs.tooltip.hideTooltip()"
    >
      <slot />
    </a>
    <Tooltip ref="tooltip" :content="hostname" />
  </span>
</template>

<script>
import Tooltip from '@/components/atoms/Tooltip'

export default {
  components: {
    Tooltip
  },
  props: {
    href: {
      type: String,
      default: null
    },
    blank: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    hostname() {
      const domain = new URL(this.href)
      return domain.hostname.replace('www', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.link {
  position: relative;
  // display: inline-block;
}

::v-deep a {
  color: inherit;
  text-decoration-color: hsl(var(--a-h), var(--a-s), var(--a-l), 100%);
  text-underline-offset: 1.5em;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.125em;

  &:focus-visible {
    outline-offset: 4px;
    outline: 4px solid var(--a11y-color);
  }
}
</style>
