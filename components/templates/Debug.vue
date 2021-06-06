<template>
  <div class="debugger">
    <ul class="table">
      <li v-for="(value, prop) in $store.state.device" :key="prop" class="item">
        <div class="prop">{{ prop }}</div>
        <div class="val">{{ value }}</div>
      </li>
      <li v-for="(value, prop) in $store.state.theme" :key="prop" class="item">
        <div class="prop">{{ prop }}</div>
        <div class="val">{{ value }}</div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.debugger {
  padding: clamp(1em, 10vh, 4em) clamp(20px, 4vmin, 40px);

  .table {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(10rem, 100%), 1fr));
    grid-gap: 4px;
  }

  .item {
    text-align: center;
    border: 1px solid;
    padding: clamp(20px, 4vmin, 40px) 0;
  }

  .prop {
    font-size: clamp(20px, 2vmin, 40px);
  }

  .val {
    transition: color var(--time) var(--ease),
      background-color var(--time) var(--ease);
    font-family: monospace;
    font-size: clamp(16px, 2vmin, 18px);
    background-color: var(--foreground);
    color: var(--background);
    display: inline-block;
    padding: 0 0.2em;
    border-radius: 0.2em;
  }
}
</style>
