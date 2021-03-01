<template>
  <div>
    <SanityContent :blocks="blocks" :serializers="serializers" class="copy" />
  </div>
</template>

<script>
import { SanityContent } from '@nuxtjs/sanity/dist/components/sanity-content'
import CopyHeadline from '@/components/atoms/Copy/CopyHeadline'
import CopyLink from '@/components/atoms/Copy/CopyLink'
import CopyLinkInternal from '@/components/atoms/Copy/CopyLinkInternal'

export default {
  components: { SanityContent },
  props: {
    blocks: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      serializers: {
        marks: {
          link: CopyLink,
          internalLink: CopyLinkInternal
        },
        styles: {
          h1: CopyHeadline,
          h2: CopyHeadline,
          h3: CopyHeadline,
          h4: CopyHeadline,
          normal: CopyHeadline,
          blockquote: CopyHeadline
        }
      }
    }
  }
}
</script>
