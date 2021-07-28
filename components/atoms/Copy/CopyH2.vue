<template>
  <Type :size="5" tag="h2"><slot /></Type>
</template>

<script>
export default {
  mounted() {
    console.log(this.$props)
  }
}
</script>
