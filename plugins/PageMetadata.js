import { getImageAsset } from '@sanity/asset-utils'

export default ({ app }, inject) => {
  inject('setPageMetadata', (payload) => {
    const pageMeta = []
    const pageImage = payload.socialImage
    const pageDesc = payload.socialDescription
    const pageTitle = payload.socialTitle
      ? `Egstad • ${payload.socialTitle}`
      : `Egstad • ${payload.title}`

    if (payload === undefined) {
      return
    }

    // If social title is created
    if (payload.socialTitle) {
      pageMeta.push({
        hid: `og:title`,
        property: 'og:title',
        content: pageTitle
      })

      pageMeta.push({
        hid: `twitter:title`,
        property: 'twitter:title',
        content: pageTitle
      })
    }

    // Description for social
    if (pageDesc) {
      pageMeta.push({
        hid: `description`,
        property: 'description',
        content: pageDesc
      })

      pageMeta.push({
        hid: `og:description`,
        property: 'og:description',
        content: pageDesc
      })

      pageMeta.push({
        hid: `twitter:description`,
        property: 'twitter:description',
        content: pageDesc
      })
    }

    // Image for social
    if (pageImage) {
      const imageAsset = getImageAsset(pageImage, {
        projectId: app.$sanityClient.clientConfig.projectId,
        dataset: app.$sanityClient.clientConfig.dataset
      })
      const croppedImage = `${imageAsset.url}?w=1200&height=627&auto=format&fit=clip`

      pageMeta.push({
        hid: `og:image`,
        property: 'og:image',
        content: croppedImage
      })

      pageMeta.push({
        hid: `twitter:image`,
        property: 'twitter:image',
        content: croppedImage
      })
    }

    return {
      title: pageTitle,
      meta: [...pageMeta]
    }
  })
}
