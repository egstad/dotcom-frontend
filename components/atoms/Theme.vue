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
    :data-background="colors.background"
    :data-foreground="colors.foreground"
    :data-target="fadeTarget"
    :data-accent="colors.accent"
    class="scroll-to-theme"
  ></div>
</template>

<script>
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
  }
}
</script>

<style lang="scss" scoped>
.scroll-to-theme {
  display: block;
  height: 0px;
  width: 100%;
}
</style>
