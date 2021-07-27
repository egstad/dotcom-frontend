import Vue from 'vue'
import Intersect from 'vue-intersect'

const components = { Intersect }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
