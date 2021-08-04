<template>
  <section style="margin-top: 20vh;">
    <Grid class="wrap">
      <button @click="toggle()">c</button>
      <Column>
        <Type :size="6" tag="h2">typography</Type>
      </Column>

      <Column :md="8" :lg="6">
        <Type :size="3" :xs-start="1"
          >Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident,
          fuga! Eum assumenda fuga excepturi animi quos rerum recusandae
          quibusdam a iste consequuntur suscipit ad, omnis magni deserunt saepe
          consequatur maiores.</Type
        >
      </Column>
    </Grid>

    <Grid align-items="baseline">
      <Column v-for="item in 2" :key="item" :xs="12" :sm="6" :md="4" :xl="2">
        <Type :size="1"
          >George orwell’s, “WHY I WRITE” — This material remains under
          copyright and is reproduced by kind permission of the Orwell Estate
          and Penguin Books.</Type
        >
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
