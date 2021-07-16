<template>
  <span class="tooltip" aria-hidden="true" :class="{ 'is-visible': isHover }">
    {{ content }}
    <span class="pointer"></span>
  </span>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isHover: false
    }
  },
  methods: {
    showTooltip() {
      this.isHover = true
    },
    hideTooltip() {
      this.isHover = false
    },
    mouseHandler(ev) {
      this.$el.style.left = `${ev.clientX}px`
      this.$el.style.top = `${ev.clientY}px`
    }
  }
}
</script>

<style lang="scss" scoped>
.tooltip {
  display: block;
  position: fixed;
  transform: translate3d(-50%, -200%, 0) rotateX(-4deg) rotateY(-4deg)
    rotateZ(4deg);
  opacity: 0;
  pointer-events: none;
  perspective: 600px;
  transition: opacity calc(var(--time) * 0.3) ease-out,
    transform calc(var(--time) * 0.3) ease-in-out;

  padding: 0.4em 0.6em;
  border-radius: 0.2em;
  background: var(--accent);
  color: var(--foreground);
  font-family: 'Lars Mono';
  font-size: 75%;
  line-height: 1;

  &.is-visible {
    opacity: 1;
    transform: translate3d(-50%, -150%, 0);
  }
}
</style>
