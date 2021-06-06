export default (context, inject) => {
  let posY = null

  const watchScrollPosition = () => {
    const y = getY()
    // const scrolling = y !== posY
    // const scrollingUp = y < posY
    // const scrollingDown = y > posY
    const atEnd = y !== posY && isMaxY()
    const atStart = y !== posY && isMinY()

    posY = y

    // if (scrolling) {
    //   switch (true) {
    //     case scrollingDown:
    //       console.log('down')
    //       break

    //     case scrollingUp:
    //       console.log('up')
    //       break

    //     default:
    //       break
    //   }
    // }

    if (posY) console.log('y', posY)
    if (atStart) console.log('start')
    if (atEnd) console.log('end')
  }

  const isMaxY = () => {
    return getY() >= getYMax()
  }

  const isMinY = () => {
    return getY() <= 0
  }

  const getYMax = () => {
    let max = null

    max = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    )

    return max - window.innerHeight
  }

  const getY = () => {
    return window.pageYOffset
  }

  const scrollHandler = (ev) => {
    window.requestAnimationFrame(watchScrollPosition)
  }

  window.addEventListener('scroll', scrollHandler, { passive: true })
}
