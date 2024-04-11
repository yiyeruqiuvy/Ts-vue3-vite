/*
 * @Author: lisg
 * @Date: 2022-06-24 10:42:12
 * @LastEditTime: 2022-07-15 13:33:46
 * @LastEditors: wangting
 * @Description:
 * @FilePath: /creditDataGovernance/src/util/bubbling.js
 */
let util = {
  /**
   * 上浮粒子效果
   * @param {*} dom
   */
  creatBubbling (dom,color) {
    var oc = dom
    dom.height = dom.parentNode.clientHeight - 20
    dom.width = dom.parentNode.clientWidth
    if (oc.getContext) {
      var ctx = oc.getContext('2d')

      // 在画布上随机生成圆
      var arr = []
     

      // 将数组中的圆绘制到画布上
      setInterval(function () {
        /* console.log(arr) */
        ctx.clearRect(0, 0, oc.width, oc.height)
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].y <= 20) {
            arr.splice(i, 1)
          }
          arr[i].deg += 5
          arr[i].x =
            arr[i].startX +
            Math.sin((arr[i].deg * Math.PI) / 180) * arr[i].step
          arr[i].y =
            arr[i].startY - ((arr[i].deg * Math.PI) / 180) * arr[i].step
        }
        // 绘制图形
        for (let i = 0; i < arr.length; i++) {
          /*  console.log(i) */
          ctx.save()
          ctx.fillStyle =
            'rgba(' +
            arr[i].red +
            ',' +
            arr[i].green +
            ',' +
            arr[i].blue +
            ',' +
            arr[i].alp +
            ')'         
          ctx.beginPath()
          ctx.arc(arr[i].x, arr[i].y, arr[i].r, 0, 2 * Math.PI)
          ctx.fill()
          ctx.restore()
        }
      }, 1000 / 60)

      // 往arr数组中存放每一个随机圆的数据
      setInterval(function () {
        var r = Math.random() * 2
        var x = Math.random() * oc.width
        var y = oc.height - r
        var red = color ? color.r:'57'
        var green =  color ? color.g:'208'
        var blue =  color ? color.b:'235'
        var alp = Math.random() * 1

        var deg = 0
        var startX = x
        var startY = y
        var step = Math.random() * 20 + 2

        arr.push({
          x: x,
          y: y,
          r: r,
          red: red,
          green: green,
          blue: blue,
          alp: alp,
          deg: deg,
          startX: startX,
          startY: startY,
          step: step
        })
      }, 50)
    }
  }
}
export default { ...util }
