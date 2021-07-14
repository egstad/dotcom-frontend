# Egstad.com

[![Netlify Status](https://api.netlify.com/api/v1/badges/3d3781d3-44d8-45c6-a803-9ec91522cfe1/deploy-status)](https://app.netlify.com/sites/egstad-frontend/deploys)

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev
$ npm start

# build for production and launch server
$ npm run build

# generate static project
$ npm run generate
```

## Technologies

- [Nuxt.js](https://nuxtjs.org) on the front-end
- [Sanity.io](https://www.sanity.io/docs) on the back-end
- Continuous deployment via [Netlify](https://docs.netlify.com/)
- Video CDN was created with [AWS](aws.amazon.com) S3 + Cloudfront

## App Events

| Event Name       | What's it do?                                        | Explicitly called?                                                                              |
| ---------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `page::mounted`  | Tells `$nuxt` app that `mounted()` has completed.    | Yes! Add `this.$nuxt.$emit('page::mounted')` at the end of a page's `mounted()` lifecycle hook. |
| `route::updated` | Informs the app that the user wants to change routes | No, defined once in `layouts/default.vue`                                                       |

## Typography

All type on the Site should be fed through the `<Type>` component. This component is responsible for handling the size and style of all letterforms. The typographic scale across all sizes is generated mathmatically using pixel values. For `xx` machines and above, those absolute (`px`) values are converted to relative (`vw`) units and scale fluidly.
