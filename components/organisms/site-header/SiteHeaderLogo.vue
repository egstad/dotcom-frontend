<template>
  <Type tag="h1" :size="2" class="egstad-logo">
    <nuxt-link to="/" class="egstad-logo__link">
      Egstad
    </nuxt-link>
  </Type>
</template>

<script>
export default {
  data() {
    return {
      style: {
        'text-transform': 'lowercase',
        'text-decoration': 'none',
        color: 'currentColor'
      }
    }
  }
}
</script>

<style>
.egstad-logo__link {
  text-transform: lowercase;
  text-decoration: none;
  color: currentColor;
  display: inline-block;
  padding: 0.6em 0;
}
</style>
