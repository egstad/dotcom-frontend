<template>
  <div
    class="vid__wrap"
    @mousemove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <transition name="ui" mode="out-in">
      <button
        v-if="
          (showUI && controls) ||
            (showUI && autoplay && !isPlaying && !controls)
        "
        class="vid__playhead"
        tabindex="0"
        :aria-label="isPlaying ? 'Stop video' : 'Play video'"
        @click="playToggle"
        @keyup.right="skipTo(5)"
        @keyup.left="skipTo(-5)"
      >
        <IconStop v-if="isPlaying" />
        <IconPlay v-else />
      </button>
    </transition>

    <video
      ref="video"
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
      tabindex="0"
      preload="metadata"
      controlsList="nodownload"
      @click.stop.prevent="playToggle"
      @keyup.space.prevent="!controls ? playToggle() : null"
      @keyup.enter="playToggle()"
      @keyup.right="skipTo(5)"
      @keyup.left="skipTo(-5)"
      @error="onError($event)"
      @play="onPlay($event)"
      @pause="onPause($event)"
      @ended="onEnd($event)"
      @canplay="onLoad($event)"
      @loadedmetadata="onLoadedData($event)"
      @focus="showUI = true"
    ></video>

    <transition name="ui" mode="out-in">
      <div
        v-show="controls && showUI && currentTime"
        class="vid__chrome"
        tabindex="0"
        aria-label="Scrub the video timeline with your arrowkeys"
        @keyup.space.prevent="!controls ? playToggle() : null"
        @keyup.enter="playToggle()"
        @keyup.right="skipTo(5)"
        @keyup.left="skipTo(-5)"
        @focus="showUI = true"
      >
        <p class="t-1 t-mono time">{{ currentMins }}:{{ currentSecs }}</p>
        <div
          class="vid__timeline"
          @click="skipTimelineToLocation"
          @touchmove="skipTimelineToLocation"
        >
          <div
            class="current"
            :style="{ width: `${(currentTime / duration) * 100}%` }"
          ></div>
          <div class="length"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getImageAsset } from '@sanity/asset-utils'
import IconPlay from '@/components/atoms/Icons/IconPlay.vue'
import IconStop from '@/components/atoms/Icons/IconStop.vue'

export default {
  components: {
    IconPlay,
    IconStop
  },
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
      currentTime: null,
      currentMins: null,
      currentSecs: null,
      duration: null,
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
    },
    currentTime(newValue) {
      const timeLeft = this.duration - newValue
      this.currentMins = Math.floor(timeLeft / 60)
      this.currentSecs = this.leadingZero(
        Math.floor(timeLeft - this.currentMins * 60),
        2
      )
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

    // update playhead on time
    this.$refs.video.addEventListener('timeupdate', this.onTimeUpdate)
  },
  beforeDestroy() {
    // good bye, sweetie!
    window.$observer.unobserve(this.$refs.video, this.observerLazyloadOptions)
    window.$observer.unobserve(this.$refs.video, this.observerAutoplayOptions)
    this.$refs.video.removeEventListener('timeupdate', this.onTimeUpdate)
  },
  methods: {
    play() {
      const playPromise = this.$refs.video.play()

      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            // Automatic playback started!
            // Show playing UI.
          })
          .catch((error) => {
            /* eslint-disable-next-line */
            console.warn(error)
          })
      }
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
      this.duration = this.$refs.video.duration
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
    onTimeUpdate(ev) {
      this.currentTime = this.$refs.video.currentTime
    },
    skipTimelineToLocation(ev) {
      let clickLocation = null
      let videoWidth = null

      if (ev.type === 'touchmove') {
        const bcr = ev.target.getBoundingClientRect()
        clickLocation = ev.targetTouches[0].clientX - bcr.x
        videoWidth = bcr.width
      } else {
        clickLocation = ev.offsetX
        videoWidth = ev.target.getBoundingClientRect().width
      }

      this.$refs.video.currentTime =
        (clickLocation / videoWidth) * this.duration
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
    },
    leadingZero(num, size) {
      num = num.toString()
      while (num.length < size) num = '0' + num
      return num
    },
    skipTo(perc) {
      const offset = this.duration * (perc * 0.01)
      this.$refs.video.currentTime = this.currentTime + offset
    }
  }
}
</script>

<style lang="scss">
$bar-size: 2px;
$bar-size-hover: 6px;

.vid {
  display: block;
  width: 100%;
  height: auto;

  &:focus-visible {
    outline-offset: -4px;
    outline: 4px solid var(--a11y-color);
  }

  // &.is-loading {}
  // &.has-loaded {}

  &.has-loaded {
    background-color: transparent !important;
  }

  // wraps all video elements
  &__wrap {
    position: relative;
  }

  // playhead button
  &__playhead {
    position: absolute;
    background-color: hsla(var(--b-h), var(--b-s), var(--b-l), 70%);
    backdrop-filter: blur(10px);
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 1;
    width: calc(var(--button-height) * 2);
    height: calc(var(--button-height) * 2);
    border-radius: calc(var(--button-height) * 2);
    border: 0;
    appearance: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1.7px 3.6px rgba(0, 0, 0, 0.024),
      0 4.6px 10px rgba(0, 0, 0, 0.035), 0 11.2px 24.1px rgba(0, 0, 0, 0.046),
      0 37px 80px rgba(0, 0, 0, 0.07);

    @include transition {
      transition: transform var(--trans-short) var(--ease-back);

      &:hover {
        transform: translate3d(-50%, -50%, 0) scale(1.125);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 4px solid var(--a11y-color);
    }

    svg {
      display: block;
      width: 80%;
      height: auto;
      fill: var(--foreground);
    }
  }

  // time left and progress bar
  &__chrome {
    /* Positioning */
    position: absolute;
    bottom: calc(var(--button-click-offset) * 1.25);
    left: var(--button-click-offset);

    /* Display & Box Model */
    width: 100%;
    width: calc(100% - (var(--button-click-offset) * 2));
    border-radius: 100vw;
    padding: 0 var(--button-click-offset);

    height: var(--button-height);
    display: flex;
    align-items: center;
    background-color: hsla(var(--b-h), var(--b-s), var(--b-l), 70%);
    backdrop-filter: blur(10px);
    box-shadow: 0 1.7px 3.6px rgba(0, 0, 0, 0.024),
      0 4.6px 10px rgba(0, 0, 0, 0.035), 0 11.2px 24.1px rgba(0, 0, 0, 0.046),
      0 37px 80px rgba(0, 0, 0, 0.07);

    &:focus-visible {
      outline-offset: 4px;
      outline: 4px solid var(--a11y-color);
    }

    .time {
      color: var(--foreground);
      margin-right: var(--button-click-offset);
      position: relative;
      position: relative;
      z-index: 1;
      pointer-events: none;
    }
  }

  &__timeline {
    position: relative;
    cursor: crosshair;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    z-index: 1;

    .length,
    .current {
      height: $bar-size;
      border-radius: $bar-size;
    }

    .length {
      width: 100%;
      background: hsla(var(--f-h), var(--f-s), var(--f-l), 25%);
      position: absolute;
      top: calc(50% - #{$bar-size * 0.5});
      z-index: 0;
      pointer-events: none;
    }

    .current {
      position: relative;
      z-index: 1;
      pointer-events: none;
      background: var(--foreground);
      transition: width 300ms linear;
    }
  }
}

.ui-enter-active,
.ui-leave-active {
  transition: opacity var(--trans-medium) var(--ease);
}
.ui-enter,
.ui-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--trans-short) var(--ease);
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
