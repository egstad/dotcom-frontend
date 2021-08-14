<template>
  <div
    class="vid__wrap"
    @mousemove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <transition name="meta" mode="out-in">
      <button v-if="showUI" class="vid__playhead" @click="playToggle">
        <span v-if="isPlaying">Pause</span>
        <span v-else>Play</span>
      </button>
    </transition>

    <video
      ref="video"
      v-touch="onTap"
      class="vid"
      :class="[
        { 'is-loading': !hasLoaded && !hasErrored },
        { 'has-loaded': hasLoaded },
        { 'has-errored': hasErrored }
      ]"
      :style="{ background: background }"
      :data-src="source"
      :aria-label="alt"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :playsinline="playsinline"
      :width="width"
      :height="height"
      :poster="posterSource"
      tabindex="1"
      preload="metadata"
      controlsList="nodownload"
      @click.stop.prevent="playToggle"
      @keydown.space.prevent="!controls ? playToggle() : null"
      @keydown.enter="!controls ? playToggle() : null"
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
      showUI: false,
      UItimeout: null,
      isPlaying: false,
      isHovered: false,
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
    background() {
      return this.palette && this.extension !== 'png'
        ? this.palette.dominant.background
        : null
    }
  },
  watch: {
    isPlaying(newValue, oldValue) {
      if (newValue) {
        clearTimeout(this.UItimeout)
        this.UItimeout = setTimeout(() => {
          this.showUI = false
        }, 1250)
      } else {
        clearTimeout(this.UItimeout)
        this.showUI = true
      }
    },
    isHovered(newValue, oldValue) {
      // if not playing, always show ui
      if (!this.isPlaying) {
        clearTimeout(this.UItimeout)
        this.showUI = true
        return
      }

      if (newValue) {
        clearTimeout(this.UItimeout)
        this.showUI = true
        this.UItimeout = setTimeout(() => {
          this.showUI = false
        }, 1250)
      } else {
        clearTimeout(this.UItimeout)
        this.UItimeout = setTimeout(() => {
          this.showUI = false
        }, 1250)
      }
    }
  },
  created() {
    this.width = this.posterReference.metadata.dimensions.width
    this.height = this.posterReference.metadata.dimensions.height
  },
  mounted() {
    // setup an observer to handle the lazyloading of this video
    this.observerLazyloadOptions = { rootMargin: `100% 0px` }

    if (!this.autoplay && !this.isPlaying) this.showUI = true

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
    onTap(ev) {
      // if not playing, always show ui
      if (!this.isPlaying) {
        this.showUI = true
      } else {
        this.toggleUI()
      }
    },
    onPointerMove() {
      this.isHovered = true

      if (!this.isPlaying) return

      // show it when cursor moves
      clearTimeout(this.UItimeout)
      this.showUI = true
      this.UItimeout = setTimeout(() => {
        this.showUI = false
      }, 1250)
    },
    onPointerLeave() {
      this.isHovered = false
    },
    toggleUI() {
      this.showUI = !this.showUI
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
.vid__wrap {
  position: relative;
}

.vid {
  display: block;
  width: 100%;
  height: auto;

  // &.is-loading {}
  // &.has-loaded {}

  &.has-loaded {
    background-color: transparent !important;
  }

  &__wrap {
    position: relative;
  }

  &__playhead {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 1;
    width: calc(var(--button-height) * 2);
    height: calc(var(--button-height) * 2);
    border-radius: calc(var(--button-height) * 2);
    border: 0;
    appearance: none;
  }
}
</style>
