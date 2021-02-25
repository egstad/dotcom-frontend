export const hexToRgb = (hex) => {
  const isFormatted = hex.length === 7
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  if (!isFormatted) {
    throw new Error('Hex value should be 7 chars long')
  }

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}
