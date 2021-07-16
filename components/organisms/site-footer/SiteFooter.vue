<template>
  <footer class="site-footer">
    <Grid tag="nav">
      <Column tag="ul" :xs="4" :lg="3" :xl="2">
        <Type :size="1" tag="li">Work</Type>
        <Type :size="1" tag="li">#Design</Type>
        <Type :size="1" tag="li">#Development</Type>
        <Type :size="1" tag="li">#Typography</Type>
      </Column>

      <Column tag="ul" :xs="4" :lg="3" :xl="2">
        <Type :size="1" tag="li">About</Type>
        <Type :size="1" tag="li">Profile</Type>
        <Type :size="1" tag="li">Colophon</Type>
        <Type :size="1" tag="li">Kit of Parts</Type>
      </Column>

      <Column tag="ul" :xs="4" :lg="3" :xl="2">
        <Type :size="1" tag="li">Connect</Type>
        <Type :size="1" tag="li">Message</Type>
        <Type :size="1" tag="li">Instagram</Type>
        <Type :size="1" tag="li">Are.na</Type>
      </Column>
    </Grid>
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
