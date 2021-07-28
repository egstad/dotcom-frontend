const perc = (val) => {
  return Math.round(val * 100)
}

const hsla = (val) => {
  const h = `${Math.round(val.h)}`
  const s = `${perc(val.s)}%`
  const l = `${perc(val.l)}%`
  const a = `${perc(val.a)}%`
  return `hsla(${h}, ${s}, ${l}, ${a})`
}

// const hslaPrefixArray = (val, prefix) => {
//   const h = { [`--${prefix}H`]: `${Math.round(val.h)}` }
//   const s = { [`--${prefix}S`]: `${Math.round(val.s)}%` }
//   const l = { [`--${prefix}L`]: `${Math.round(val.l)}%` }
//   const a = { [`--${prefix}A`]: `${Math.round(val.a)}%` }

//   return [h, s, l, a]
// }

const hslaPrefixObject = (val, prefix, full) => {
  return {
    [`--${prefix}-h`]: `${Math.round(val.h)}`,
    [`--${prefix}-s`]: `${Math.round(val.s * 100)}%`,
    [`--${prefix}-l`]: `${Math.round(val.l * 100)}%`,
    [`--${prefix}-a`]: `${Math.round(val.a * 100)}%`,
    [`--${full}`]: `hsla(var(--${prefix}-h), var(--${prefix}-s), var(--${prefix}-l), var(--${prefix}-a))`
  }
}

const hslaBreak = (val) => {
  // remove 'hsla(' and ending ')'
  const string = val.substr(5).slice(0, -1)
  const hsla = string.split(', ')

  return hsla
}

export { perc, hsla, hslaBreak, hslaPrefixObject }
