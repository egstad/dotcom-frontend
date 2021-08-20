<template>
  <transition name="bounce">
    <span v-if="isHover" class="tooltip" aria-hidden="true">
      <span class="tooltip__text">{{ content }}&nbsp;&#x2192;</span>
    </span>
  </transition>
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
      isHover: false,
      isVisible: false
    }
  },
  methods: {
    showTooltip() {
      this.isHover = true
      this.isVisible = true
    },
    hideTooltip() {
      this.isHover = false
    },
    mouseHandler(ev) {
      const rect = ev.target.getBoundingClientRect()
      const x = ev.clientX - rect.left
      const y = ev.clientY - rect.top
      this.$el.style.left = `${x}px`
      this.$el.style.top = `${y}px`
    }
  }
}
</script>

<style lang="scss" scoped>
.tooltip {
  @extend .t-mono;

  /* Positioning */
  transform: translate3d(-50%, -150%, 0);
  position: absolute;
  z-index: 10;
  left: 0;
  top: 0;

  /* Display & Box Model */
  display: flex;
  width: auto;
  max-width: 30em;
  padding: 0.4em 1em;
  border-radius: 0.2em;
  text-transform: uppercase;
  overflow: hidden;
  border-radius: 100vw;

  /* Color */
  background-color: hsl(var(--f-h), var(--f-s), var(--f-l), 100%);
  color: var(--background);

  /* Text */
  letter-spacing: 0.1em;
  font-variation-settings: 'wght' 300, 'MONO' 1, 'ital' 0 !important;
  font-style: normal;
  white-space: nowrap;
  text-overflow: ellipsis;

  /* Other */
  pointer-events: none;

  &__text {
    position: relative;
  }

  @include transition {
    transition: all 100ms ease;
    transition-property: left, top;
  }
}

.bounce-enter-active {
  animation: bounce-in 0.4s;
}
.bounce-leave-active {
  animation: fade-out 0.3s;
}
@keyframes fade-out {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    transform: scale(0.7) rotate3d(0, 0, 1, -10deg) translate3d(-50%, -150%, 0);
  }
}
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(1) rotate3d(0, 0, 1, 15deg) translate3d(-50%, -150%, 0);
  }
  50% {
    transform: scale(1.1) translate3d(-50%, -150%, 0);
  }
  100% {
    transform: scale(1) translate3d(-50%, -150%, 0);
  }
}
</style>
