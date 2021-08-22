<template>
  <div ref="details" class="grid is-hidden">
    <p class="t-2">
      My many-sided practice is informed by a decade of brand design and product
      development for some of the world’s best brands. Each of my projects is
      approached with a sense of curiosity, care, and most importantly, play.
      This ethos, and the generative process it informs, consistently leads
      brands to discerning solutions that feel uniquely and uncompromisingly
      “them”.
    </p>
    <p class="t-2">
      I most recently led design and development on
      <a href="https://instrument.com" target="_blank">Instrument’s</a> brand
      team, where I helped them attract world-class talent and clients. During
      my six years there, I worked on a variety of projects for Amazon, Dwell,
      Ebay, Facebook, Google, Harper’s Bazaar, Hot Wheels, Levi’s, Nike,
      Patagonia, Sequoia Capital, Sonos, Stumptown Coffee, TEDx, Twitter, Umpqua
      Bank, and more.
    </p>
    <p class="t-2">
      Currently, I live in Portland, Oregon and work with
      <a href="https://loom.com" target="_blank">Loom</a> as their Principal
      Brand Designer. Loom’s video messaging tool has helped over 10,000,000
      people come together virtually to effectively communicate ideas in an
      ever-increasingly remote world. Speaking of communications, if you’d like
      to get in touch regarding a project, or if you just want to talk shop,
      don’t be shy.
    </p>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$nuxt.$on('animate::details', this.showDetails)
  },
  beforeDestroy() {
    this.$nuxt.$off('animate::details', this.showDetails)
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
  grid-gap: var(--button-click-offset);
  padding-left: var(--button-click-offset);
  padding-right: var(--button-click-offset);
  transition: opacity 400ms ease-out;
  opacity: 1;

  padding-top: 5vw;
  padding-bottom: 5vw;

  @include bp($md) {
    padding-top: 3.5vw;
    padding-bottom: 3.5vw;
  }

  @include bp($lg) {
    grid-template-columns: repeat(3, 1fr);
    padding-top: 2vw;
    padding-bottom: 2vw;
  }

  @include bp($xl) {
    padding-top: 1.5vw;
    padding-bottom: 1.5vw;
  }

  &.is-hidden {
    opacity: 0;
  }

  .t-2 {
    @include bp($lg, max-width) {
      font-size: clamp(15px, 3vw, 28px);
      line-height: 1.25;
    }

    @include bp($xx) {
      font-size: 1.04vw;
    }

    a {
      color: inherit;
      text-underline-offset: 0.05em;

      // text-decoration: none;
    }
  }
}
</style>
