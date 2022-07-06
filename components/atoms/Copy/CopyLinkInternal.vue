<template>
  <span class="link">
    <nuxt-link
      :to="slug === 'index' ? '/' : slug"
      class="link"
      @mouseenter.native="$refs.tooltip.showTooltip()"
      @mousemove.native="$refs.tooltip.mouseHandler($event)"
      @mouseleave.native="$refs.tooltip.hideTooltip()"
    >
      <slot />
    </nuxt-link>
    <Tooltip ref="tooltip" :content="title ? title : pageName" />
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
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  computed: {
    pageName() {
      return this.slug
    }
  }
}
</script>

<style lang="scss" scoped>
.link {
  position: relative;
}

:deep(a) {
  color: inherit;
  text-decoration-color: hsl(var(--a-h), var(--a-s), var(--a-l), 100%);
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.125em;

  &:focus-within {
    outline-offset: 4px;
    outline: 4px solid var(--a11y-color);
  }
}
</style>
