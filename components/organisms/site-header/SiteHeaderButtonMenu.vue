<template>
  <transition
    name="fade"
    mode="out-in"
    @enter="$nuxt.$emit('scrollUpButton::updated')"
    @leave="$nuxt.$emit('scrollUpButton::updated')"
  >
    <button
      v-if="showFilter"
      class="button --toggle-menu"
      aria-label="Scroll to the top of the page."
    >
      ••
    </button>
  </transition>
</template>

<script>
export default {
  computed: {
    showFilter() {
      return this.$store.state.filterIsVisible
    }
  }
}
</script>

<style lang="scss" scoped></style>
