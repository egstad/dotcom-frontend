<template>
  <div class="page">
    <canvas ref="canvas"></canvas>
    <video ref="video" autoplay></video>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

import gsap from 'gsap'

export default {
  data() {
    return {
      renderer: null,
      scene: null,
      camera: null,
      mesh: null,
      raf: null,
      fogColor: null,
      loader: null,
      group: null,
      material: null,
      showLoombeam: null,
      loombeam: null,
      lights: null,
      controls: null
    }
  },
  mounted() {
    this.initWebcam()
    this.init()
    this.animate()
    // window.addEventListener('resize', this.onWindowResize)
  },
  beforeDestroy() {
    // kill the animation loop
    cancelAnimationFrame(this.raf)

    // this.$nuxt.$off('window::resize', this.onWindowResize)
    window.removeEventListener('resize', this.onWindowResize)
  },
  methods: {
    init() {
      this.camera = new THREE.PerspectiveCamera(
        12,
        this.$store.state.device.winWidth / this.$store.state.device.winHeight,
        1,
        12000
      )
      this.camera.position.z = 1000
      this.mouse = new THREE.Vector2()
      this.target = new THREE.Vector2()

      this.scene = new THREE.Scene()
      this.fogColor = new THREE.Color(0x00000005)
      this.scene.fog = new THREE.Fog(this.fogColor, 500, 2000)

      this.loader = new STLLoader()
      this.group = new THREE.Group()
      this.scene.add(this.group)

      new THREE.CubeTextureLoader()
        .setPath('../images/threejs/cube/MilkyWay/')
        .load(
          [
            'dark-s_px.jpg',
            'dark-s_nx.jpg',
            'dark-s_py.jpg',
            'dark-s_ny.jpg',
            'dark-s_pz.jpg',
            'dark-s_nz.jpg'
          ],
          (texture) => {
            const textureLoader = new THREE.TextureLoader()

            const normalMap2 = textureLoader.load(
              '../images/threejs/textures/water/Water_1_M_Normal.jpg'
            )

            const clearcoatNormaMap = textureLoader.load(
              '../images/threejs/textures/pbr/Scratched_gold/Scratched_gold_01_1K_Normal.png'
            )

            this.material = new THREE.MeshPhysicalMaterial({
              ior: 1.43,
              opacity: 0.5,
              transmission: 0.5,
              clearcoat: 1.0,
              metalness: 1.0,
              /* eslint-disable */
              color: 0x565add,
              /* eslint-enable */
              normalMap: normalMap2,
              normalScale: new THREE.Vector2(0.0001, 0.0001),
              clearcoatNormalMap: clearcoatNormaMap,

              // y scale is negated to compensate for normal map handedness.
              clearcoatNormalScale: new THREE.Vector2(0.002, -0.002)
            })

            if (this.showLoombeam) {
              this.loader.load('models/stl/loombeam.stl', function(geometry) {
                this.loombeam = new THREE.Mesh(geometry, material)

                this.loombeam.position.set(0, 0, 0)
                // mesh.rotation.set(-Math.PI / 2, 0, 0);
                this.loombeam.scale.set(10000, 10000, 10000)

                this.group.add(this.loombeam)
              })
            }

            // cambubble
            const size = this.showLoombeam ? 200 : 1000
            const cambubble = new THREE.SphereGeometry(size, 64, 32)
            const videoTexture = new THREE.VideoTexture(this.video)
            const videoMaterial = new THREE.MeshPhysicalMaterial({
              // ior: 1.43,
              map: videoTexture,
              clearcoat: 1.0,
              /* eslint-disable */
              color: 0xffffff,
              /* eslint-enable */
              normalMap: normalMap2,
              normalScale: new THREE.Vector2(0.1, 0.1),
              clearcoatNormalMap: clearcoatNormaMap,

              // y scale is negated to compensate for normal map handedness.
              clearcoatNormalScale: new THREE.Vector2(1, -1)
            })
            this.mesh = new THREE.Mesh(cambubble, videoMaterial)
            this.mesh.overdraw = true
            this.mesh.castShadow = true
            this.mesh.position.set(0, 0, 0)
            this.mesh.rotation.set(-Math.PI / 2, -Math.PI / 2, -Math.PI / 2)
            this.mesh.scale.set(0.2, 0.2, 0.2)
            this.group.add(this.mesh)

            this.scene.background = new THREE.Color(0x000000)
            this.scene.environment = texture
          }
        )

      // const texture = new THREE.VideoTexture(this.$refs.video)
      const material = new THREE.MeshBasicMaterial({ map: this.texture })
      // this.$refs.video.play()

      this.lights = []

      /* eslint-disable */
      const lightColor = [
        0x565add,
        0x3d7dff,
        0x00b477,
        0xfaa740,
        0xea4b3a,
        0xe477cc,
        0xa19aaf,
        0x565add,
        0x3d7dff,
        0x00b477,
        0xfaa740,
        0xea4b3a,
        0xe477cc,
        0xa19aaf
      ]
      /* eslint-enable */

      for (let index = 0; index < 6; index++) {
        const particleLight = new THREE.Mesh(
          new THREE.SphereGeometry(2, 4, 4),
          new THREE.MeshBasicMaterial({ color: lightColor[index] })
        )
        this.scene.add(particleLight)
        particleLight.add(new THREE.PointLight(lightColor[index], 0.25))
        this.lights.push(particleLight)
      }

      // this.renderer = new THREE.WebGLRenderer()
      this.renderer = new THREE.WebGLRenderer({
        // antialias: true,
        // alpha: false,
        canvas: this.$refs.canvas
      })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping
      this.renderer.toneMappingExposure = 1.5
      this.renderer.outputEncoding = THREE.sRGBEncoding

      /* eslint-disable */
      new OrbitControls(this.camera, this.$refs.canvas)
      /* eslint-enable */

      window.addEventListener('resize', this.onWindowResize)

      // container.appendChild(renderer.domElement)

      // const radius = 100
      // const widthSegments = 64
      // const heightSegments = 64
      // const geometry = new THREE.SphereBufferGeometry(
      //   radius,
      //   widthSegments,
      //   heightSegments
      // )

      // this.mesh = new THREE.Mesh(geometry, material)
      // this.mesh.rotation.y = 0.35
      // this.scene.add(this.mesh)

      // this.updateFog()

      // this.renderer = new THREE.WebGLRenderer({
      //   alpha: true,
      //   canvas: this.$refs.canvas,
      //   antialias: true
      // })
      // this.renderer.setPixelRatio(window.devicePixelRatio)
      // this.renderer.setSize(
      //   this.$refs.eggball.clientWidth,
      //   this.$refs.eggball.clientWidth
      // )
    },
    initWebcam() {
      this.video = this.$refs.video
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          this.video.srcObject = stream
          this.video.play()
        })
        .catch(function(err) {
          console.log('An error occured! ' + err)
        })
    },
    animate() {
      this.raf = requestAnimationFrame(this.animate)
      this.render()
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
      const width = window.innerWidth
      const height = window.innerHeight

      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(width, height)
    },
    render() {
      const timer = Date.now() * 0.0000025

      this.lights.forEach((light, index) => {
        if (!light) return
        light.position.x = Math.sin(timer * 7 * index) * 300 * index
        light.position.y = Math.cos(timer * 5 * -index) * 400 * -index
        light.position.z = Math.cos(timer * 3 * index) * 300 * index
      })

      if (this.howLoombeam) {
        this.loombeam.rotation.x += Math.sin(0.001)
        this.loombeam.rotation.y += Math.sin(0.001)
        this.loombeam.rotation.z += Math.sin(0.001)
      }

      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
}

// canvas {
//   width: 100%;
//   height: 100%;
// }
</style>
