<template>
  <transition name="bounce">
    <span v-if="isHover" class="tooltip" aria-hidden="true">
      {{ content }}
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
  display: block;
  position: absolute;
  pointer-events: none;
  padding: 0.4em 0.6em;
  border-radius: 0.2em;
  background: var(--foreground);
  color: var(--background);
  font-family: 'Lars Mono';
  font-size: 75%;
  line-height: 1;
  width: auto;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;

  left: 0;
  top: 0;
  transform: translate3d(-50%, -150%, 0);
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
