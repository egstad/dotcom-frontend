import { hslaPrefixObject } from '@/assets/js/utils/SanityHSL'

const theme = {
  filterObjectByKey(array, allowedKeys) {
    return Object.keys(array)
      .filter((key) => allowedKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = array[key]
        return obj
      }, {})
  },
  addCSSVarPrefix(object, prefix) {
    const arr = []

    Object.keys(object).forEach((key, index) => {
      arr.push({ key: object })
      // console.log(key, object)
      // key: the name of the object key
      // index: the ordinal position of the key within the object
    })

    console.log(arr)

    // // for (const [key, value] of Object.entries(object)) {
    // //   newArr.push(`--${prefix}${key.toUpperCase()}: ${value}`)
    // // }

    // return newArr
  },
  set(colors) {
    const allowedKeys = ['h', 's', 'l', 'a']

    // sanitize objects
    const background = this.filterObjectByKey(colors.background, allowedKeys)
    const foreground = this.filterObjectByKey(colors.foreground, allowedKeys)
    const accent = this.filterObjectByKey(colors.accent, allowedKeys)

    // add css prefixes to object keys
    const bHSLA = hslaPrefixObject(background, 'b', 'background')
    const fHSLA = hslaPrefixObject(foreground, 'f', 'foreground')
    const aHSLA = hslaPrefixObject(accent, 'a', 'accent')

    return {
      ...bHSLA,
      ...fHSLA,
      ...aHSLA
    }
  }
}

export default theme
