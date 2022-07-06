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
  outline: none;

  /* Other */
  cursor: pointer;

  &.isActive .fab__wrapper,
  &:hover .fab__wrapper,
  &:focus-within .fab__wrapper {
    background-color: hsla(var(--b-h), var(--b-s), var(--b-l), 100%);
    color: hsla(var(--f-h), var(--f-s), var(--f-l), 100%);
    border: 4px solid hsla(var(--f-h), var(--f-s), var(--f-l), 100%);
  }

  &:focus-visible {
    outline-offset: -4px;
    outline: 4px solid var(--a11y-color);
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
  overflow: hidden;

  /* Color */
  background-color: hsla(var(--f-h), var(--f-s), var(--f-l), 100%);
  color: hsla(var(--b-h), var(--b-s), var(--b-l), 100%);
  border: 4px solid transparent;
  box-shadow: 0 1.3px 5.3px rgba(0, 0, 0, 0.061),
    0 4.5px 17.9px rgba(0, 0, 0, 0.089), 0 20px 80px rgba(0, 0, 0, 0.15);

  @include transition {
    transition: all var(--trans-short) var(--ease);
    transition-property: background-color, color, transform, border-color;
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
  :deep(svg) {
    display: flex;
    width: 14px;
    height: 14px;

    @include transition {
      transition: fill var(--trans-short) var(--ease);
    }
  }
}
</style>
