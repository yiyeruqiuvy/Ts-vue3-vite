/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2022-12-22 11:09:52
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-20 15:57:49
 */
// 新建echarts
import { debounce } from 'lodash';
import * as echarts from 'echarts/core';
import HighCharts from 'highcharts'; //必须引入

// echart初始顺便监听
const initCharts = (id: string, option: any) => {
  // const myChart = ref();
  const myChart = echarts.init(document.getElementById(id));

  myChart.clear();
  myChart.setOption(option);
  window.addEventListener('resize', function () {
    debounce((myChart) => {
      // 引入debounce，防止频繁更改浏览页尺寸出现页面抖动
      if (myChart) {
        myChart.resize();
      }
    }, 100);
  });
};
//初始化hchart并且自适应
const initHcharts = (id: string, option: any) => {
  const hChart = HighCharts.chart(id, option);
  window.addEventListener('resize', function () {
    debounce((hChart) => {
      // 引入debounce，防止频繁更改浏览页尺寸出现页面抖动
      if (hChart) {
        hChart.reflow();
      }
    }, 100);
  });
};

// 千位符转换
const numToChange = (num: any) => {
  let arr = num.toString().split('').reverse();
  arr.map((item: any, index: number) => {
    if (index % 3 === 0 && index !== 0) {
      arr.splice(index, 0, ',');
    }
  });
  return arr.reverse().join('');
};

// 深拷贝
const deepClone = (obj: any) => {
  let _obj = JSON.stringify(obj); //  对象转成字符串
  let objClone = JSON.parse(_obj); //  字符串转成对象
  return objClone;
};
// 把数据变成4的倍数

const handleDataTo4 = (data: any) => {
  let num = parseInt(data);
  if (data < 1) {
    num = 1;
  }
  if (typeof num === 'number') {
    // console.log(typeof data)
    // console.log(num)
    while (num % 4 !== 0) {
      num++;
    }
  }
  return num;
};
export { initCharts, initHcharts, numToChange, deepClone, handleDataTo4 };

// export default function(){

// 		return {num,fav,favBtn}

// }
