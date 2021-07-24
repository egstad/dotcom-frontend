<template>
  <div>
    <div style="margin-top: 40vw">
      <Slideshow />

      <!-- full -->
      <Grid :padding="false">
        <Column
          style="background: black;padding-bottom: 50%; color: white;margin-top: 1em"
          >fl</Column
        >
      </Grid>

      <!-- xl -->
      <Grid>
        <Column
          style="background: black;padding-bottom: 50%; color: white;margin-top: 1em"
          >xl</Column
        >
      </Grid>

      <!-- lg -->
      <Grid>
        <Column
          :sm="10"
          style="background: black;padding-bottom: 50%; color: white;margin-top: 1em"
          >lg</Column
        >
      </Grid>

      <!-- md -->
      <Grid>
        <Column
          :sm="8"
          :xl="7"
          :xx="6"
          style="background: black;padding-bottom: 100%; color: white;margin-top: 1em"
          >md</Column
        >
      </Grid>

      <!-- sm -->
      <Grid>
        <Column
          :sm="6"
          :xl="5"
          :xx="4"
          style="background: black;padding-bottom: 100%; color: white;margin-top: 1em"
          >sm</Column
        >
      </Grid>

      <!-- xs -->
      <!-- <Grid>
        <Column
          :sm="8"
          :md="4"
          style="background: black;padding-bottom: 100%; color: white;margin-top: 1em"
          >xs</Column
        >
      </Grid> -->
    </div>

    <Column>
      <!-- <Grid align-items="baseline">
        <Column v-for="i in 6" :key="i" :xs="2">
          <Type :size="i">Aa</Type>
        </Column>
      </Grid>
      <Grid align-items="end">
        <Column v-for="i in 6" :key="i" :xs="2" class="border">
          <Type :size="0">ts{{ i }}</Type>
        </Column>
      </Grid> -->

      <!-- <Grid align-items="baseline">
        <template v-for="i in 6">
          <Column :key="i" class="spacer">
            <Type :size="0">ts{{ i }}</Type>
            <hr />
            <Type :size="i"
              >Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis error animi ipsum delectus dolorem commodi, quisquam
              beatae minima voluptates sit architecto quis. Eius dolores
              necessitatibus esse quasi voluptates recusandae impedit?</Type
            >
          </Column>
        </template>
      </Grid> -->

      <!-- <Grid align-items="baseline">
        <template v-for="i in 6">
          <Column :key="i" class="spacer" :lg="4">
            <Type :size="i"
              >Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis error animi ipsum delectus dolorem commodi, quisquam
              beatae minima voluptates sit architecto quis. Eius dolores
              necessitatibus esse quasi voluptates recusandae impedit?</Type
            >
          </Column>
        </template>
      </Grid> -->
    </Column>
  </div>
</template>

<script>
import Slideshow from '@/components/organisms/Slideshow.vue'

export default {
  components: {
    Slideshow
  }
}
</script>
