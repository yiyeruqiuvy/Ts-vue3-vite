/*
 * @Descripttion:highcharts类
 * @Author: peiqf
 * @Date: 2023-02-16 09:10:20
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-16 09:27:54
 */
import HighCharts from 'highcharts'; //必须引入
import { debounce } from 'lodash';

export class Highchart {
  constructor(id: String, option: any) {
    this.id = id;
    this.option = option;
    this.init();
  }
  init() {
    this.hChart = HighCharts.chart(this.id, this.option);
    window.addEventListener('resize', () => {
      debounce(() => {
        // 引入debounce，防止频繁更改浏览页尺寸出现页面抖动
        if (this.hChart) {
          this.hChart.reflow();
        }
      }, 100);
    });
  }
  delay() { }
}
