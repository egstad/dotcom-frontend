import { getImageAsset } from '@sanity/asset-utils'

export default ({ app }, inject) => {
  inject('setPageMetadata', (content) => {
    const pageMeta = []
    const pageImage = content.socialImage
    const pageDesc = content.socialDescription
    const pageTitle = content.socialTitle
      ? `Egstad • ${content.socialTitle}`
      : `Egstad • ${content.title}`

    if (content === undefined) {
      return
    }

    // If social title is created
    if (content.socialTitle) {
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
        projectId: app.$sanity.config.projectId,
        dataset: app.$sanity.config.dataset
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
