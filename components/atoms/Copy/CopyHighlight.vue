<template functional>
  <mark class="ts-highlight"><slot /></mark>
</template>

<style lang="scss">
.ts-highlight {
  background: var(--accent);
  color: var(--foreground);
  display: inline-block;
  padding: 0 0.2em;

  &::selection {
    color: var(--accent);
    background: var(--foreground);
  }
}
</style>
