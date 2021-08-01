<template>
  <nav class="wrap">
    <Abacus class="nav__primary" :links="linksPrimary" />
    <!-- <Abacus class="nav__primary" :links="linksPrimary" /> -->
    <Abacus
      v-if="false === true"
      class="nav__secondary"
      :links="linksSecondary"
    />

    <div class="nav__tertiary">
      <Fab
        :show="showScrollButton && !isTransitioning"
        label="Scroll to the top of the page"
        @click.native="scrollToTop"
      >
        <span>•</span>
      </Fab>

      <Fab :show="filterIsVisible" label="Open Filter &amp; Search Modal">
        <span>•</span>
      </Fab>

      <!-- <ButtonScroll :show-scroll-button="showScrollButton" />
      <ButtonMenu /> -->
    </div>
  </nav>
</template>

<script>
import Abacus from '@/components/organisms/Abacus.vue'
import Fab from '@/components/atoms/Fab.vue'
// import ButtonScroll from '@/components/organisms/site-header/SiteHeaderButtonScroll.vue'
// import ButtonMenu from '@/components/organisms/site-header/SiteHeaderButtonMenu.vue'

export default {
  components: {
    Abacus,
    // ButtonScroll,
    // ButtonMenu,
    Fab
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
    },
    isTransitioning() {
      return this.$store.state.isTransitioning
    },
    filterIsVisible() {
      return this.$store.state.filterIsVisible
    }
  },
  methods: {
    scrollToTop() {
      console.log('scroll')
      if (process.client) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
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

.isTransitioning {
  .button {
    pointer-events: none;

    @media screen and (prefers-reduced-motion: no-preference) {
      transition: transform $trans-time var(--ease),
        width $trans-time var(--ease), margin-left $trans-time var(--ease),
        opacity $trans-time var(--ease), background-color var(--transition-page),
        color var(--transition-page);
    }
  }
}
</style>
