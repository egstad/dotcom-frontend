<template>
  <intersect :threshold="[0, 0]" @enter="handleInView" @leave="handleOutOfView">
    <video
      ref="video"
      class="vid"
      :class="[
        { 'is-loading': !hasLoaded && !hasErrored },
        { 'has-loaded': hasLoaded },
        { 'has-errored': hasErrored }
      ]"
      :data-src="source"
      :aria-label="alt"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :controls="controls"
      :playsinline="playsinline"
      :width="width"
      :height="height"
      :poster="posterSource"
      tabindex="1"
      @keydown.space.prevent="!controls ? playToggle() : null"
      @keydown.enter="!controls ? playToggle() : null"
      @click="!controls ? playToggle() : null"
      @error="onError($event)"
      @play="onPlay($event)"
      @pause="onPause($event)"
      @ended="onEnd($event)"
      @canplay="onLoad($event)"
      @loadedmetadata="onLoadedData($event)"
    ></video>
  </intersect>
</template>

<script>
import { getImageAsset } from '@sanity/asset-utils'

export default {
  props: {
    asset: {
      type: String,
      required: true
    },
    poster: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    },
    alt: {
      type: String,
      required: false,
      default: null
    },
    config: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      hasLoaded: null,
      hasErrored: null,
      isPlaying: null,
      hasBeenInteractedWith: false,
      width: null,
      height: null
    }
  },
  computed: {
    source() {
      return `https://egstad.link/${this.asset}`
    },
    autoplay() {
      return this.config.autoplay ? this.config.autoplay : false
    },
    loop() {
      return this.config.loop ? this.config.loop : false
    },
    muted() {
      return this.config.mute ? this.config.mute : false
    },
    controls() {
      return this.config.controls ? this.config.controls : false
    },
    playsinline() {
      return this.config.playsinline ? this.config.playsinline : true
    },
    posterSource() {
      const imageAsset = getImageAsset(this.poster.asset, {
        projectId: this.$nuxt.$sanity.config.projectId,
        dataset: this.$nuxt.$sanity.config.dataset
      })
      return `${imageAsset.url}?q=60&auto=format`
    }
  },
  methods: {
    play() {
      this.$refs.video.play()
    },
    pause() {
      this.$refs.video.pause()
    },
    playToggle() {
      this.isPlaying ? this.pause() : this.play()
      this.hasBeenInteractedWith = true
    },
    onLoadedData(ev) {
      this.width = this.$refs.video.videoWidth
      this.height = this.$refs.video.videoHeight
    },
    onLoad(ev) {
      this.hasLoaded = true
      this.$emit('load', ev)
    },
    onError(ev) {
      this.hasErrored = true
      this.$emit('error', ev)
    },
    onPlay(ev) {
      this.isPlaying = true
      this.$emit('play', ev)
    },
    onPause(ev) {
      this.isPlaying = false
      this.$emit('pause', ev)
    },
    onEnd(ev) {
      this.$emit('end', ev)
    },
    setSource() {
      if (!this.$refs.video.src) {
        this.$refs.video.src = this.$refs.video.dataset.src
        this.$refs.video.removeAttribute('data-src')
      }
    },
    handleInView() {
      this.setSource()
      if (this.autoplay && !this.hasBeenInteractedWith) {
        this.play()
      }
    },
    handleOutOfView() {
      if (this.autoplay) {
        this.pause()
      }
    }
  }
}
</script>

<style>
.vid {
  transition: opacity var(--time) var(--ease);
  display: block;
  width: 100%;
  height: auto;
}

.vid.is-loading {
  opacity: 0;
}

/* .vid.has-errored {} */
/* .vid.has-loaded {} */
</style>
