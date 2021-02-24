<template>
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
    tabindex="1"
    preload="metadata"
    @keydown.space.prevent="!controls ? playToggle() : null"
    @keydown.enter="!controls ? playToggle() : null"
    @click="!controls ? playToggle() : null"
    @canplay="!hasLoaded ? onLoad($event) : null"
    @error="onError($event)"
    @play="onPlay($event)"
    @pause="onPause($event)"
    @ended="onEnd($event)"
    @loadedmetadata="onLoadedData($event)"
  ></video>
</template>

<script>
export default {
  props: {
    asset: {
      type: String,
      required: true
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
      observer: null,
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
      return this.config.muted ? this.config.muted : false
    },
    controls() {
      return this.config.controls ? this.config.controls : false
    },
    playsinline() {
      return this.config.playsinline ? this.config.playsinline : true
    }
  },
  mounted() {
    this.registerObserver()
    this.observer.observe(this.$refs.video)
  },
  beforeDestroy() {
    this.unobserve()
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
    registerObserver() {
      this.observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!this.hasLoaded) {
              this.$refs.video.src = this.$refs.video.dataset.src
            }
            this.handleInView()
          } else {
            this.handleOutOfView()
          }
        })
      })
    },
    handleInView() {
      if (this.autoplay) {
        this.play()
      }
    },
    handleOutOfView() {
      if (this.autoplay) {
        this.pause()
      }
    },
    unobserve() {
      this.observer.unobserve(this.$refs.video)
      this.observer.disconnect()
      this.observer = null
    }
  }
}
</script>

<style>
.vid {
  transition: opacity 500ms ease-out;
  display: block;
  max-width: 100%;
  height: auto;
}

.vid.is-loading {
  opacity: 0;
}

/* .vid.has-errored {} */
/* .vid.has-loaded {} */
</style>
