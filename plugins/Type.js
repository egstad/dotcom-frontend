import Vue from 'vue'
import Type from '@/components/atoms/Type'

const components = { Type }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
