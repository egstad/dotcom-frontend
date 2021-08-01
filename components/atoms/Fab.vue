<template>
  <transition name="fab" mode="out-in">
    <button v-if="show" class="fab" :aria-label="label">
      <span class="fab__content">
        <slot></slot>
      </span>
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
.fab {
  position: relative;
  appearance: none;
  border: 0;
  padding: 0;
  top: var(--button-click-offset);
  border-radius: 100%;
  font-family: var(--mono);
  background: transparent;
  width: var(--button-height);
  height: var(--button-height);
  cursor: pointer;
  margin-left: var(--header-item-gap);
  background: rgba(red, 0.5);

  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 1;

    ::v-deep svg {
      display: flex;
      width: 14px;
      height: 14px;

      @media screen and (prefers-reduced-motion: no-preference) {
        transition: fill var(--trans-short) var(--ease);
      }
    }
  }

  // &:after {
  //   content: '';
  //   display: block;
  //   border-radius: 100vw;
  //   width: var(--button-height);
  //   height: var(--button-height);
  //   position: absolute;
  //   top: var(--button-click-offset);
  //   background-color: hsla(var(--b-h), var(--b-s), calc(var(--b-l) - 7%), 100%);
  // }

  &:hover::after,
  &:focus-visible::after {
    background-color: var(--foreground);
    color: var(--background);
    outline-offset: 4px;
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    &::after {
      transition: background-color var(--trans-short) var(--ease);
    }
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    transition: transform var(--trans-short) var(--ease),
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
          color var(--transition-page);
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
