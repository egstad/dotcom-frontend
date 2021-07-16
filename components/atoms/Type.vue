<template>
  <component :is="tag" :class="'ts-' + size">
    <slot />
  </component>
</template>

<script>
export default {
  name: 'Grid',
  props: {
    tag: {
      type: String,
      default: 'p'
    },
    size: {
      type: Number,
      default: 2
    }
  }
}
</script>

<style scoped lang="scss">
$scale: 1.5;
$baseline: 16;
$sizes: (
  1: 13,
  2: 16,
  3: 27,
  4: 35,
  5: 44,
  6: 54
);

@for $i from 1 through length($sizes) {
  .ts-#{$i} {
    $size: map-get($sizes, $i);
    $leading: $baseline;
    $increment: ($i * 0.5) + ($scale - 1);
    font-family: 'Lars Light';
    // font-family: sans-serif;

    @if $i > 1 {
      $leading: $baseline * $increment;
    }

    @if $i > 2 {
      font-family: 'Lars Regular';
    }

    font-size: $size + px;
    line-height: $leading + px;

    @media (min-width: $xx) {
      font-size: calc-vw($size, $xx);
      line-height: calc-leading($leading, $size);
    }
  }
}

.ts-1 {
  letter-spacing: 0.02em;
}

// .ts-2 {
//   letter-spacing: 0.01em;
// }

// .ts-3 {
// }

.ts-4 {
  letter-spacing: -0.01em;
}

.ts-5 {
  letter-spacing: -0.02em;
}

.ts-6 {
  letter-spacing: -0.03em;
}
</style>
