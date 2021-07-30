<template>
  <transition name="fade" mode="out-in">
    <button
      v-show="showScrollButton"
      class="button --scroll-up"
      aria-label="Open Filter &amp; Search Modal"
      @click="scrollToTop"
    >
      •
    </button>
  </transition>
</template>

<script>
export default {
  props: {
    showScrollButton: {
      type: Boolean,
      required: true
    }
  },
  mounted() {
    this.$el.addEventListener('transitionend', this.onTransition)
  },
  methods: {
    scrollToTop() {
      if (process.client) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    onTransition(ev) {
      if (ev.propertyName !== 'opacity') return
      this.$nuxt.$emit('scrollUpButton::updated')
    }
  }
}
</script>

<style lang="scss" scoped></style>
