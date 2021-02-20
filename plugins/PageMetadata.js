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
    }

    // Image for social
    if (pageImage) {
      pageMeta.push({
        hid: `og:image`,
        property: 'og:image',
        content: app
          .$urlFor(pageImage)
          .fit('clip')
          .width(1200)
          .height(627)
          .url()
      })
    }

    return {
      title: pageTitle,
      meta: [...pageMeta]
    }
  })
}
