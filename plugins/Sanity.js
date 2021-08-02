import sanityClient from '@sanity/client'

const sanity = sanityClient({
  projectId: 'sjl79kwi',
  dataset: 'production',
  apiVersion: `v${new Date().toISOString().split('T')[0]}`,
  useCdn: process.env.NODE_ENV === 'production'
})

export default ({ app, store }, inject) => {
  inject('sanityClient', sanity)
}
