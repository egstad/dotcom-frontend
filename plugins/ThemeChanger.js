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
    let theme = colors
    if (typeof colors === 'string') theme = this.getDefaultTheme(colors)

    const allowedKeys = ['h', 's', 'l', 'a']

    // sanitize objects
    const background = this.filterObjectByKey(theme.background, allowedKeys)
    const foreground = this.filterObjectByKey(theme.foreground, allowedKeys)
    const accent = this.filterObjectByKey(theme.accent, allowedKeys)

    // add css prefixes to object keys
    const bHSLA = hslaPrefixObject(background, 'b', 'background')
    const fHSLA = hslaPrefixObject(foreground, 'f', 'foreground')
    const aHSLA = hslaPrefixObject(accent, 'a', 'accent')

    return {
      ...bHSLA,
      ...fHSLA,
      ...aHSLA
    }
  },
  getDefaultTheme(colors) {
    let theme

    switch (colors) {
      case 'dark':
        theme = {
          background: {
            h: 0,
            s: 0,
            l: 0,
            a: 1
          },
          foreground: {
            h: 44,
            s: 0.15,
            l: 0.87,
            a: 1
          },
          accent: {
            h: 242,
            s: 0.39,
            l: 0.6,
            a: 1
          }
        }
        break
      case 'light':
        theme = {
          background: {
            h: 0,
            s: 0,
            l: 100,
            a: 1
          },
          foreground: {
            h: 44,
            s: 0.08,
            l: 0.16,
            a: 1
          },
          accent: {
            h: 242,
            s: 0.39,
            l: 0.77,
            a: 1
          }
        }
        break
      default:
        console.error(
          'ThemeChanger error: This is not a registered default theme.'
        )
        break
    }

    return theme
  }
}

export default theme
