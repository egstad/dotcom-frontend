<template>
  <div :class="['file', `file--${type}`]">
    <div :class="['file-wrap', `file--size-${size}`]">
      <video
        v-if="type === 'video'"
        ref="video"
        muted
        autoplay
        playsinline
        loop
        :src="file.asset"
      ></video>

      <img v-else ref="img" :src="file.asset" @dragstart.prevent />

      <!-- <pre>{{ file }}</pre>
    <button @click="removeFile(fileIndex)">Delete</button> -->
    </div>

    <nav>
      <button @click="resize">+</button>
      <button @click="$emit('remove')">–</button>
    </nav>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { Draggable } from '@/plugins/gsap/Draggable'
import { InertiaPlugin } from '@/plugins/gsap/InertiaPlugin'

if (process.client) {
  gsap.registerPlugin(Draggable, InertiaPlugin)
}

export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      draggable: null,
      size: 0
    }
  },
  computed: {
    type() {
      let type

      switch (this.file.type) {
        case 'video/mp4':
          type = 'video'
          break

        default:
          type = 'image'
          break
      }

      return type
    },
    element() {
      return this.type === 'video' ? this.$refs.video : this.$refs.img
    }
  },
  mounted() {
    this.$el.style.transform = `translate3d(${this.file.coords.x}px, ${this.file.coords.y}px, 0)`

    // const gridWidth = window.innerWidth * 0.12
    // const gridHeight = window.innerHeight * 0.12

    this.draggable = Draggable.create(this.$el, {
      type: 'x,y',
      edgeResistance: 0.65,
      bounds: '.files',
      inertia: true,
      // liveSnap: true,
      // snap: {
      //   x: (endValue) => {
      //     return Math.round(endValue / gridWidth) * gridWidth
      //   },
      //   y: (endValue) => {
      //     return Math.round(endValue / gridHeight) * gridHeight
      //   }
      // },
      onDragStart: (e) => {
        if (this.type === 'video') this.$refs.video.pause()

        gsap.to(this.$el, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power4.inOut'
        })
      },
      onRelease: (e) => {
        gsap.to(this.$el, {
          scale: 1,
          duration: 0.2,
          ease: 'power4.out'
        })
      },
      onThrowComplete: (e) => {
        if (this.type === 'video') this.$refs.video.play()
        this.$emit('update', this.getCoords(e.x, e.y))
      }
    })
  },
  methods: {
    getCoords(x, y) {
      return {
        x,
        y,
        xPerc: ((x / window.innerWidth) * 100).toFixed(3),
        yPerc: ((y / window.innerHeight) * 100).toFixed(3)
      }
    },
    resize() {
      switch (this.size) {
        case 0:
          this.size++
          break

        case 1:
          this.size++
          break

        case 2:
          this.size++
          break

        default:
          this.size = 0
          break
      }

      this.$nextTick(() => {
        this.draggable[0].applyBounds()
      })
    }
  }
}
</script>

<style>
.file {
  position: absolute;
  top: 0;
  left: 0;
}

.file-wrap {
  position: relative;
  transition: width 250ms ease-in-out;
}

.file--size-0 {
  width: clamp(200px, 40vw, 400px);
}
.file--size-1 {
  width: clamp(200px, 50vw, 500px);
}
.file--size-2 {
  width: clamp(200px, 60vw, 600px);
}
.file--size-3 {
  width: clamp(200px, 70vw, 700px);
}

.file--video {
  width: clamp(200px, 60vw, 600px);
}

nav {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
}

nav button {
  appearance: none;
  border: 0;
  border-radius: 0;
  background: 0;
  cursor: pointer;
}

video,
img {
  display: block;
  width: 100%;
  height: auto;
}
</style>
