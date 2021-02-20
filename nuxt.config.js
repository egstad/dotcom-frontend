export default {
  target: 'static',
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
        content: `summary`
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
        content: `TODO:IMAGE_URL_HERE`
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/SanityImageBuilder.js', '@/plugins/PageMetadata.js'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    // Doc: https://sanity.nuxtjs.org/
    '@nuxtjs/sanity'
  ],

  sanity: {
    minimal: true
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
    extend(config, ctx) {}
  }
}
