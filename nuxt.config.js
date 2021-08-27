export default {
  target: 'static',
  // server: {
  //   host: '0.0.0.0'
  // },
  /*
   ** Headers of the page
   */
  head: {
    title: 'Egstad',
    meta: [
      // Basic metadata
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: 'Egstad'
      },
      {
        hid: `og:site_name`,
        property: 'og:site_name',
        content: `Egstad`
      },
      {
        hid: `twitter:card`,
        property: 'twitter:card',
        content: `summary_large_image`
      },
      {
        hid: `twitter:site`,
        property: 'twitter:site',
        content: `@jordanegstad`
      },
      {
        hid: `twitter:creator`,
        property: 'twitter:creator',
        content: `@jordanegstad`
      },
      {
        hid: `twitter:title`,
        property: 'twitter:title',
        content: `Egstad`
      },
      {
        hid: `twitter:description`,
        property: 'twitter:description',
        content: `Jordan Egstad is a graphic designer and web developer creating expressive and enduring brand identities and websites.`
      },
      {
        hid: `twitter:image`,
        property: 'twitter:image',
        content: `https://cdn.sanity.io/images/sjl79kwi/production/baeaf1ae8651b1dd53b2885caf459c45556d9cb2-1080x720.jpg?rect=0,77,1080,564&w=1200&h=627&fit=clip&auto=format`
      },
      {
        hid: `og:title`,
        property: 'og:title',
        content: `Egstad`
      },
      {
        hid: 'description',
        name: 'description',
        content: `Jordan Egstad is a graphic designer and web developer creating expressive and enduring brand identities and websites.`
      },
      {
        hid: `og:description`,
        property: 'og:description',
        content: `Jordan Egstad is a graphic designer and web developer creating expressive and enduring brand identities and websites.`
      },
      {
        hid: `og:image`,
        property: 'og:image',
        content: `https://cdn.sanity.io/images/sjl79kwi/production/baeaf1ae8651b1dd53b2885caf459c45556d9cb2-1080x720.jpg?rect=0,77,1080,564&w=1200&h=627&fit=clip&auto=format`
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: 'var(--foreground)',
    continuous: true
  },
  /*
   ** Global CSS
   */
  css: ['~/assets/styles/reset.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/PageMetadata.js' },
    { src: '~/plugins/ThemeChanger.js' },
    { src: '~/plugins/ThemeScroller.js' },
    { src: '~/plugins/Device.client.js' },
    { src: '~/plugins/Sanity.js' },
    { src: '~/plugins/Routes.js' },
    { src: '~/plugins/Grid.js' },
    { src: '~/plugins/Type.js' },
    { src: '~/plugins/VueSwipeEvents.client.js' },
    { src: '~/plugins/IntersectionObserver.client.js' },
    { src: '~/plugins/ViewportAnimations.client.js' }
    // { src: '~/plugins/Scroll.client.js' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    // Doc: https://github.com/nuxt-community/style-resources-module
    '@nuxtjs/style-resources',
    // Doc: https://google-analytics.nuxtjs.org/
    '@nuxtjs/google-analytics'
  ],

  googleAnalytics: {
    id: 'UA-127604100-1'
  },

  styleResources: {
    hoistUseStatements: true,
    scss: ['~/assets/styles/_vars.scss', '~/assets/styles/typography.scss']
  },
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/pwa'],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    transpile: [
      'gsap',
      'three',
      'three/examples/jsm/controls/OrbitControls',
      'three/examples/jsm/lights/LightProbeGenerator'
    ]
  },
  generate: {
    crawler: true,
    exclude: ['/is/*']
  }
}
