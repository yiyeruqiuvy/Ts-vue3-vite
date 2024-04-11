export function runClass() {
  var utils = {
    isFunction: function (obj) {
      return Object.prototype.toString.call(obj) === '[object Function]'
    },
    isArray: function (obj) {
      return Array.isArray
        ? Array.isArray(obj)
        : Object.prototype.toString.call(val) === '[object Array]'
    },
    mix: function (r, s) {
      for (var p in s) {
        //过滤掉原型链上面的属性
        if (s.hasOwnProperty(p)) {
          // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
          if (p !== 'prototype') {
            r[p] = s[p]
          }
        }
      }
    },
  }

  /**
   * 给一个普通的函数 增加extend和implement方法。
   * @param cls
   * @returns {*}
   */
  function classify(cls) {
    cls.extend = Class.extend
    cls.implement = implement
    return cls
  }
  /**
   * 基类生成工具
   */
  function Class(o) {
    //这个判断用来支持 将一个已有普通类转换成 Class类
    if (!(this instanceof Class) && utils.isFunction(o)) {
      return classify(o)
    }
  }

  /**
   * 创建一个类
   * @param parent 可选，可以直接创建时就指定继承的父类。
   * @param properties 可选，用来表明需要混入的类属性。有三个特殊的属性为Extends,Implements,Statics.分别代表要继承的父类，需要混入原型的东西，还有静态属性。
   * @returns Class类
   */
  Class.create = function (parent, properties) {
    //创建一个类时可以不指定要继承的父类。直接传入属性对象。
    if (!utils.isFunction(parent)) {
      properties = parent
      parent = null
    }

    properties = properties || {}
    //没有指定父类的话 就查看有没有Extends特殊属性，都没有的话就用Class作为父类
    parent = parent || properties.Extends || Class
    properties.Extends = parent

    //子类构造函数的定义
    function SubClass() {
      // 自动帮忙调用父类的构造函数
      parent.apply(this, arguments)

      // 真正的构造函数放在initialize里面，只在自己的构造函数内调用init.
      if (this.constructor === SubClass && this.init)
        this.init.apply(this, arguments)
      console.log(arguments)
    }

    //继承父类的方法
    if (parent !== Class) utils.mix(SubClass, parent)

    // Add instance properties to the subclass.
    implement.call(SubClass, properties)

    // Make subclass extendable.
    return classify(SubClass)
  }

  /**
   * 这里定义了一些特殊的属性，遍历时发现key是这里面的一个时，会调用这里面的方法处理。
   * @type {{Statics: Statics, Implements: Implements, Extends: Extends}}
   */
  Class.Mutators = {
    /**
     * 这个定义了继承的真正操作代码。
     * @param parent
     * @constructor
     */
    Extends: function (parent) {
      //这边的this指向子类;
      var existed = this.prototype
      //生成一个中介原型;
      var proto = createProto(parent.prototype)
      //将子类原型有的方法混入到新的中介原型上
      utils.mix(proto, existed)
      // 改变构造函数指向子类
      proto.constructor = this
      //改变原型 完成继承
      this.prototype = proto
      //为子类增加superclass属性，这样可以调用父类原型的方法。
      this._super = parent.prototype
    },
    /**
     * 这个有点类似组合的概念，支持数组。将其他类的属性混入到子类原型上
     * @param items
     * @constructor
     */
    Implements: function (items) {
      utils.isArray(items) || (items = [items])
      var proto = this.prototype,
        item
      while ((item = items.shift())) {
        utils.mix(proto, item.prototype || item)
      }
    },
    /**
     * 传入静态属性
     * @param staticProperties
     * @constructor
     */
    Statics: function (staticProperties) {
      utils.mix(this, staticProperties)
    },
  }
  /**
   * 用于在类定义之后，往类里面添加方法。提供了之后修改类的可能。
   * @param properties
   */
  function implement(properties) {
    var key, value
    for (key in properties) {
      value = properties[key]
      //发现属性是特殊的值时，调用对应的处理函数处理
      if (Class.Mutators.hasOwnProperty(key)) {
        Class.Mutators[key].call(this, value)
      } else {
        this.prototype[key] = value
      }
    }
  }

  Class.extend = function (properties) {
    properties || (properties = {})
    properties.Extends = this
    return Class.create(properties)
  }

  function Ctor() {}
  /**
   * 用来使用一个中介者来处理原型的问题，当浏览器支持`__proto__`时可以直接使用。否则新建一个空函数再将父类的原型赋值给这个空函数，返回这个空函数的实例
   * @type {{(*=): {__proto__: *}, (*): Ctor}}
   */
  var createProto = Object.__proto__
    ? function (proto) {
        return { __proto__: proto }
      }
    : function (proto) {
        Ctor.prototype = proto
        return new Ctor()
      }

  window.Class = Class
  return Class
}
