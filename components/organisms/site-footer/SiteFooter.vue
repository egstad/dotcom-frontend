<template>
  <footer class="site-footer">
    Egstad
  </footer>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
// padding based on grid: .vue;
$grid-gap: 16px;

.site-footer {
  padding: ($grid-gap * 2) 0 $grid-gap;

  @include bp($md) {
    padding: calc-vw($grid-gap * 2, $md) 0 calc-vw($grid-gap, $md);
  }
}

li {
  text-transform: lowercase;
}
</style>
