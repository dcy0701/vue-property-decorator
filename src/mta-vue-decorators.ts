/** mta-vue-decorators verson 2.0.0 MIT LICENSE copyright 2018 onion */

'use strict'
import Vue, { PropOptions, WatchOptions } from 'vue'
import Component, { createDecorator } from 'vue-class-component'

export type Constructor = {
  new(...args: any[]): any
}

export { Component, Vue }

/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
export function Prop(options: (PropOptions | Constructor[] | Constructor) = {}): PropertyDecorator {
  return function (target: Vue, key: string) {
    createDecorator((componentOptions, k: string) => {
      (componentOptions.props || (componentOptions.props = {}) as any)[k] = options
    })(target, key)
  }
}

/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
export function Watch(path: string, options: WatchOptions = {}): MethodDecorator {
  const { deep = false, immediate = false } = options

  return createDecorator((componentOptions, handler) => {
    if (typeof componentOptions.watch !== 'object') {
      componentOptions.watch = Object.create(null)
    }
    (componentOptions.watch as any)[path] = { handler, deep, immediate }
  })
}

// Code copied from Vue/src/shared/util.js
const hyphenateRE = /\B([A-Z])/g
const hyphenate = (str: string) => str.replace(hyphenateRE, '-$1').toLowerCase()

/**
 * decorator of an event-emitter function
 * @param  event The name of the event
 * @return MethodDecorator
 */
export function Emit(event?: string): MethodDecorator {
  return function (target: Vue, key: string, descriptor: any) {
    key = hyphenate(key)
    const original = descriptor.value
    descriptor.value = function emitter(...args: any[]) {
      if (original.apply(this, args) !== false)
        this.$emit(event || key, ...args)
    }
  }
}

/**
 * decorator of $on
 * @param event The name of the event
 */
export function On(event?: string): MethodDecorator {
  return createDecorator((componentOptions, k) => {
    const key = hyphenate(k)
    if (typeof componentOptions.created !== 'function') {
      componentOptions.created = function () { }
    }
    const original = componentOptions.created
    componentOptions.created = function () {
      original()
      if (typeof componentOptions.methods !== 'undefined') {
        this.$on(event || key, componentOptions.methods[k])
      }

    }
  })
}

/**
 * decorator of $once
 * @param event The name of the event
 */
export function Once(event?: string): MethodDecorator {
  return createDecorator((componentOptions, k) => {
    const key = hyphenate(k)
    if (typeof componentOptions.created !== 'function') {
      componentOptions.created = function () { }
    }
    const original = componentOptions.created
    componentOptions.created = function () {
      original()
      if (typeof componentOptions.methods !== 'undefined') {
        this.$once(event || key, componentOptions.methods[k]);
      }
    }
  })
}
