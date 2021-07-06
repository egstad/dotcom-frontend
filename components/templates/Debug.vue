<template>
  <div class="debugger">
    <ul class="table">
      <li v-for="(value, prop) in $store.state.device" :key="prop" class="item">
        <div class="content">
          <div class="prop">{{ prop }}</div>
          <div class="val">{{ value }}</div>
        </div>
        <div class="square"></div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.debugger {
  padding: clamp(1em, 10vh, 4em) clamp(20px, 4vmin, 40px);

  .table {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 4px;
  }

  .item {
    position: relative;
    text-align: center;
    border: 1px solid;

    &::after {
      display: block;
      content: '';
      width: 100%;
      height: 0;
      padding-bottom: 100%;
    }
  }

  .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
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
