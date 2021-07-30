<template>
  <transition
    name="fade"
    mode="out-in"
    @enter="$nuxt.$emit('scrollUpButton::updated')"
    @leave="$nuxt.$emit('scrollUpButton::updated')"
  >
    <button
      v-if="isShowing"
      class="button --toggle-menu"
      aria-label="Scroll to the top of the page."
    >
      ••
    </button>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isShowing: false
    }
  },
  mounted() {
    this.$nuxt.$on('filter::show', this.show)
    this.$nuxt.$on('filter::hide', this.hide)
  },
  beforeDestroy() {
    this.$nuxt.$off('filter::show')
    this.$nuxt.$off('filter::hide')
  },
  methods: {
    show() {
      this.isShowing = true
    },
    hide() {
      this.isShowing = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
