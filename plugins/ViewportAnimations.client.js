import Vue from 'vue'

Vue.directive('animate', {
  /**
   * INSERTED
   * Runs when When the bound element is inserted into the DOM
   * @param {HTMLElement} el The element the directive is bound to. This can be used to directly manipulate the DOM.
   * @param {Object} binding An object containing the following properties.
   * @param {Object} vnode The virtual node produced by Vue’s compiler.
   */
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
  /**
   * UNBIND
   * Called only once, when the directive is unbound from the element.
   * @param {HTMLElement} el The element the directive is bound to. This can be used to directly manipulate the DOM.
   * @param {Object} binding An object containing the following properties.
   * @param {Object} vnode The virtual node produced by Vue’s compiler.
   */
  unbind: (el, binding, vnode) => {
    window.$observer.unobserve(el, el.options)
  }
})
