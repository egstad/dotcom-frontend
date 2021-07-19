<template>
  <Grid>
    <Column :xs="12" :lg="8" :lg-start="5" :xl="6" :xl-start="4">
      <SanityContent :blocks="blocks" :serializers="serializers" class="copy" />
    </Column>
  </Grid>
</template>

<script>
import { SanityContent } from '@nuxtjs/sanity/dist/components/sanity-content'
import CopyLinkInternal from '@/components/atoms/Copy/CopyLinkInternal'
import CopyLink from '@/components/atoms/Copy/CopyLink'
import CopyH1 from '@/components/atoms/Copy/CopyH1'
import CopyH2 from '@/components/atoms/Copy/CopyH2'
import CopyH3 from '@/components/atoms/Copy/CopyH3'
import CopyH4 from '@/components/atoms/Copy/CopyH4'
import CopyH5 from '@/components/atoms/Copy/CopyH5'
import CopyH6 from '@/components/atoms/Copy/CopyH6'
import CopyP from '@/components/atoms/Copy/CopyP'
import CopyListItem from '@/components/atoms/Copy/CopyListItem'
import CopyCode from '@/components/atoms/Copy/CopyCode'
import CopyUnderline from '@/components/atoms/Copy/CopyUnderline'
import CopyHighlight from '@/components/atoms/Copy/CopyHighlight'
// info on serializers: https://github.com/rdunk/sanity-blocks-vue-component

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
          internalLink: CopyLinkInternal,
          code: CopyCode,
          underline: CopyUnderline,
          highlight: CopyHighlight
        },
        styles: {
          h1: CopyH1,
          h2: CopyH2,
          h3: CopyH3,
          h4: CopyH4,
          h5: CopyH5,
          h6: CopyH6,
          normal: CopyP
        },
        listItem: CopyListItem
      }
    }
  }
}
</script>

<style lang="scss">
.copy {
  strong {
    font-family: 'Lars Black';
  }

  em {
    font-style: italic;
  }

  a {
    position: relative;
    color: currentColor;
  }

  li {
    counter-increment: item;
  }

  ul,
  ol {
    li {
      position: relative;
      padding-left: 1.4em;

      &::before {
        display: inline-block;
        position: absolute;
        width: 1em;
        left: 0;
      }
    }
  }

  ol {
    list-style: none;
    counter-reset: item;

    li:before {
      content: counter(item);
      font-feature-settings: 'ss04';
      font-size: 1.5em;
      top: 0;
      left: 0;
    }
  }

  ul {
    list-style: none;

    li:before {
      content: '•';
      font-size: 150%;
      top: -0.25em;
      left: 0.15em;
    }
  }

  ul,
  ol,
  p {
    margin-bottom: 1em;
  }
}
</style>
