<template>
  <intersect
    :threshold="[0, 0]"
    :root-margin="`${$store.state.device.winHeight}px 0px`"
    @enter.once="handleInView"
  >
    <img
      ref="pic"
      class="pic"
      :class="[
        { 'is-loading': !hasLoaded && !hasErrored },
        { 'has-loaded': hasLoaded },
        { 'has-errored': hasErrored }
      ]"
      :alt="alt"
      :width="image.metadata.dimensions.width"
      :height="image.metadata.dimensions.height"
      @load="onLoad($event)"
      @error="onError($event)"
    />
  </intersect>
</template>

<script>
import { getImageAsset } from '@sanity/asset-utils'

export default {
  props: {
    asset: {
      type: [String, Array],
      required: true
    },
    alt: {
      type: String,
      required: false,
      default: null
    },
    loading: {
      type: String,
      required: false,
      default: 'lazy'
    }
  },
  data() {
    return {
      hasLoaded: null,
      hasErrored: null,
      sizes: [320, 640, 1280, 2560, 3200],
      srcSet: []
    }
  },
  computed: {
    image() {
      return getImageAsset(this.asset, {
        projectId: this.$sanity.config.projectId,
        dataset: this.$sanity.config.dataset
      })
    }
  },
  created() {
    this.srcSet = this.sizes.map((size) => {
      const url = this.image.url
      const transform = `?w=${size}&auto=format&fit=max`

      return `${url}${transform} ${size}w`
    })
  },
  methods: {
    onLoad(ev) {
      this.hasLoaded = true
      this.$emit('load', ev)
    },
    onError(ev) {
      this.hasErrored = true
      this.$emit('error', ev)
    },
    setSource() {
      if (!this.$refs.pic.src) {
        this.$refs.pic.src = `${this.image.url}?w=${this.sizes[0]}&auto=format&fit=max`
        this.$refs.pic.srcset = this.srcSet
      }
    },
    handleInView() {
      this.setSource()
      if (this.autoplay && !this.hasBeenInteractedWith) {
        this.play()
      }
    }
  }
}
</script>

<style>
.pic {
  transition: opacity var(--time) var(--ease);
  display: block;
  width: 100%;
  height: auto;
}
.pic.is-loading {
  opacity: 0;
}

/* .pic.has-errored {} */
/* .pic.has-loaded {} */
</style>
