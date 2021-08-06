<template>
  <!-- <div class="pic__wrap" :style="{ backgroundColor: background }"> -->
  <div class="pic__wrap">
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
      :style="{ backgroundColor: background }"
      @load="onLoad($event)"
      @error="onError($event)"
    />
  </div>
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
    },
    palette: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      hasLoaded: null,
      hasErrored: null,
      sizes: [320, 640, 1280, 2560, 3200],
      srcSet: [],
      observerOptions: { rootMargin: `100% 0px`, threshold: 0 }
    }
  },
  computed: {
    image() {
      return getImageAsset(this.asset, {
        projectId: this.$sanityClient.clientConfig.projectId,
        dataset: this.$sanityClient.clientConfig.dataset
      })
    },
    extension() {
      return this.image.extension
    },
    background() {
      return this.palette.dominant.background
    }
  },
  created() {
    this.srcSet = this.sizes.map((size) => {
      const url = this.image.url
      const transform = `?w=${size}&auto=format&fit=max`

      return `${url}${transform} ${size}w`
    })
  },
  mounted() {
    this.$nextTick(() => {
      window.$observer.addEnterCallback(this.$refs.pic, this.inView)
      window.$observer.observe(this.$refs.pic, this.observerOptions)
    })
  },
  beforeDestroy() {
    window.$observer.unobserve(this.$refs.pic, this.observerOptions)
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
    inView() {
      this.setSource()
      window.$observer.unobserve(this.$refs.pic, this.observerOptions)
    }
  }
}
</script>

<style lang="scss">
.pic {
  display: block;
  width: 100%;
  height: auto;

  // &.is-loading {}
  // &.has-errored {}
  &.has-loaded {
    background-color: transparent !important;
  }
}
</style>
