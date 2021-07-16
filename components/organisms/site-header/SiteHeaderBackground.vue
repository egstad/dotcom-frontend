<template>
  <div class="site-header__background" :class="{ 'is-hidden': hidden }"></div>
</template>

<script>
export default {
  props: {
    hidden: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 10vw;

.site-header__background {
  position: fixed;
  top: -$height;
  left: 0;
  right: 0;
  height: $height;
  background: transparent;
  z-index: -2;
  pointer-events: 0;
  box-shadow: 0 $height * 0.6 8vw var(--background);
  transform: scaleX(2) translate3d(0, -2px, 0);
  transition: box-shadow var(--time) var(--ease),
    opacity var(--time) var(--ease);

  &.is-hidden {
    opacity: 0;
  }

  @media (max-width: $lg) {
    $height: 25vw;

    height: $height;
    top: -$height;
    box-shadow: 0 $height * 0.5 $height * 0.3 var(--background);
  }
}
</style>
