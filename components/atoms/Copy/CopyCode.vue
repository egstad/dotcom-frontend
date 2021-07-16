<template functional>
  <code class="ts-mono">
    <slot />
  </code>
</template>

<style lang="scss" scoped>
.ts-mono {
  display: inline-block;
  padding: 0.2em 0.4em;
  border-radius: 0.2em;
  background: var(--foreground);
  color: var(--background);
  font-family: 'Lars Mono';

  &::selection {
    color: var(--foreground);
    background: var(--background);
  }
}
</style>
