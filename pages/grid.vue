<template>
  <div>
    <div style="margin-top: 40vw">
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
          style="background: black;padding-bottom: 100%; color: white;margin-top: 1em"
          >md</Column
        >
      </Grid>

      <!-- sm -->
      <Grid>
        <Column
          :sm="6"
          :xx="3"
          style="background: black;padding-bottom: 100%; color: white;margin-top: 1em"
          >sm</Column
        >
      </Grid>
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
export default {
  fetch() {
    this.$store.commit('setTheme', {
      background: '#f9f9f9',
      foreground: '#050505',
      accent: '#0000ff'
    })
  }
}
</script>

<style lang="scss" scoped>
.border,
hr {
  border: 0;
  border-top: 1px solid #000;
  height: 0;
}
.spacer {
  margin-top: 10vw;
}
</style>
