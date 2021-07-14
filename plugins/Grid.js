import Vue from 'vue'
import Grid from '@/components/atoms/Grid'
import Column from '@/components/atoms/GridColumn'

const components = { Grid, Column }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
