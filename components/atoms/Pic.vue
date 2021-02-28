<template>
  <img
    class="pic"
    :class="[
      { 'is-loading': !hasLoaded && !hasErrored },
      { 'has-loaded': hasLoaded },
      { 'has-errored': hasErrored }
    ]"
    :alt="alt"
    :src="image.url + '?w=320&auto=format&fit=max'"
    :width="image.metadata.dimensions.width"
    :height="image.metadata.dimensions.height"
    @load="onLoad($event)"
    @error="onError($event)"
  />
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
      observer: null,
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
  mounted() {
    this.registerObserver()
    this.observer.observe(this.$el)
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
    registerObserver() {
      this.observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.$el.srcset = this.srcSet
            this.unobserve()
          }
        })
      })
    },
    unobserve() {
      this.observer.unobserve(this.$el)
      this.observer.disconnect()
      this.observer = null
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
  opacity: 0.4;
}
.pic.is-loading {
  opacity: 0;
}

/* .pic.has-errored {} */
/* .pic.has-loaded {} */
</style>
