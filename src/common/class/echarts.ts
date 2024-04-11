/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2023-02-15 17:17:40
 * @LastEditors: peiqf
 * @LastEditTime: 2023-04-12 15:37:13
 */
import * as echarts from 'echarts/core'
import { debounce } from 'lodash'

export class Echarts {
  constructor(id: String, option: {}, delyTime?: Number, isAuto?: Boolean) {
    this.option = option
    this.delyTime = delyTime
    this.isAuto = isAuto
    this.myChart = echarts.init(document.getElementById(id))
    // this.init();//如果有延迟，可以通过在delay中调用init方法
  }
  init() {
    this.myChart.resize()
    this.myChart.clear()
    this.myChart.setOption(this.option)

    if (this.isAuto) {
      tools.loopShowTooltip(this.myChart, this.option, { loopSeries: true })
    }
    window.addEventListener('resize', () => {
      debounce(() => {
        // 引入debounce，防止频繁更改浏览页尺寸出现页面抖动
        if (this.myChart) {
          this.myChart.resize()
        }
      }, 100)
    })
    return this.myChart
  }
  delayInit() {
    setTimeout(() => {
      this.init()
    }, this.delyTime)
  }
}
