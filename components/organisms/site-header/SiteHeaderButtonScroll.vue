<template>
  <transition
    name="fade"
    mode="out-in"
    @enter="$nuxt.$emit('scrollUpButton::updated')"
    @leave="$nuxt.$emit('scrollUpButton::updated')"
  >
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
  methods: {
    scrollToTop() {
      if (process.client) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
