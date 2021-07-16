<template>
  <div class="debugger">
    <Grid tag="ul" class="table">
      <Column
        v-for="(value, prop) in $store.state.device"
        :key="prop"
        tag="li"
        class="item"
        :sm="6"
        :md="4"
        :lg="3"
        :xl="2"
      >
        <div class="content">
          <Type class="prop">{{ prop }}</Type>
          <Type class="val">{{ value }}</Type>
        </div>
        <div class="square"></div>
      </Column>
    </Grid>
  </div>
</template>

<style lang="scss">
.debugger {
  .item {
    position: relative;
    text-align: center;
    border-radius: 0.3em;
    overflow: hidden;

    &::after {
      display: block;
      content: '';
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      background: var(--foreground);
      opacity: 0.15;
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
    padding: 0 1em;
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
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
