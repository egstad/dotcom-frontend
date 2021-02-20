<template>
  <article class="piece">
    <pre>
      type: {{ type }}<br>
      size: {{ size}}<br>
    </pre>
  </article>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'medium'
    }
  }
}
</script>

<style scoped>
.piece {
  width: 100vw;
  height: 70vh;
  min-height: 50vw;

  background: gray;
}
</style>
