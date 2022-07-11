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
        class="asset"
      ></video>

      <img
        v-else
        ref="img"
        :src="file.asset"
        class="asset"
        @dragstart.prevent
      />

      <!-- <pre>{{ file }}</pre>
    <button @click="removeFile(fileIndex)">Delete</button> -->
    </div>

    <nav>
      <button class="t-mono t-1" @click="remove($event)">delete</button>
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
      trigger: this.$el.querySelector('.asset'),
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
          duration: 0.15,
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
    remove(ev) {
      gsap.to(this.$el, {
        y: window.innerHeight * 3,
        duration: 1,
        rotate: Math.random() * 350 + 10,
        ease: 'power4.in',
        onComplete: () => {
          this.$emit('remove', ev)
        }
      })
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

<style lang="scss">
.file {
  position: absolute;
  top: 0;
  left: 0;
  resize: both;
  overflow: auto;
  padding: 4px;
  border: 2px solid transparent;
  border-radius: 4px;
  transition: border-color 0.3s ease-out;
  min-width: 200px;
  min-height: 200px;
  width: clamp(200px, 20vmax, 1660px);

  &::-webkit-resizer {
    background-color: transparent;
  }

  &:hover {
    border-color: hsla(var(--f-h), var(--f-s), var(--f-l), 100%);

    nav button {
      opacity: 1;
      pointer-events: all;
    }
  }
}

.file-wrap {
  position: relative;
  transition: width 250ms ease-in-out;
  width: 100%;
  height: 100%;
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
  border-radius: 100vw;
  background: 0;
  font-size: 1em;
  height: 2em;
  line-height: 0;
  padding: 0 0.8em;
  cursor: pointer;
  background: hsla(var(--f-h), var(--f-s), var(--f-l), 100%);
  margin: 1em;
  text-transform: uppercase;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease-out;
}

.asset {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
