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
      :style="{
        backgroundImage: `url('${image.url}?w=320&auto=format&fit=max');`
      }"
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

<style lang="scss">
.pic {
  display: block;
  width: 100%;
  height: auto;

  @include transition {
    transition: opacity 400ms 400ms var(--ease), blur 400ms 400ms var(--ease);
  }

  &.is-loading {
    background-size: cover;
    background-repeat: no-repeat;
    filter: blur(15px);
  }

  &.has-loaded {
    filter: blur(0);
  }

  // &.has-errored {}
}
</style>
