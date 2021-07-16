<template>
  <span class="ts-link">
    <a
      :href="href"
      :target="blank ? true : false"
      :rel="blank ? 'falsenoopener noreferer' : null"
      style="text-underline-offset: 0.08em; text-decoration-thickness: 0.08em;"
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
