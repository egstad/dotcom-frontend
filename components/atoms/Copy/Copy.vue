<template>
  <SanityContent :blocks="blocks" :serializers="serializers" class="copy" />
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
          h1: CopyHeadline
          // h2: CopyHeadline,
          // h3: CopyHeadline,
          // h4: CopyHeadline,
          // normal: CopyHeadline,
          // blockquote: CopyHeadline
        }
      }
    }
  }
}
</script>

<style scoped>
.copy {
  font-size: clamp(16px, 4vw, 32px);
  max-width: 800px;
}
</style>
