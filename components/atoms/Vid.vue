<template>
  <div class="vid__wrap" :style="{ background: background }">
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
      preload="metadata"
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
  </div>
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
      isPlaying: null,
      hasBeenInteractedWith: false,
      width: null,
      height: null,
      observerAutoplayOptions: { rootMargin: `0px 0px 0px 0px`, threshold: 0 },
      observerLazyloadOptions: { rootMargin: '100% 0px', threshold: 0 }
    }
  },
  computed: {
    source() {
      return `https://egstad.link/${this.asset}`
    },
    autoplay() {
      return this.config.autoplay && !this.$store.state.device.hideAnimations
        ? this.config.autoplay
        : false
    },
    loop() {
      return this.config.loop ? this.config.loop : false
    },
    muted() {
      return this.config.mute ? this.config.mute : false
    },
    controls() {
      if (this.$store.state.device.hideAnimations) {
        return true
      } else {
        return this.config.controls ? this.config.controls : false
      }
    },
    playsinline() {
      return this.config.playsinline ? this.config.playsinline : true
    },
    posterReference() {
      return getImageAsset(this.poster.asset, {
        projectId: this.$sanityClient.clientConfig.projectId,
        dataset: this.$sanityClient.clientConfig.dataset
      })
    },
    posterSource() {
      return `${this.posterReference.url}?q=60&auto=format`
    },
    winHeight() {
      return this.$store.state.device.winHeight
    },
    background() {
      return this.palette && this.extension !== 'png'
        ? this.palette.dominant.background
        : null
    }
  },
  created() {
    this.width = this.posterReference.metadata.dimensions.width
    this.height = this.posterReference.metadata.dimensions.height
  },
  mounted() {
    // setup an observer to handle the lazyloading of this video
    this.observerLazyloadOptions = { rootMargin: `100% 0px` }

    // lazyload the video
    window.$observer.addEnterCallback(this.$el, this.setSource)
    window.$observer.observe(this.$el, this.observerLazyloadOptions)

    // setup an additional observer to handle our autoplaying videos
    window.$observer.addEnterCallback(this.$refs.video, this.autoplayInView)
    window.$observer.addExitCallback(this.$refs.video, this.autoplayOutOfView)
    window.$observer.observe(this.$refs.video, this.observerAutoplayOptions)
  },
  beforeDestroy() {
    // good bye, sweetie!
    window.$observer.unobserve(this.$refs.video, this.observerLazyloadOptions)
    window.$observer.unobserve(this.$refs.video, this.observerAutoplayOptions)
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
      this.width = this.$el.videoWidth
      this.height = this.$el.videoHeight
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
      if (this.$refs.video.src) return

      // update the src & garbage collect
      this.$refs.video.src = this.$refs.video.dataset.src
      this.$refs.video.removeAttribute('data-src')
      window.$observer.unobserve(this.$refs.video, this.observerLazyloadOptions)

      // ask the browser to immediately load
      this.$refs.video.load()
    },
    autoplayInView() {
      if (this.autoplay && !this.hasBeenInteractedWith) this.play()
    },
    autoplayOutOfView() {
      if (this.autoplay) this.pause()
    }
  }
}
</script>

<style lang="scss">
.vid {
  display: block;
  width: 100%;
  height: auto;

  @media screen and (prefers-reduced-motion: no-preference) {
    transition: opacity 400ms 400ms var(--ease);
  }
}

.vid.is-loading {
  opacity: 0;
}

/* .vid.has-errored {} */
/* .vid.has-loaded {} */
</style>
