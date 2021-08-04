<template>
  <nav class="wrap">
    <div class="nav__primary">
      <Abacus :route="nextRoute" :links="linksPrimary" />

      <Fab
        :show="(filterIsVisible && !largeBreakpoint) || menuIsOpen"
        label="Open Filter &amp; Search Modal"
        class="menu-toggle"
        :is-active="menuIsOpen"
        :style="[
          menuIsTransitioning
            ? { pointerEvents: 'none' }
            : { pointerEvents: 'auto' }
        ]"
        @click.native="onFilterClick"
      >
        <IconEllipsis />
      </Fab>
    </div>

    <div class="nav__secondary">
      <transition name="filter" mode="out-in">
        <Abacus
          v-if="filterIsVisible && largeBreakpoint && !menuIsOpen"
          :links="linksSecondary"
        />
      </transition>

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
      return this.$store.state.device.winWidth >= 1024
    },
    menuIsTransitioning() {
      return this.$store.state.menuIsTransitioning
    },
    menuIsOpen() {
      return this.$store.state.menuIsOpen
    }
  },
  methods: {
    scrollToTop() {
      if (process.client) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    onFilterClick() {
      this.$store.commit('setMenuVisibility', !this.$store.state.menuIsOpen)
    }
  }
}
</script>

<style lang="scss" scoped>
$numberOfPrimaryItems: 3;
$numberOfSecondaryItems: 5;
$minLinkWidth: 75px;
$maxLinkWidth: 100px;

.nav__primary {
  /* Display & Box Model */
  display: inline-flex;
  width: 100%;

  @include bp($md) {
    width: auto;
  }

  @include transition {
    transition: transform var(--trans-medium) var(--ease-back);
  }

  ::v-deep .abacus {
    flex: 1;

    @include bp($md) {
      width: clamp(
        #{$numberOfPrimaryItems * $minLinkWidth},
        calc(60vw),
        #{$numberOfPrimaryItems * $maxLinkWidth}
      );
    }
  }
}

.nav__secondary {
  /* Display & Box Model */
  width: auto;
  display: flex;
  justify-content: flex-end;
  flex: 1;

  @include transition {
    transition: transform var(--trans-medium) var(--ease-back);
  }

  ::v-deep .abacus {
    transform: translate3d(0, -100%, 0);

    @include bp($md) {
      flex: initial;
      width: clamp(
        #{$numberOfSecondaryItems * $minLinkWidth},
        calc(60vw),
        #{$numberOfSecondaryItems * $maxLinkWidth}
      );
    }

    @include bp($xl) {
      transform: translate3d(0, 0, 0);
    }

    @include transition {
      transition: transform var(--trans-long) var(--ease-back);
    }

    &.filter-enter-active,
    &.filter-leave-active {
      transition: transform var(--trans-medium) var(--trans-delay)
        var(--ease-back);
    }
    &.filter-enter,
    &.filter-leave-to {
      transform: translate3d(0, -100%, 0);
    }
  }
}
</style>
