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
  padding-left: var(--button-click-offset);
  padding-right: var(--button-click-offset);

  strong {
    font-family: 'Lars Black';
  }

  em {
    font-style: italic;
  }

  ::v-deep a {
    position: relative;
    color: inherit;
  }

  // ::v-deep a {
  //   color: inherit;

  //   &:focus-within {
  //     outline-offset: 4px;
  //     outline: 4px solid var(--a11y-color);
  //   }
  // }

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

  h2 {
    font-size: clamp(32px, 2vw, 72px);
  }
}
</style>
