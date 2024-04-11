<!--
 * @Descripttion: 折线图组件
 * @Author: peiqf
 * @Date: 2022-09-19 14:19:55
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-26 14:56:17
-->

<template>
    <div :id="echartId" class="echart"></div>
</template>

<script setup lang="ts" name="lineAreaChart">
    import { reactive, getCurrentInstance, onMounted } from 'vue';
    import * as echarts from 'echarts/core';
    import { merge } from 'lodash';

    import { initCharts, deepClone } from '@/common/mixin/mixin';
    import { optionData } from '@/common/mixin/echarts.d';
    const props = withDefaults(defineProps<{ chartData: typeof proxy.option }>(), {
        // chartId: 'infeed',
    });
    const echartId = new Date().getTime() + Math.random().toString(36).substr(2) + 'id';

    const { proxy } = getCurrentInstance();
    const initOption = deepClone(proxy.option);
    let myOption = reactive({
        // title: {
        //   textStyle: {
        //     color: "#126DFF",
        //   },
        // },
        // animationDelay: function (idx) {
        //     return idx * 10 + 4000;
        // },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985',
                },
            },
        },
        legend: {
            icon: 'roundRect',
            itemWidth: 14,
            right: 10,
            textStyle: {
                color: '#DADFFF',
                padding: [4, 0, 0, 0],
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: [
            {
                axisLine: {
                    lineStyle: {
                        color: '#B2C9FF',
                    },
                },
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    color: '#F2FCFD',
                    fontSize: 13,
                },
            },
        ],
        yAxis: [
            {
                axisLine: {
                    lineStyle: {
                        color: '#B2C9FF',
                    },
                },
                axisTick: {
                    show: false,
                },
                type: 'value',
                nameTextStyle: {
                    color: '#F2FCFD',
                },
                axisLabel: {
                    color: 'rgba(240, 252, 253, 0.8)',
                    fontSize: 13,
                },
                splitLine: {
                    show: false,
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['rgba(32,94,169,0.2)', 'rgba(0,42,91,0.2)'],
                    },
                },
            },
        ],
        series: [
            {
                type: 'line',
                symbol: 'circle',
                symbolSize: 10,
                seriesLayoutBy: 'row',
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(0, 226, 255,0.3)',
                        },
                        {
                            offset: 0.6,
                            color: 'rgba(0, 226, 255,0.1)',
                        },
                        {
                            offset: 0.8,
                            color: 'rgba(0, 226, 255,0)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(0, 226, 255,0)',
                        },
                    ]),
                },
                itemStyle: {
                    color: '#00E2FF', //改变折线点的颜色
                    lineStyle: {
                        color: '#00E2FF', //改变折线颜色
                    },
                },
            },
            {
                type: 'line',
                symbol: 'circle',
                symbolSize: 10,
                seriesLayoutBy: 'row',
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(121, 255, 206,0.3)',
                        },
                        {
                            offset: 0.6,
                            color: 'rgba(121, 255, 206,0.1)',
                        },
                        {
                            offset: 0.8,
                            color: 'rgba(121, 255, 206,0)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(121, 255, 206,0)',
                        },
                    ]),
                },
                itemStyle: {
                    color: '#79FFCE', //改变折线点的颜色
                    lineStyle: {
                        color: '#79FFCE', //改变折线颜色
                    },
                },
            },
        ],
    });
    const option = () => {
        return merge(initOption, myOption, props.chartData, optionData);
    };

    onMounted(() => {
        // console.log(option());
        initCharts(echartId, option());
    });
</script>

<style scoped></style>
