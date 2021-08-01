<template>
  <transition name="fab" mode="out-in">
    <div v-if="show" class="fab-wrap">
      <button class="fab" :aria-label="label">
        <span class="fab__content">
          <slot></slot>
        </span>
      </button>
    </div>
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
.fab {
  border: 0;
  padding: 0;
  appearance: none;
  border-radius: 100%;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: hsla(var(--b-h), var(--b-s), calc(var(--b-l) - 7%), 100%);
  color: var(--foreground);

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    ::v-deep svg {
      display: flex;
      width: 14px;
      height: 14px;

      @media screen and (prefers-reduced-motion: no-preference) {
        transition: fill var(--trans-short) var(--ease);
      }
    }
  }

  &:hover,
  &:focus-visible {
    background-color: var(--foreground);
    color: var(--background);
    outline-offset: 4px;

    @media screen and (prefers-reduced-motion: no-preference) {
      transition: background-color var(--trans-short) var(--ease),
        color var(--trans-short) var(--ease);
    }
  }
}

.fab-wrap {
  width: var(--button-height);
  height: var(--button-height);
  position: relative;
  top: var(--button-click-offset);
  margin-left: var(--header-item-gap);

  @media screen and (prefers-reduced-motion: no-preference) {
    &.fab-enter-active,
    &.fab-leave-active {
      transition: width var(--trans-medium) var(--trans-delay) var(--ease),
        transform var(--trans-medium) var(--trans-delay) var(--ease),
        opacity var(--trans-medium) var(--trans-delay) var(--ease),
        margin-left var(--trans-medium) var(--trans-delay) var(--ease);
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
