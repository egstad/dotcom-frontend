<template>
  <nav class="wrap">
    <div class="nav__primary">
      <Abacus :links="linksPrimary" />
    </div>

    <div class="nav__secondary">
      <Abacus :links="linksSecondary" />
    </div>

    <div class="nav__tertiary">
      <Fab :show="filterIsVisible" label="Open Filter &amp; Search Modal">
        <span>S</span>
      </Fab>
      <Fab
        :show="showScrollButton && !isTransitioning"
        label="Scroll to the top of the page"
        @click.native="scrollToTop"
      >
        <span>M</span>
      </Fab>
    </div>
  </nav>
</template>

<script>
import Abacus from '@/components/organisms/Abacus.vue'
import Fab from '@/components/atoms/Fab.vue'

export default {
  components: {
    Abacus,
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
    isTransitioning() {
      return this.$store.state.isTransitioning
    },
    filterIsVisible() {
      return this.$store.state.filterIsVisible
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

    @media screen and (prefers-reduced-motion: no-preference) {
      &:after {
        transition: background-color var(--transition-page);
      }

      transition: transform $trans-time var(--ease),
        width $trans-time var(--ease), margin-left $trans-time var(--ease),
        opacity $trans-time var(--ease), color var(--transition-page);
    }
  }
}
</style>
