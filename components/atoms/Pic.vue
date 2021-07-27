<template>
  <div class="pic__wrap" :style="{ background: background }">
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
  </div>
</template>

<script>
import IntersectionObserverAdmin from 'intersection-observer-admin'
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
      observer: new IntersectionObserverAdmin(),
      observerOptions: {}
    }
  },
  computed: {
    image() {
      return getImageAsset(this.asset, {
        projectId: this.$sanity.config.projectId,
        dataset: this.$sanity.config.dataset
      })
    },
    extension() {
      return this.image.extension
    },
    background() {
      return this.palette && this.extension !== 'png'
        ? this.palette.dominant.background
        : null
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
      this.observer.addEnterCallback(this.$refs.pic, this.inView)
      this.observer.observe(this.$refs.pic)
    })
  },
  beforeDestroy() {
    this.observer.destroy()
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
      this.observer.destroy()
    }
  }
}
</script>

<style>
.pic {
  transition: opacity 400ms 400ms var(--ease);
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
