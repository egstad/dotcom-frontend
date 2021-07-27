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
import IntersectionObserverAdmin from 'intersection-observer-admin'
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
      observerAutoplay: new IntersectionObserverAdmin(),
      observerLazyload: new IntersectionObserverAdmin(),
      observerLazyloadOptions: {}
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
    posterReference() {
      return getImageAsset(this.poster.asset, {
        projectId: this.$nuxt.$sanity.config.projectId,
        dataset: this.$nuxt.$sanity.config.dataset
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
    // console.log(
    //   getImage(this.poster.asset, {
    //     projectId: this.$nuxt.$sanity.config.projectId,
    //     dataset: this.$nuxt.$sanity.config.dataset
    //   })
    // )
    this.width = this.posterReference.metadata.dimensions.width
    this.height = this.posterReference.metadata.dimensions.height
  },
  mounted() {
    // setup an observer to handle the lazyloading of this video
    this.observerLazyloadOptions = { rootMargin: `100% 0px` }
    this.observerLazyload.addEnterCallback(this.$el, this.setSource)
    this.observerLazyload.observe(this.$el, this.observerLazyloadOptions)

    // setup an additional observer to handle our autoplaying videos
    this.observerAutoplay.addEnterCallback(this.$el, this.autoplayInView)
    this.observerAutoplay.addExitCallback(this.$el, this.autoplayOutOfView)
    this.observerAutoplay.observe(this.$el)
  },
  beforeDestroy() {
    // good bye, sweetie!
    this.observerAutoplay.destroy()
    this.observerLazyload.destroy()
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
      this.observerLazyload.destroy()

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

<style>
.vid {
  transition: opacity 400ms 400ms var(--ease);
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
