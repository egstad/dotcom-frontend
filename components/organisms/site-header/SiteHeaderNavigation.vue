<template>
  <nav class="wrap">
    <div class="nav__primary">
      <Abacus :route="nextRoute" :links="linksPrimary" />
    </div>

    <div class="nav__secondary">
      <transition name="filter" mode="out-in">
        <Abacus v-if="filterIsVisible" :links="linksSecondary" />
      </transition>
    </div>

    <div class="nav__tertiary">
      <Fab :show="filterIsVisible" label="Open Filter &amp; Search Modal">
        <IconEllipsis />
      </Fab>
      <Fab label="Scroll to the top of the page" @click.native="scrollToTop">
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

export default {
  components: {
    Abacus,
    Fab,
    IconArrowUp,
    IconEllipsis
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
    isTransitioning() {
      return this.$store.state.isTransitioning
    },
    filterIsVisible() {
      return this.$store.state.filterIsVisible
    },
    nextRoute() {
      return this.$store.state.activeNavigationRoute
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
  flex: 1;
  position: relative;
  display: flex;

  @media screen and (prefers-reduced-motion: no-preference) {
    transition: transform $trans-time ease-in-out;
  }

  // layout
  // display: grid;

  @include bp($md) {
    .nav__primary {
      max-width: 300px;
    }

    .nav__tertiary {
      display: flex;
      flex: 1;
      justify-content: flex-end;
    }
  }

  @include bp($xx) {
    display: grid;
    grid-template-columns: 300px 1fr 300px;
    grid-gap: 4vw;

    .nav__secondary {
      flex: 1;
      display: flex;
      max-width: 500px;
      margin: 0 auto;
      width: 100%;
    }
  }

  .filter-enter-active,
  .filter-leave-active {
    transition: transform var(--trans-medium) var(--ease-back);
  }
  .filter-enter,
  .filter-leave-to {
    transform: translate3d(0, -100%, 0);
  }
}

.nav__primary {
  width: 100%;
}

.nav__secondary {
  display: none;
}

.nav__tertiary {
  display: flex;
  width: 100%;
  flex: 1;
}

.isTransitioning {
  .fab {
    pointer-events: none;
    transition: width var(--trans-medium) var(--trans-delay) var(--ease),
      transform var(--trans-medium) var(--trans-delay) var(--ease),
      opacity var(--trans-medium) var(--trans-delay) var(--ease),
      margin-left var(--trans-medium) var(--trans-delay) var(--ease),
      background-color var(--trans-medium) var(--trans-delay) var(--ease),
      color var(--trans-medium) var(--trans-delay) var(--ease);
  }
}
</style>
