<template>
  <nav class="wrap">
    <Abacus class="nav__primary" :links="linksPrimary" />
    <Abacus class="nav__primary" :links="linksPrimary" />
    <Abacus
      v-if="false === true"
      class="nav__secondary"
      :links="linksSecondary"
    />

    <div class="nav__tertiary">
      <ButtonScroll :show-scroll-button="showScrollButton" />
      <ButtonMenu />
    </div>
  </nav>
</template>

<script>
import Abacus from '@/components/organisms/Abacus.vue'
import ButtonScroll from '@/components/organisms/site-header/SiteHeaderButtonScroll.vue'
import ButtonMenu from '@/components/organisms/site-header/SiteHeaderButtonMenu.vue'

export default {
  components: {
    Abacus,
    ButtonScroll,
    ButtonMenu
  },
  props: {
    showScrollButton: {
      type: Boolean,
      required: true
    },
    linksPrimary: {
      type: Array,
      required: true
    },
    linksSecondary: {
      type: Array,
      required: true
    }
  },
  computed: {
    breakpoint() {
      return this.$store.state.device.breakpoint
    }
  }
}
</script>

<style lang="scss">
$height: 36px;
$inset: 0px;
$gap: 8px;
$blur: 8px;
$trans-time: 250ms;

.site-header__nav {
  user-select: none;
  width: 100%;
  flex: 1;
  position: relative;
  border-radius: $height;
  display: flex;

  @media screen and (prefers-reduced-motion: no-preference) {
    transition: transform $trans-time ease-in-out;
  }

  .list {
    position: relative;
    display: flex;
    flex: 1;
    width: 100%;
    overflow-x: hidden;
    border-radius: $height;
    background: hsla(var(--b-h), var(--b-s), calc(var(--b-l) - 10%), 100%);
    max-width: 350px;

    .nuxt-link-exact-active {
      color: var(--background);
    }
  }
}

.nav__tertiary {
  display: flex;
}

// .wrap {
//   display: grid;
//   grid-gap: 8vw;
//   grid-template-columns: 300px 1fr 300px;
// }

.button {
  display: block;
  width: $height + ($inset * 2);
  height: $height + ($inset * 2);
  line-height: $height;
  padding: 0;
  margin: 0;
  background: hsla(var(--b-h), var(--b-s), calc(var(--b-l) - 10%), 100%);
  appearance: none;
  border: 0;
  border-radius: 50%;
  font-family: var(--mono);
  margin-left: $gap;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background-color: var(--foreground);
    color: var(--background);
    // outline: none;
    outline-offset: 4px;
  }

  &.--toggle-menu {
    @media screen and (prefers-reduced-motion: no-preference) {
      transition: transform $trans-time 200ms ease-in-out,
        opacity $trans-time ease-in-out;
    }
  }
  &.--scroll-up {
    @media screen and (prefers-reduced-motion: no-preference) {
      transition: transform $trans-time 100ms ease-in-out,
        opacity $trans-time ease-in-out;
    }
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    &.fade-enter-active,
    &.fade-leave-active {
      transition: transform $trans-time var(--ease),
        width $trans-time var(--ease), margin-left $trans-time var(--ease),
        opacity $trans-time var(--ease);
    }
    &.fade-enter, &.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      transform: scale(0);
      width: 0;
      opacity: 0;
      margin-left: 0;
    }
  }
}
</style>
