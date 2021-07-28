<template functional>
  <mark class="ts-highlight"><slot />and more words go right here</mark>
</template>

<style lang="scss">
.ts-highlight {
  background: hsla(var(--fH), var(--fS), var(--fL), 20%);
  color: var(--foreground);
  padding: 0 0.2em;
  border-radius: 0.1em;

  &::selection {
    background: hsla(var(--bH), var(--bS), var(--bL), 70%);
    color: var(--foreground);
  }
}
</style>
