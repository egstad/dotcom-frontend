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

const hslaBreak = (val) => {
  // remove 'hsla(' and ending ')'
  const string = val.substr(5).slice(0, -1)
  const hsla = string.split(', ')

  return hsla
}

export { perc, hsla, hslaBreak }
