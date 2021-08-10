<template>
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      v-if="direction === 'right'"
      d="M4.67633 12C5.35528 11.3385 9.46368 7 9.46368 7L4.67633 2H6.44475C7.58159 3.15385 9.96581 5.72308 11.3237 7C9.98159 8.30769 7.59738 10.8462 6.44475 12H4.67633Z"
    />

    <path
      v-if="direction === 'left'"
      d="M9.32367 12C8.64472 11.3385 4.53632 7 4.53632 7L9.32367 2H7.55525C6.41841 3.15385 4.03419 5.72308 2.6763 7C4.01841 8.30769 6.40262 10.8462 7.55525 12H9.32367Z"
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
