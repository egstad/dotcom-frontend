import Vue from 'vue'

Vue.directive('animate', {
  // init
  inserted: (el, binding, vnode) => {
    el.options = { rootMargin: '0px 0px 0px 0px', threshold: 0 }
    el.modifiers = binding.modifiers
    el.classes = {
      here: 'is-here',
      above: 'is-above',
      below: 'is-below'
    }

    /**
     * Enter Viewport callback
     * @param {intersectionOberver} IntersectionObserverAdmin instance
     */
    const onEnter = (instance) => {
      instance.target.classList.add(el.classes.here)
      instance.target.classList.remove(el.classes.above, el.classes.below)

      // unobserve if once modifier is defined
      if (el.modifiers.once) window.$observer.unobserve(el, el.options)
    }

    /**
     * Exit Viewport callback
     * @param {intersectionOberver} IntersectionObserverAdmin instance
     */
    const onExit = (instance) => {
      const isAbove = instance.rootBounds.top > instance.boundingClientRect.top
      // const isBelow = instance.rootBounds.top < instance.boundingClientRect.top

      if (isAbove) {
        instance.target.classList.add(el.classes.above)
        instance.target.classList.remove(el.classes.below, el.classes.here)
      } else {
        instance.target.classList.add(el.classes.below)
        instance.target.classList.remove(el.classes.above, el.classes.here)
      }
    }

    window.$observer.addEnterCallback(el, onEnter)
    window.$observer.addExitCallback(el, onExit)
    window.$observer.observe(el, el.options)
  },
  // if value changes, re-init observer
  // componentUpdated: (el) => {
  //   // destroy if once
  //   // observer.destroy()
  // },
  // cleanup
  unbind: (el, binding, vnode) => {
    window.$observer.unobserve(el, el.options)
  }
})
