<template>
  <div ref="details" class="grid is-hidden">
    <p class="ts1">
      My many-sided practice is informed by a decade of brand design and product
      development. I’ve served plumbers, political organizations, restaurants,
      magazines, musicians, fashion designers, retailers, banks, non-profits,
      social media networks, tech giants, and design companies alike.
    </p>
    <p class="ts1">
      I’ve found that a playful and generative approach leads to the most
      discerning and individual solutions for brands. It’s also fucking fun (for
      me/clients/users). We need more of that in this world. If you’re looking
      for a hand on your next project, lmk. Portfolio available on request.
    </p>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$app.$on('animate::details', this.showDetails)
  },
  beforeDestroy() {
    this.$app.$off('animate::details', this.showDetails)
  },
  methods: {
    showDetails() {
      this.$refs.details.classList.remove('is-hidden')
    }
  }
}
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 24px;
  transition: opacity 400ms ease-out;
  opacity: 1;

  &.is-hidden {
    opacity: 0;
  }

  @media (min-width: $md) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: $md) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
