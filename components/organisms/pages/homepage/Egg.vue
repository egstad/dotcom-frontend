<template>
  <div ref="eggcarton" class="eggcarton" @click="relocateEggball">
    <div ref="eggball" class="eggball">
      <canvas ref="canvas"></canvas>
    </div>
    <!-- <video
      ref="video"
      src="/egg/vid.mp4"
      style="display:none"
      playsinline
      muted
      loop
      autoplay
    ></video> -->
  </div>
</template>

<script>
import * as THREE from 'three'
import gsap from 'gsap'

export default {
  data() {
    return {
      renderer: null,
      scene: null,
      camera: null,
      mesh: null,
      raf: null,
      meshMoveTimeout: null,
      meshMoveDuration: 2500,
      eggBallCoords: null,
      filmLocation: null,
      cachedFogColor: null
    }
  },
  computed: {
    theme() {
      return this.$store.state.cssVars
    }
  },
  watch: {
    theme(newValue, oldValue) {
      this.updateFog(newValue, oldValue)
    }
  },
  mounted() {
    this.init()
    this.animate()
    window.addEventListener('resize', this.onWindowResize)

    this.meshMoveTimeout = setTimeout(() => {
      this.$store.commit('setHeaderVisibility', true)
      this.relocateEggball(true)
    }, this.meshMoveDuration)
  },
  beforeDestroy() {
    // kill the animation loop
    cancelAnimationFrame(this.raf)
    // teardown resize event
    this.$nuxt.$off('egg::updateTheme', this.updateFog)

    // this.$nuxt.$off('window::resize', this.onWindowResize)
    window.removeEventListener('resize', this.onWindowResize)

    // window.removeEventListener('mousemove', this.onMouseMove)
    // this.$app.$off('updatePosition')
    clearTimeout(this.meshMoveTimeout)
  },
  methods: {
    init() {
      this.camera = new THREE.PerspectiveCamera(
        24,
        this.$refs.eggball.clientWidth / this.$refs.eggball.clientWidth,
        1,
        1000
      )
      this.camera.position.z = 500
      this.mouse = new THREE.Vector2()
      this.target = new THREE.Vector2()
      this.scene = new THREE.Scene()

      const texture = new THREE.TextureLoader().load('egg/head.jpg')
      // const texture = new THREE.VideoTexture(this.$refs.video)
      const material = new THREE.MeshBasicMaterial({ map: texture })
      // this.$refs.video.play()

      const radius = 100
      const widthSegments = 64
      const heightSegments = 64
      const geometry = new THREE.SphereBufferGeometry(
        radius,
        widthSegments,
        heightSegments
      )

      this.mesh = new THREE.Mesh(geometry, material)
      this.mesh.rotation.y = 0.35
      this.scene.add(this.mesh)

      this.updateFog()

      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        canvas: this.$refs.canvas,
        antialias: true
      })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(
        this.$refs.eggball.clientWidth,
        this.$refs.eggball.clientWidth
      )
    },
    animate() {
      this.raf = requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
    },
    updateFog(newTheme, oldTheme) {
      // if no theme provided, set fog to current color
      if (!newTheme && !oldTheme) {
        const currentTheme = this.$store.state.cssVars
        const fogColor = new THREE.Color(
          `hsl(${currentTheme['--b-h']}, ${currentTheme['--b-s']}, ${currentTheme['--b-l']})`
        )

        this.scene.fog = new THREE.Fog(fogColor, 420, 515)
      } else {
        const initial = new THREE.Color(
          `hsl(${oldTheme['--b-h']}, ${oldTheme['--b-s']}, ${oldTheme['--b-l']})`
        )
        const nextTheme = new THREE.Color(
          `hsl(${newTheme['--b-h']}, ${newTheme['--b-s']}, ${newTheme['--b-l']})`
        )
        gsap.to(initial, {
          delay:
            parseFloat(
              getComputedStyle(
                document.querySelector('.site')
              ).getPropertyValue('--trans-delay')
            ) * 0.001,
          duration:
            parseFloat(
              getComputedStyle(
                document.querySelector('.site')
              ).getPropertyValue('--trans-long')
            ) * 0.001,
          r: nextTheme.r,
          g: nextTheme.g,
          b: nextTheme.b,
          onUpdate: (e) => {
            this.scene.fog = new THREE.Fog(initial, 420, 515)
          }
        })
      }
    },
    onWindowResize() {
      // update camera
      this.camera.aspect =
        this.$refs.eggball.clientWidth / this.$refs.eggball.clientWidth
      this.camera.updateProjectionMatrix()

      // update renderer
      this.renderer.setSize(
        this.$refs.eggball.clientWidth,
        this.$refs.eggball.clientWidth
      )

      if (!this.isInViewport(this.$refs.canvas)) {
        this.relocateEggball()
      }
    },
    updateEggballCoords() {
      this.eggBallCoords = {
        // if eggBallCoords don't exist yet, start from zero
        // otherwise, cache the old xNew and yNew before they update
        x: !this.eggBallCoords ? 300 : this.eggBallCoords.xNew,
        y: !this.eggBallCoords ? 300 : this.eggBallCoords.yNew,
        xNew: Math.round(
          this.getRandomInt(
            0,
            window.innerWidth - this.$refs.eggcarton.clientWidth
          )
        ),
        yNew: Math.round(
          this.getRandomInt(
            0,
            window.innerHeight - this.$refs.eggcarton.clientHeight
          )
        )
      }
    },
    setEggballRollVelocity(isFirstTime) {
      this.updateEggballCoords()

      // x difference
      const xd = this.eggBallCoords.x - this.eggBallCoords.xNew
      // x planes in window
      const xp = window.innerWidth / 24
      // y difference
      const yd = this.eggBallCoords.y - this.eggBallCoords.yNew
      // y planes in document
      const yp = window.innerHeight / 24

      // i fuqd up. somehow these are backwards. but it works. so wutever.
      gsap.to(this.mesh.rotation, {
        duration: 1.5,
        ease: 'Power4.easeOut',
        x: isFirstTime === true ? 6.75 : Math.round((xd / xp) * 0.2),
        y: isFirstTime === true ? -1 : Math.round((yd / yp) * 0.2)
      })

      gsap.to(
        this.$refs.eggcarton,
        {
          duration: 1.5,
          ease: 'Power4.easeOut',
          x: this.eggBallCoords.xNew,
          y: this.eggBallCoords.yNew
        },
        '-=1.5'
      )
    },
    relocateEggball(isFirst) {
      clearTimeout(this.meshMoveTimeout)
      this.setEggballRollVelocity(isFirst)
    },
    getRandomInt(min, max) {
      return Math.floor(Math.random() * max) + min
    },
    isInViewport(elem) {
      const distance = elem.getBoundingClientRect()
      return (
        distance.top >= 0 &&
        distance.left >= 0 &&
        distance.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        distance.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
$width: 22vw;
$max-width: 600px;

.eggball {
  height: 100%;
  cursor: pointer;

  canvas {
    width: 100%;
    height: 100%;
  }
}

.eggcarton {
  min-width: 150px;
  min-height: 150px;
  max-width: $max-width;
  max-height: $max-width;
  width: $width;
  height: $width;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  transform: translate3d(40%, -200%, 0);

  &:after {
    content: '';
    display: block;
    min-width: 150px;
    min-height: 150px;
    max-width: $max-width;
    max-height: $max-width;
    width: $width;
    height: $width;
    position: absolute;
    top: 0;
    left: 20%;
    background: black;
    border-radius: 100vw;
    transform-origin: center bottom;
    mix-blend-mode: multiply;
    filter: blur(5px);
    transform: matrix(1, -0.2, 0, 0.8, 0, 0);
    z-index: -1;
    opacity: 0.5;
  }
}
</style>
