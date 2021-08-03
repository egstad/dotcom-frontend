<template>
  <transition name="fab" mode="out-in">
    <button v-show="show" class="fab" :class="['fab', { isActive }]">
      <div class="fab__wrapper" :aria-label="label">
        <span class="fab__content">
          <slot></slot>
        </span>
      </div>
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
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
/*-----------------------------------------------------------------------------
 | Floating Action Button
 *-----------------------------------------------------------------------------
 | The CSS vars used are defined in layouts/defalut.vue
 *---------------------------------------------------------------------------*/

.fab {
  /* Positioning */
  position: relative;

  /* Display & Box Model */
  display: flex;
  align-items: center;
  width: var(--button-height);
  padding: var(--button-click-offset) 0;
  margin-left: var(--header-item-gap);
  appearance: none;
  background: 0;
  border: 0;
  padding: 0;
  // outline: none;

  /* Other */
  cursor: pointer;

  // &:hover,
  // &:focus-visible {
  //   color: var(--background);
  //   background-color: var(--foreground);
  // }

  &.isActive .fab__wrapper,
  &:hover .fab__wrapper,
  &:focus-within .fab_wrapper {
    background-color: var(--foreground);
    color: var(--background);
    outline-offset: 4px;
  }

  @include transition {
    &.fab-enter-active,
    &.fab-leave-active {
      transition: width var(--trans-short) var(--trans-delay) var(--ease),
        transform var(--trans-short) var(--trans-delay) var(--ease),
        opacity var(--trans-short) var(--trans-delay) var(--ease),
        margin-left var(--trans-short) var(--trans-delay) var(--ease);
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

.fab__wrapper {
  /* Display & Box Model */
  display: block;
  border-radius: 100%;
  width: 100%;
  height: 100%;
  height: var(--button-height);

  /* Color */
  background-color: hsla(var(--b-h), var(--b-s), calc(var(--b-l) - 7%), 100%);
  color: var(--foreground);

  @include transition {
    transition: background-color var(--trans-short) var(--ease),
      color var(--trans-short) var(--ease);
  }
}

.fab__content {
  /* Display & Box Model */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  /* Other */
  ::v-deep svg {
    display: flex;
    width: 14px;
    height: 14px;

    @include transition {
      transition: fill var(--trans-short) var(--ease);
    }
  }
}
</style>
