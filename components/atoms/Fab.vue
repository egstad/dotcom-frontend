<template>
  <transition name="fab" mode="out-in">
    <button v-if="show" class="fab" :aria-label="label">
      <slot></slot>
    </button>
  </transition>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 36px;
$inset: 0px;
$gap: 8px;

.fab {
  display: block;
  width: $height + ($inset * 2);
  height: $height + ($inset * 2);
  line-height: $height;
  padding: 0;
  margin: 0;
  background: hsla(var(--b-h), var(--b-s), calc(var(--b-l) - 7%), 100%);
  appearance: none;
  border: 0;
  border-radius: 50%;
  font-family: var(--mono);
  margin-left: $gap;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background-color: var(--foreground);
    color: var(--background);
    outline-offset: 4px;
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    transition: transform var(--trans-short) var(--ease),
      background-color var(--trans-short) var(--ease),
      color var(--trans-short) var(--ease);
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    &.fab-enter-active,
    &.fab-leave-active {
      @media screen and (prefers-reduced-motion: no-preference) {
        transition: width var(--trans-short) var(--trans-delay) var(--ease),
          margin-left var(--trans-short) var(--trans-delay) var(--ease),
          transform var(--trans-short) var(--trans-delay) var(--ease),
          opacity var(--trans-short) var(--trans-delay) var(--ease),
          background-color var(--transition-page), color var(--transition-page);
      }
    }
    &.fab-enter,
    &.fab-leave-to {
      transform: scale(0);
      width: 0;
      opacity: 0;
      margin-left: 0;
    }
  }
}
</style>
