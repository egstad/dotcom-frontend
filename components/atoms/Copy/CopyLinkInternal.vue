<template functional>
  <nuxt-link :to="props.slug.current === 'index' ? '/' : props.slug.current"
    ><slot
  /></nuxt-link>
</template>
