<template>
  <span>
    <nuxt-link
      :to="slug.current === 'index' ? '/' : slug.current"
      style="text-underline-offset: 0.08em; text-decoration-thickness: 0.08em;"
      @mouseenter.native="$refs.tooltip.showTooltip()"
      @mousemove.native="$refs.tooltip.mouseHandler($event)"
      @mouseleave.native="$refs.tooltip.hideTooltip()"
    >
      <slot />
    </nuxt-link>
    <Tooltip ref="tooltip" :content="pageName" />
  </span>
</template>

<script>
import Tooltip from '@/components/atoms/Tooltip'

export default {
  components: {
    Tooltip
  },
  props: {
    slug: {
      type: Object,
      default: null
    }
  },
  computed: {
    pageName() {
      return this.slug.current
    }
  }
}
</script>
