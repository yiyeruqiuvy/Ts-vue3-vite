/*
 * @Author: chenqy
 * @Date: 2019-10-22
 * @LastEditors: leizq
 * @LastEditTime: 2022-07-27 20:02:25
 * @Description: 气泡上升
 */
/**
 * 上升气泡效果图
 * @param {string} type 图案类型
 * @param {number} width 画布宽度
 * @param {number} height 画布高度
 * @param {number} starMaxRadius 点最大值
 * @param {number} starMinRadius 点最小值
 * @param {string} starColor 点颜色
 * @param {number} starNum 点数量
 */
let UpPoint = function (
  type = 'star',
  width,
  height,
  starMaxRadius = 8,
  starMinRadius = 3,
  starNum = 30,
  speed = 0.4
) {
  this.type = type
  this.width = width
  this.height = height
  this.starMaxRadius = starMaxRadius
  this.starMinRadius = starMinRadius
  this.starNum = starNum
  this.speed = speed
  this.points = [] // 所有点集合
  this.ctx = null
  this.demo = null
}
UpPoint.prototype = {
  // 上升点 --- 统一模板
  demoStar: function (starColor) {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = 50
    canvas.height = 50
    let half = canvas.width / 2
    let gradient = ctx.createRadialGradient(half, half, 0, half, half, half)
    gradient.addColorStop(0, starColor)
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(half, half, half, 0, Math.PI * 2)
    ctx.fill()
    this.demo = canvas
  },
  // 上升线条 --- 统一模板
  demoRect: function (color) {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = 30
    canvas.height = 30
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.rect(7.5, 7.5, 2, 15)
    ctx.fill()
    this.demo = canvas
  },
  // 整体容器
  init: function (color) {
    let canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    this.ctx = canvas.getContext('2d')
    if (this.type === 'star') {
      this.demoStar(color)
    } else {
      this.demoRect(color)
    }
    this.pointData()
    return canvas
  },
  // 点数据
  pointData: function () {
    for (let i = 0; i < this.starNum; i++) {
      let obj = {
        r: this.random(this.starMinRadius, this.starMaxRadius),
        x: this.random(0, this.width),
        y: this.random(0, this.height),
        speed: this.random(0, this.speed),
      }
      this.points.push(obj)
    }
  },
  draw: function (flag) {
    for (let i = 0; i < this.points.length; i++) {
      if (flag) {
        let x = (this.points[i].x += this.points[i].speed)
        let y = this.points[i].y
        let r = this.points[i].r
        if (x > this.width) {
          this.points[i].x = 0
        }
        this.ctx.drawImage(this.demo, x, y, r, r)
      } else {
        let x = this.points[i].x
        let y = (this.points[i].y -= this.points[i].speed)
        let r = this.points[i].r
        if (y < 0) {
          this.points[i].y = this.height
        }
        this.ctx.drawImage(this.demo, x, y, r, r)
      }
    }
  },
  // 清除画布
  clear: function () {
    this.ctx.clearRect(0, 0, this.width, this.height)
  },
  // 区间随机
  random: function (min = 0, max = 1) {
    return Math.random() * Math.abs(max - min) + min
  },
  // 得到实体
  getUpPoint: function () {
    return this
  },
}
export default UpPoint
