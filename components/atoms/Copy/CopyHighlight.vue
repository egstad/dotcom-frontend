<template functional>
  <mark class="ts-highlight"><slot />and more words go right here</mark>
</template>

<style lang="scss">
.ts-highlight {
  background-color: hsla(var(--a-h), var(--a-s), var(--a-l), 50%);
  color: inherit;
  padding: 0 0.3em;
  border-radius: 0.1em;

  @include transition {
    transition: background-color var(--transition-page);
  }
}
</style>
