import deviceInfo from '~/plugins/device/DeviceInfo'
import windowResize from '~/plugins/device/WindowResize'
import windowDimensions from '~/plugins/device/WindowDimensions'
import windowBreakpoints from '~/plugins/device/WindowBreakpoints'
import windowScroll from '~/plugins/device/WindowScroll'
import preferredTheme from '~/plugins/device/PreferredTheme'
import preferredMotion from '~/plugins/device/PreferredMotion'

const device = {
  init() {
    deviceInfo.init()
    preferredTheme.init()
    preferredMotion.init()
    windowResize.init()
    windowDimensions.init()
    windowBreakpoints.init()
    windowScroll.init()
    // this.scrollHistory()
  },

  setDeviceClasses() {
    // touch support
    if (this.isTouch) {
      document.documentElement.classList.add('device-is-touch')
    }

    // cursor support
    if (this.isCursor) {
      document.documentElement.classList.add('device-is-pointer')
    }

    // mobile device
    if (this.isMobile) {
      document.documentElement.classList.add('device-is-mobile')
    }
  },

  // sets scroll restoration to manual from auto
  // this is so that the browser doesn't jump the gun and
  // change scroll position before the route has completed
  scrollHistory() {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }
}

if (process.browser) {
  window.onNuxtReady((app) => {
    // run all of the above
    device.init()
    // tell nuxt that we're ready to rock
    window.$nuxt.$emit('device::initialized')
  })
}

export default device
