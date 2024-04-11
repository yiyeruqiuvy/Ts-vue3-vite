export function runUtil(global, factory) {
  'use strict'

  var Util = {}

  function isObject(item) {
    // 不把[object Function]算在内，其typeof是function
    return item && typeof item === 'object' && !Array.isArray(item)
  }

  function mergeDeeply(target, source) {
    if (isObject(target) && isObject(source)) {
      // 只合并object，不合并array
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          if (
            isObject(source[key]) &&
            !(source[key] instanceof HTMLElement) // 不合并HTML对象
          ) {
            if (!isObject(target[key])) {
              target[key] = {}
            }
            mergeDeeply(target[key], source[key])
          } else {
            target[key] = source[key]
          }
        }
      }
    }
  }

  /**
   * 深拷贝
   * https://medium.com/weekly-webtips/deep-clone-with-vanilla-js-5ef16e0b365c
   * @param target 深拷贝的目标
   * @param cache 缓存
   * @returns {any}
   */
  Util.deepClone = function (target, cache) {
    cache = cache || new WeakMap()
    var referenceTypes = ['Array', 'Object', 'Map', 'Set', 'WeakMap', 'WeakSet']
    var entityType = Object.prototype.toString.call(target)
    if (!new RegExp(referenceTypes.join('|')).test(entityType)) {
      // 如果是 primitive type，会自动深拷贝，所以直接返回
      // 如果是[object Function]则直接浅拷贝返回，因为函数没必要深拷贝
      // 如果是[object HTMLElement]也直接浅拷贝返回，因为dom对象没必要深拷贝
      return target
    }
    if (cache.has(target)) {
      // 已在缓存中则直接返回，以解决循环依赖
      return cache.get(target)
    }
    var copy = new target.constructor() // 如果是引用类型，new 一个新的实例
    if (target instanceof Map || target instanceof WeakMap) {
      target.forEach(function (value, key) {
        copy.set(Util.deepClone(key), Util.deepClone(value))
      })
    }
    if (target instanceof Set || target instanceof WeakSet) {
      target.forEach(function (value) {
        copy.add(Util.deepClone(value))
      })
    }
    cache.set(target, copy)
    // Object.keys既可以遍历对象，也可以遍历数组
    var sources = Object.keys(target).map(function (key) {
      return {
        [key]: Util.deepClone(target[key], cache),
      }
    })
    sources.forEach(function (src) {
      Object.assign(copy, src)
    })
    return copy
  }

  Util.merge = function (target, source) {
    var deepCopy = Util.deepClone(target)
    mergeDeeply(deepCopy, source)
    return deepCopy
  }

  function Sequence() {
    this.currentValue = 1

    this.nextVal = function () {
      return this.currentValue++
    }
  }

  Util.sequence = new Sequence()
  Util.ResettableInterval = function (fun, interval) {
    var timerId

    function restartWhenFinish() {
      fun()
      timerId = setTimeout(restartWhenFinish, interval)
    }

    timerId = setTimeout(restartWhenFinish, interval)

    this.reset = function () {
      clearTimeout(timerId)
      timerId = setTimeout(restartWhenFinish, interval)
    }
  }
  var Util_1 = Util

  return Util_1
}
