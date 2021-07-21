<template>
  <article class="piece" :data-title="piece.content.title">
    <header class="piece__header">
      <h2>{{ piece.content.title }}</h2>
    </header>

    <Slices :slices="piece.content.slices" class="piece__content"></Slices>
  </article>
</template>

<script>
import Slices from '@/components/templates/Slices'

export default {
  components: {
    Slices
  },
  props: {
    piece: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      observer: null,
      observerOptions: null
    }
  },
  mounted() {
    // this.observerSetup()
    this.$nuxt.$on('window::resize', this.handleResize)
  },
  beforeDestroy() {
    // this.observerDestroy()
  },
  methods: {
    handleResize() {
      this.observerDestroy()
      this.observerSetup()
    },
    observerSetup() {
      this.observerOptions = {
        rootMargin: `0px 0px ${this.$store.state.device.winWidth * 0.5}px  0px`,
        threshold: 0.5 // half of item height
      }
      this.observer = new IntersectionObserver(
        this.observerHandler,
        this.observerOptions
      )

      this.observer.observe(this.$el)
    },
    observerDestroy() {
      this.observer.unobserve(this.$el)
    },
    observerHandler(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.$nuxt.$emit('nav::updateActiveItem', entry.target.dataset.title)
        }
      })
    }
  }
}
</script>

<style scoped>
.piece {
  position: relative;
  border-bottom: 1px solid #000;
  display: grid;
  grid-template-rows: 1fr 44px;
}

.piece__header {
  order: 2;
}

/* wrapper for slices */
.piece >>> .piece__content {
  /* display: flex; */
  /* width: 100%; */
  /* height: 70vh; */
  /* min-height: 50vw; */
  /* padding-top: 44px; */
}

/* .piece >>> .pic,
.piece >>> .vid {
  object-fit: contain;
} */

.piece >>> .scroll-to-theme {
  position: absolute;
  top: 50%;
  left: 0;
}
</style>
