<template>
  <nav class="wrap">
    <div class="nav__primary">
      <Abacus :route="nextRoute" :links="linksPrimary" />

      <Fab
        :show="filterIsVisible && !largeBreakpoint"
        label="Open Filter &amp; Search Modal"
      >
        <IconEllipsis />
      </Fab>
    </div>

    <div class="nav__secondary">
      <transition name="filter" mode="out-in">
        <Abacus
          v-if="filterIsVisible && largeBreakpoint"
          :links="linksSecondary"
        />
      </transition>
    </div>

    <div class="nav__tertiary">
      <!-- <SiteHeaderMeta :show="showTime" /> -->

      <!-- v-if="showScrollButton" -->
      <Fab
        :show="showScrollButton"
        label="Scroll to the top of the page"
        @click.native="scrollToTop"
      >
        <IconArrowUp />
      </Fab>
    </div>
  </nav>
</template>

<script>
import IconArrowUp from '@/components/atoms/Icons/IconArrowUp'
import IconEllipsis from '@/components/atoms/Icons/IconEllipsis'
import Abacus from '@/components/organisms/Abacus.vue'
import Fab from '@/components/atoms/Fab.vue'
// import SiteHeaderMeta from '~/components/organisms/site-header/SiteHeaderMeta.vue'

export default {
  components: {
    Abacus,
    Fab,
    IconArrowUp,
    IconEllipsis
    // SiteHeaderMeta
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
    },
    showTime: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    isTransitioning() {
      return this.$store.state.isTransitioning
    },
    filterIsVisible() {
      return this.$store.state.filterIsVisible
    },
    nextRoute() {
      return this.$store.state.activeNavigationRoute
    },
    largeBreakpoint() {
      // XX breakpoint
      return this.$store.state.device.winWidth >= 1300
    }
  },
  methods: {
    scrollToTop() {
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
  // flex: 1;
  position: relative;
  display: flex;

  @media screen and (prefers-reduced-motion: no-preference) {
    transition: transform $trans-time ease-in-out;
  }
}

.nav__primary {
  width: 100%;
  display: flex;

  @include bp($md + 100px) {
    .abacus {
      max-width: clamp(300px, calc(50vw - var(--button-height)), 400px);
    }
  }
}

.nav__secondary {
  transition: transform var(--trans-medium) var(--ease-back);
  justify-content: flex-end;
  width: 100%;
  display: flex;
  // margin-left: auto;

  .abacus {
    justify-self: flex-end;
    max-width: 800px;
  }

  @media screen and (max-width: $xx) {
    flex: 0;

    transform: translate3d(0, -100%, 0);
  }

  .filter-enter-active,
  .filter-leave-active {
    transition: transform var(--trans-medium) var(--trans-delay)
      var(--ease-back);
  }
  .filter-enter,
  .filter-leave-to {
    transform: translate3d(0, -100%, 0);
  }
}

.nav__tertiary {
  display: flex;
  flex: 1;

  @include bp($xx) {
    flex: none;
  }
}
</style>
