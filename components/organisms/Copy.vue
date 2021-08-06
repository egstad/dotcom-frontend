<!--
Note: This depends on
https://github.com/rdunk/sanity-blocks-vue-component/tree/legacy#sanity-blocks-vue-component
-->

<template>
  <div class="copy">
    <BlockContent :blocks="blocks" :serializers="serializers" />
  </div>
</template>

<script>
// info on serializers: https://github.com/rdunk/sanity-blocks-vue-component
import BlockContent from 'sanity-blocks-vue-component'
import CopyLinkInternal from '@/components/atoms/Copy/CopyLinkInternal'
import CopyLink from '@/components/atoms/Copy/CopyLink'
import CopyCode from '@/components/atoms/Copy/CopyCode'
import CopyUnderline from '@/components/atoms/Copy/CopyUnderline'
import CopyHighlight from '@/components/atoms/Copy/CopyHighlight'

export default {
  components: { BlockContent },
  props: {
    blocks: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      serializers: {
        // types: {
        //   block: (props) => {
        //     const {
        //       node: { children, style }
        //     } = props

        //     switch (style) {
        //       case 'h1':
        //         return <h1>{children}</h1>
        //       case 'h2':
        //         return <h2>{children}</h2>
        //       case 'h3':
        //         return <h3>{children}</h3>
        //       case 'h4':
        //         return <h4>{children}</h4>
        //       case 'h5':
        //         return <h5>{children}</h5>
        //       case 'h6':
        //         return <h6>{children}</h6>
        //       case 'normal':
        //         return <p>{children}</p>
        //       default:
        //     }
        //   }
        // },
        marks: {
          link: CopyLink,
          internalLink: CopyLinkInternal,
          code: CopyCode,
          underline: CopyUnderline,
          highlight: CopyHighlight
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.copy {
  strong {
    font-variation-settings: 'wght' 1000, 'MONO' 0, 'ital' 0;
  }

  em {
    font-variation-settings: 'ital' 1;
    font-style: none;
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
}
</style>
