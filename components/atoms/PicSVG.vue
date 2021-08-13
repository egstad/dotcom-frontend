<template>
  <div class="pic--svg">
    <!-- eslint-disable-next-line -->
    <div v-html="data"></div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.pic--svg {
  width: 100%;
  height: 100%;

  ::v-deep svg {
    width: 100% !important;
    height: auto;
  }
}
</style>
