<template functional>
  <mark class="ts-highlight"><slot />and more words go right here</mark>
</template>

<style lang="scss">
.ts-highlight {
  background: hsla(var(--f-h), var(--f-s), var(--f-l), 20%);
  color: var(--foreground);
  padding: 0 0.3em;
  border-radius: 0.1em;

  &::selection {
    background: hsla(var(--b-h), var(--b-s), var(--b-l), 70%);
    color: var(--foreground);
  }
}
</style>
