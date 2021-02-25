const shuffle = (array) => {
  for (let i = array.length; i > 1; i--) {
    const r = Math.floor(Math.random() * i)
    const temp = array[r]
    array[r] = array[i - 1]
    array[i - 1] = temp
  }
  return array
}

export { shuffle }
