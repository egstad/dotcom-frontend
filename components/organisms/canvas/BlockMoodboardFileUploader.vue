<template>
  <div
    @dragover.prevent
    @dragenter.prevent="dropperIsVisible = true"
    @drop.prevent="dropperIsVisible = false"
  >
    <!-- <input type="file" multiple @change="uploadFile" /> -->
    <div :class="['drag', { active: dropperIsVisible }]" @drop="dragFile"></div>

    <transition name="fade">
      <div v-if="!files.length" class="placeholder t-3">
        Drag and drop image or video
      </div>
    </transition>

    <ul class="files">
      <li v-for="(file, fileIndex) in files" :key="`${file.name}}`">
        <File
          :file="file"
          @update="onUpdateCoords($event, fileIndex)"
          @remove="removeFile(fileIndex)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import File from '@/components/organisms/canvas/BlockMoodboardFile.vue'

export default {
  components: {
    File
  },
  data() {
    return {
      files: [],
      dropperIsVisible: false
    }
  },
  mounted() {
    // this.$nuxt.$on('updateCoords', this.onUpdateCoords)
  },
  methods: {
    uploadFile(e) {
      const files = e.target.files

      Object.keys(files).forEach((key) => {
        const reader = new FileReader()
        reader.readAsDataURL(files[key])

        reader.onload = (event) => {
          this.files.push({
            name: files[key].name,
            type: files[key].type,
            asset: event.currentTarget.result,
            coords: this.getCoords(0, 0)
          })
        }
      })
    },
    getCoords(x, y) {
      return {
        x,
        y,
        xPerc: ((x / window.innerWidth) * 100).toFixed(3),
        yPerc: ((y / window.innerHeight) * 100).toFixed(3)
      }
    },
    dragFile(e) {
      const files = e.dataTransfer.files
      const coords = this.getCoords(e.x, e.y)

      Object.keys(files).forEach((key) => {
        const reader = new FileReader()
        reader.readAsDataURL(files[key])

        reader.onload = (event) => {
          this.files.push({
            name: files[key].name,
            type: files[key].type,
            asset: event.currentTarget.result,
            coords
          })
        }
      })

      this.dropperIsVisible = false
    },
    removeFile(index) {
      this.files.splice(index, 1)
    },
    onUpdateCoords(coords, index) {
      this.files[index].coords = coords
    }
  }
}
</script>

<style scoped>
.placeholder {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  padding: clamp(2em, 4vw, 5em);
  border: 0.1em solid hsla(var(--a-h), var(--a-s), var(--a-l), 20%);
  box-shadow: hsla(var(--a-h), var(--a-s), var(--a-l), 25%) 0 0 10vmax;
  border-radius: clamp(1em, 2vw, 2.5em);
  transform-origin: center center;
  text-align: center;
  width: clamp(200px, 80%, 40ch);
}

ul,
li {
  padding: 0;
  margin: 0;
  color: white;
}
.drag {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background-color: rgba(0, 0, 0, 1);
}

.drag.active {
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.2);
}

.files {
  width: 100vw;
  height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out, transform 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate3d(-50%, -50%, 0) scale(0.9);
}
</style>
