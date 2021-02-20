<template>
  <div>
    <img ref="image" alt="" style="display:none" @load="canvasSetup" />
    <canvas ref="canvas" @click="nextImage"></canvas>
    <button @click="download">download</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      global_width: 1080,
      global_height: 720,
      ratio: null,
      canvas: null,
      ctx: null,
      image: null,
      images: [
        'boomer.jpg',
        'coffee.jpg',
        'covid.jpg',
        'cuddle.jpg',
        'finger.jpg',
        'hair.jpg',
        'hat.jpg',
        'rudolf.jpg'
      ]
    }
  },
  mounted() {
    this.ratio = window.devicePixelRatio || 1
    this.canvas = this.$refs.canvas
    this.ctx = this.canvas.getContext('2d')
    this.image = this.$refs.image

    this.handleIt()
    this.setRandomImage()
    window.addEventListener('keyup', this.nextImage)
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.nextImage)
  },
  methods: {
    handleIt() {
      // split message
      const createMessage = () => {
        // get message from route path
        const s = this.$route.query.a
          // remove empty spaces character
          .replace(/%20/g, ' ')
          // remove hyphens
          .split('-')
          // with spaces
          .join(' ')

        let middle = Math.floor(s.length / 2)
        const before = s.lastIndexOf(' ', middle)
        const after = s.indexOf(' ', middle + 1)

        // This code assumes that there actually are spaces on both sides of the middle.
        if (middle - before < after - middle) {
          middle = before
        } else {
          middle = after
        }

        return {
          topText: s.substr(0, middle).toUpperCase(),
          bottomText: s.substr(middle + 1).toUpperCase()
        }
      }

      const defaultMessage = () => {
        return {
          topText: 'top',
          bottomText: 'bottom'
        }
      }

      console.log(this.$route.query)

      this.message = this.$route.query.a ? createMessage() : defaultMessage()
    },
    setRandomImage() {
      const randomNumber = Math.floor(Math.random() * this.images.length)
      this.$refs.image.src = `/memer/${this.images[randomNumber]}`
    },
    canvasSetup() {
      if (this.ctx) {
        this.init()
      }
    },
    init() {
      this.draw()
    },
    draw() {
      this.ctx.save()

      const ratio = this.ratio * 0.18
      this.canvas.setAttribute('width', this.global_width * ratio)
      this.canvas.setAttribute('height', this.global_height * ratio)
      this.ctx.scale(ratio * 0.5, ratio * 0.5)

      // this.canvas.setAttribute('width', this.global_width * this.ratio)
      // this.canvas.setAttribute('height', this.global_height * this.ratio)
      // this.ctx.scale(this.ratio, this.ratio)
      this.ctx.scale(this.ratio, this.ratio)
      this.drawImage()
      this.drawText()
      this.ctx.restore()
    },
    drawText() {
      // start with giant text
      // 300
      // each letter subracts 24 from that

      // draw top text
      const fontSize = Math.max(350 - this.message.bottomText.length * 24, 124)
      const margin = 20
      this.ctx.font = `${fontSize}px Impact`
      this.ctx.strokeStyle = 'black'
      this.ctx.textAlign = 'center'
      this.ctx.lineWidth = 12

      this.ctx.textBaseline = 'bottom'
      this.ctx.strokeText(
        this.message.topText,
        this.global_width * 0.5,
        fontSize + margin,
        1080 - margin * 2
      )
      this.ctx.textBaseline = 'top'
      this.ctx.strokeText(
        this.message.bottomText,
        this.global_width * 0.5,
        720 - fontSize - margin,
        1080 - margin * 2
      )

      this.ctx.fillStyle = '#fff'

      this.ctx.textBaseline = 'bottom'
      this.ctx.fillText(
        this.message.topText,
        this.global_width * 0.5,
        fontSize + margin,
        1080 - margin * 2
      )
      this.ctx.textBaseline = 'top'
      this.ctx.fillText(
        this.message.bottomText,
        this.global_width * 0.5,
        720 - fontSize - margin,
        1080 - margin * 2
      )

      // draw top text
      this.ctx.fillStyle = 'rgba(0,0,0,0.2)'
      this.ctx.fillRect(0, 0, 28, 395)
      this.ctx.translate(margin, margin / 2)
      this.ctx.rotate(Math.PI / 2)
      this.ctx.fillStyle = 'rgba(255,255,255,0.5)'
      this.ctx.font = `16px Verdana`
      this.ctx.textAlign = 'left'
      this.ctx.fillText("IMAGE TAKEN FROM EGSTAD'S PHOTOBOOTH", 0, 0, 1080)
    },
    drawImage() {
      // this.ctx.imageSmoothingEnabled = false
      this.ctx.drawImage(this.$refs.image, 0, 0)
    },
    download() {
      const link = document.createElement('a')
      link.download = 'filename.png'
      link.href = this.canvas.toDataURL('image/jpeg')
      link.click()
    },
    nextImage() {
      this.setRandomImage()
      this.init()
    }
  }
}
</script>

<style scoped>
canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  object-fit: contain;
}
</style>
