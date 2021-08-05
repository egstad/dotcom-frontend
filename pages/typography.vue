<template>
  <section style="margin-top: 20vh;">
    <button @click="toggle()">c</button>
    <Grid align-items="baseline">
      <Column v-for="num in 6" :key="num" :sm="12" :md="2">
        <p :class="`t-${num}`">
          Aa
        </p>
      </Column>
    </Grid>

    <Grid align-items="baseline">
      <Column>
        <p class="t-6">
          <strong>Aesthetic enthusiasm.</strong> Perception of beauty in the
          external world, or, on the other hand, in words and their right
          arrangement. Pleasure in the impact of one sound on another, in the
          firmness of good prose or the rhythm of a good story. Desire to share
          an experience which one feels is valuable and ought not to be missed.
          The aesthetic motive is very feeble in a lot of writers, but even a
          pamphleteer or writer of textbooks will have pet words and phrases
          which appeal to him for non-utilitarian reasons; or he may feel
          strongly about typography, width of margins, etc. Above the level of a
          railway guide, no book is quite free from aesthetic considerations.
        </p>
      </Column>
    </Grid>
    <Grid align-items="baseline">
      <Column>
        <p class="t-5">
          <strong>Aesthetic enthusiasm.</strong> Perception of beauty in the
          external world, or, on the other hand, in words and their right
          arrangement. Pleasure in the impact of one sound on another, in the
          firmness of good prose or the rhythm of a good story. Desire to share
          an experience which one feels is valuable and ought not to be missed.
          The aesthetic motive is very feeble in a lot of writers, but even a
          pamphleteer or writer of textbooks will have pet words and phrases
          which appeal to him for non-utilitarian reasons; or he may feel
          strongly about typography, width of margins, etc. Above the level of a
          railway guide, no book is quite free from aesthetic considerations.
        </p>
      </Column>
      <Column v-for="num in 2" :key="num" :md="6">
        <p class="t-4">
          <strong>Aesthetic enthusiasm.</strong> Perception of beauty in the
          external world, or, on the other hand, in words and their right
          arrangement. Pleasure in the impact of one sound on another, in the
          firmness of good prose or the rhythm of a good story. Desire to share
          an experience which one feels is valuable and ought not to be missed.
          The aesthetic motive is very feeble in a lot of writers, but even a
          pamphleteer or writer of textbooks will have pet words and phrases
          which appeal to him for non-utilitarian reasons; or he may feel
          strongly about typography, width of margins, etc. Above the level of a
          railway guide, no book is quite free from aesthetic considerations.
        </p>
      </Column>
      <Column v-for="num in 2" :key="num" :md="6">
        <p class="t-3">
          <strong>Aesthetic enthusiasm.</strong> Perception of beauty in the
          external world, or, on the other hand, in words and their right
          arrangement. Pleasure in the impact of one sound on another, in the
          firmness of good prose or the rhythm of a good story. Desire to share
          an experience which one feels is valuable and ought not to be missed.
          The aesthetic motive is very feeble in a lot of writers, but even a
          pamphleteer or writer of textbooks will have pet words and phrases
          which appeal to him for non-utilitarian reasons; or he may feel
          strongly about typography, width of margins, etc. Above the level of a
          railway guide, no book is quite free from aesthetic considerations.
        </p>
      </Column>
      <Column v-for="num in 2" :key="num" :md="6">
        <p class="t-2">
          <strong>Aesthetic enthusiasm.</strong> Perception of beauty in the
          external world, or, on the other hand, in words and their right
          arrangement. Pleasure in the impact of one sound on another, in the
          firmness of good prose or the rhythm of a good story. Desire to share
          an experience which one feels is valuable and ought not to be missed.
          The aesthetic motive is very feeble in a lot of writers, but even a
          pamphleteer or writer of textbooks will have pet words and phrases
          which appeal to him for non-utilitarian reasons; or he may feel
          strongly about typography, width of margins, etc. Above the level of a
          railway guide, no book is quite free from aesthetic considerations.
        </p>
      </Column>
      <Column v-for="num in 4" :key="num" :sm="6" :md="3">
        <p class="t-1">
          <strong>Political purpose.</strong> Using the word ‘political’ in the
          widest possible sense. Desire to push the world in a certain
          direction, to alter other people’s idea of the kind of society that
          they should strive after. Once again, no book is genuinely free from
          political bias. The opinion that art should have nothing to do with
          politics is itself a political attitude.
        </p>
      </Column>
    </Grid>
    <br />
    <img
      src="https://d2w9rnfcy7mm78.cloudfront.net/11612785/original_85268c167ded8520ee94570e3685062f.jpg?1618591565?bc=0"
      alt=""
      style="width:100%;"
    />

    <!-- <Grid align-items="end">
      <Column v-for="num in 6" :key="num" :xs="2">
        <Type :tag="`h${num}`" :size="num">Aa</Type>
      </Column>
    </Grid> -->
  </section>
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
  methods: {
    toggle() {
      if (this.theme === 'light') {
        this.theme = 'dark'
      } else {
        this.theme = 'light'
      }

      this.$store.commit('setCSSVars', this.theme)
    }
  }
}
</script>
