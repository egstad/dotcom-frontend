<template>
  <ul class="links">
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
</template>

<script>
import { routeTransitionFade } from '@/assets/js/mixins/RouteTransition'

export default {
  mixins: [routeTransitionFade],
  async asyncData({ store }) {
    await store.commit('setCSSVars', 'light')

    return {
      theme: 'light'
    }
  },
  data() {
    return {
      links: [
        {
          text: 'Moodboard',
          destination: 'canvas/block-moodboard'
        },
        {
          text: 'Various Codepens',
          destination:
            'https://codepen.io/collection/bNwbYR?cursor=ZD0wJm89MCZwPTEmdj04',
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
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: 20vh 32px;
}

.link {
  width: 100%;
  border-top: 1px solid var(--foreground);

  &:last-child {
    border-bottom: 1px solid var(--foreground);
  }
}

.t-link {
  color: inherit;
  text-decoration: none;

  display: block;
  font-family: var(--sans);
  font-size: clamp(28px, 8vw, 96px);
  letter-spacing: -0.05em;
  padding: 0.2em 0;
  line-height: 1;
}
</style>
