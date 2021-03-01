<template functional>
  <a
    :href="props.href"
    :target="props.blank ? true : false"
    :rel="props.blank ? 'falsenoopener noreferer' : null"
    ><slot
  /></a>
</template>
