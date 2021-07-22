<template>
  <div>
    <Text size="4">Profile</Text>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$nuxt.$emit('page::mounted')
  }
}
</script>

<style lang="scss" scoped></style>
