<template>
  <div class="links">
    <ul class="links__list">
      <li v-for="(link, linkIndex) in links" :key="linkIndex" class="link">
        <a
          v-if="link.type === 'external'"
          :href="link.destination"
          target="_blank"
          class="t-link"
          >{{ link.text }} <span style="float:right">🡢</span></a
        >

        <nuxt-link v-else :to="link.destination" class="t-link"
          >{{ link.text }}<span style="float:right">🡢</span></nuxt-link
        >
      </li>
    </ul>

    <div class="note">
      <p class="t-1">
        So I work at <a href="https://loom.com" target="_blank">Loom</a>. And if
        you're seeing this page, you probably work at Loom too. Hi, coworker!
        Anyhow. The above links showcase a handful of prototypes, sketches, and
        experiments I've created and used as my personal Loom canvases.
      </p>
    </div>
  </div>
</template>

<script>
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'

export default {
  mixins: [routeTransitionFade],
  async asyncData({ store }) {
    const theme = {
      foreground: {
        h: 209,
        s: 0.3,
        l: 0.8,
        a: 1
      },
      background: {
        h: 248,
        s: 0.85,
        l: 0.35,
        a: 1
      },
      accent: {
        h: 242,
        s: 0.39,
        l: 0.6,
        a: 1
      }
    }

    await store.commit('setCSSVars', theme)
  },
  data() {
    return {
      links: [
        {
          text: 'Moodboard',
          destination: 'canvas/block-moodboard'
        },
        {
          text: 'Misc. Codepens',
          destination:
            'https://codepen.io/collection/bNwbYR?cursor=ZD0wJm89MCZwPTEmdj00',
          type: 'external'
        }
      ]
    }
  },
  mounted() {
    this.$nuxt.$emit('page::mounted')
  }
}
</script>

<style lang="scss" scoped>
.links {
  /* Positioning */

  /* Display & Box Model */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  min-height: 100vh;
  padding: 20vh var(--button-click-offset) var(--button-click-offset);

  &__list {
    width: 100%;
  }
}

.link {
  width: 100%;
  border-top: 1px solid var(--foreground);

  @include transition {
    transition: color var(--trans-short) var(--ease),
      border-color var(--transition-page);
  }

  &:last-child {
    border-bottom: 1px solid var(--foreground);
  }
}

.t-link {
  color: inherit;
  text-decoration: none;

  display: block;
  font-family: var(--sans);
  font-variation-settings: 'wght' 200;
  font-size: clamp(32px, 10vw, 124px);
  letter-spacing: -0.04em;
  padding: 0.2em 0;
  line-height: 1;

  @include transition {
    transition: font-variation-settings var(--trans-short) var(--ease);
  }

  &:hover {
    font-variation-settings: 'wght' 800;
  }
}

.note {
  display: block;
  margin: clamp(32px, 8vw, 64px) 0 16px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;

  p {
    padding-right: 96px;
    max-width: 500px;
  }

  a {
    color: inherit;
  }
}
</style>
