<!--
  This component changes the page theme when its scroll target is hit. The prop
  `fadeTarget` tells the component to either change the theme when the `Target`
  element hits the 'middle' or 'top' of the viewport.

  Because there can be (and are) multiple ThemeScrollChangers on a single page,
  each instance of this component must be able to act alone and in tandem. When
  the component enters the viewport for the first time and while it is still
  below its `fadeTarget` it caches the current page theme once and adds a scroll
  watcher. This scroll watcher is removed once the element leaves the viewport
  so as to not interphere with other instances of this component on the same page.

  Since the theme could have changed multiple times before this component enters
  the viewport we won't know what the before transition theme should be until this
  point. But the component knows what theme it will be changing the page to. So
  once the original theme is cached the component just toggles between the original
  theme and the new theme when the scroll watcher registers that the `fadeTarget`
  has been reached.
-->
<template>
  <div
    :data-background="background"
    :data-foreground="foreground"
    :data-accent="accent"
    :data-target="fadeTarget"
    class="scroll-to-theme"
  ></div>
</template>

<script>
import { hsla } from '@/assets/js/utils/SanityHSL'

export default {
  props: {
    colors: {
      type: Object,
      required: true
    },
    fadeTarget: {
      type: String,
      required: true
    }
  },

  computed: {
    background() {
      return this.colors.background ? hsla(this.colors.background.hsl) : null
    },
    foreground() {
      return this.colors.foreground ? hsla(this.colors.foreground.hsl) : null
    },
    accent() {
      return this.colors.accent ? hsla(this.colors.accent.hsl) : null
    }
  }
}
</script>

<style scoped>
.scroll-to-theme {
  display: block;
  height: 10px;
  width: 100%;
  background: red;
}
</style>
