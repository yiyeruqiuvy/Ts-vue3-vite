<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangxueyao
 * @Date: 2022-07-22 10:16:38
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-08 15:39:51
-->
<template>
  <div>
    <div :id="chartID" class="radar-box" ref="tadar"></div>
    <div
      class="tooltip"
      v-show="tooltipShow"
      :style="{ zIndex: tooltipShow ? 10 : -1, left: toolLeft, top: toolTop }"
    >
      <div class="tooltipTitle">
        {{ tooltipData.title }}
      </div>
      <div class="tooltipContent" v-for="(item, idx) of tooltipData.content" :key="idx">
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import { merge, debounce } from 'lodash'
export default {
  data() {
    return {
      chartID: '',
      time: 0,
      option: {
        animationDelay: function (idx) {
          return idx * 10 
        },
        legend: {
          // top: 10,
          bottom: -5,
          itemWidth: 14,
          itemHeight: 4,
          itemGap: 20,
          textStyle: {
            color: '#F2FCFD',
            fontSize: 13,
          },
        },
        // tooltip: {
        //   confine: true,
        //   trigger: "item",
        //   formatter: function (params) {
        //     console.log(this)
        //     let relVal = params.name+ params.data.value[0];
        //     // let typeList = _this.warningDetailData;
        //     // for (let i = 0; i < params.data.value.length; i++) {
        //     //   relVal +=
        //     //     "<br/>" +
        //     //     " : " +
        //     //     params.data.value[i] +
        //     //     " " +
        //     //     "分";
        //     // }
        //     return relVal;
        //   },
        // },
        radar: {
          radius: '60%',
          splitLine: {
            lineStyle: {
              type: 'dotted',
              opacity: 0.5,
            },
          },
          splitArea: {
            areaStyle: {
              color: [
                'rgba(255,255,255,0.3)',
                'rgba(255,255,255,0.3)',
                'rgba(255,255,255,0.3)',
                'rgba(255,255,255,0.3)',
                'rgba(255,255,255,0.1)',
              ],
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.4)',
            },
          },
          axisTick: {
            lineStyle: {
              opacity: 0.5,
            },
          },
          axisName: {
            color: '#F2FCFD',
            show: false,
          },
        },
        series: [],
      },
      tooltipData: {
        title: '',
        content: [],
      },
      tooltipShow: false,
      toolLeft: '5rem',
      toolTop: '2rem',
    }
  },
  props: {
    optionData: Object,
  },
  computed: {
    // 合并配置对象
    allOption() {
      return merge({}, this.option, this.optionData)
    },
  },
  created() {
    this.chartID = this.uuid()
    let that = this
    this.option.animationDelay = function (idx) {
      if (that.time == 0) {
        return idx * 10 
      } else {
        return 0
      }
    }
  },
  mounted() {
    // 实例化echarts对象
    this.$nextTick(() => {

      // this.$refs.tadar.width=
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    optionData: {
      deep: true,
      handler: function () {
        this.$nextTick(() => {
          this.initChart()
        })
      },
    },
  },
  methods: {
    // 生成唯一uuid做为唯一标识符
    uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    hoverToolTip(params) {
      let indicator = this.allOption.radar.indicator
      // console.log(indicator)
      this.tooltipData.title = params.name
      this.tooltipData.content = []
      for (let i = 0; i < params.data.value.length; i++) {
        this.tooltipData.content.push(
          indicator[i]['name'] + ' : ' + params.data.value[i] + ' ' + '分'
        )
      }
      // this.tooltipData.content = relVal
    },
    // 绘图
    initChart() {
      if (!document.getElementById(this.chartID)) return
      const that = this
      this.chart = echarts.init(document.getElementById(this.chartID))
      // that.allOption.tooltip = {
      //   // confine: true,
      //   trigger: 'item',
      //   borderColor: 'rgba(39, 199, 254, 0.99)',
      //   backgroundColor: 'rgba(48, 157, 255, 0.6)',
      //   textStyle: {
      //     color: '#F2FCFD',
      //   },
      //   show: false,
      //   formatter: function (params) {
      //     // console.log(params)
      //     let relVal = params.name
      //     let indicator = that.allOption.radar.indicator
      //     for (let i = 0; i < params.data.value.length; i++) {
      //       relVal += '<br/>' + indicator[i]['name'] + ' : ' + params.data.value[i] + ' ' + '分'
      //     }
      //     return relVal
      //   },
      // }
      this.chart.clear()
      this.chart.setOption(this.allOption)
      this.chart.on('legendselectchanged', function (params) {
        that.time++
      })
      this.chart.on('click', function (params) {
        if (params.componentType === 'radar') {
          let name = params.name.split(' }')[0].split(' ')[1]
          // that.$emit('changeTwo', name)
          that.$attrs.changeTwo(name)
        }
      })
      this.chart.on('mouseover', function (params) {
        if (params.componentType === 'series') {
          that.hoverToolTip(params)
          that.toolLeft = params.event.offsetX / 100 + 'rem'
          that.toolTop = params.event.offsetY / 100 + 'rem'
          that.tooltipShow = true
          // console.log(that.tooltipShow, that.toolLeft, that.toolTop)
        }
      })
      this.chart.on('mousemove', function (params) {
        if (params.componentType === 'series') {
          that.hoverToolTip(params)
          that.toolLeft = params.event.offsetX / 100 + 0.2 + 'rem'
          that.toolTop = params.event.offsetY / 100 + 0.2 + 'rem'
          that.tooltipShow = true
          // console.log(that.tooltipShow, that.toolLeft, that.toolTop)
          // console.log( that.toolLeft)
        }
      })
      this.chart.on('mouseout', function (params) {
        that.tooltipShow = false
      })
      window.addEventListener(
        'resize',
        debounce(() => {
          // 引入debounce，防止频繁更改浏览页尺寸出现页面抖动
          this.$nextTick(function () {
            if (that.chart) {
              that.chart.resize()
            }
          })
        }, 100)
      )
    },
  },
}
</script>
<style lang="less" scoped>
.radar-box {
  // width: 100%;
  width: 5.8rem;
  height: 4.2rem;
}
.tooltip {
  width: 2.6rem;
  // height: 2rem;
  position: absolute;
  top: 2rem;
  left: 5rem;
  color: #f2fcfd;
  padding: 0.1rem 0.1rem;
  border-radius: 0.1rem;
  border: 0.01rem solid rgba(39, 199, 254, 0.99);
  background-color: rgba(48, 157, 255, 0.6);
  // z-index: -1;
  .tooltipTitle {
  }
  .tooltipContent {
  }
}
</style>
