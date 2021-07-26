<template>
  <svg
    width="17"
    height="40"
    viewBox="0 0 17 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      v-if="direction === 'right'"
      d="M1 1L15 20L1 39"
      stroke-width="2"
      stroke-linecap="round"
    />

    <path
      v-else-if="direction === 'left'"
      d="M16 1L2 20L16 39"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      required: true,
      validator: (prop) => ['left', 'right'].includes(prop)
    }
  }
}
</script>
