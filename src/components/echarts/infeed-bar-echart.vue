<!--
 * @Descripttion: 条形图DIY1
 * @Author: peiqf
 * @Date: 2022-09-19 10:50:51
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-26 13:35:22
-->

<template>
    <div :id="echartId" class="echart"></div>
</template>

<script setup lang="ts" name="infeedBarEchart">
    import { reactive, getCurrentInstance, onMounted } from 'vue';
    import * as echarts from 'echarts/core';
    import { merge } from 'lodash';

    import { initCharts, numToChange, deepClone } from '@/common/mixin/mixin';
    import { optionData } from '@/common/mixin/echarts.d';
    const props = withDefaults(defineProps<{ chartId?: string; chartData: object }>(), {
        chartId: 'infeed',
    });
    const echartId = new Date().getTime() + Math.random().toString(36).substr(2) + 'id';

    const { proxy } = getCurrentInstance();
    const initOption = deepClone(proxy.option);
    let myOption = reactive({
        grid: {
            left: '6%',
            right: '15%',
            bottom: '13%',
            top: '3%',
            containLabel: true,
        },
        xAxis: {
            show: true,
            type: 'value',
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                show: false,
                color: '#F2F7FE',
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(240, 252, 253, 0.1)',
                    type: 'dashed',
                },
            },
        },
        yAxis: [
            {
                type: 'category',
                inverse: true,
                offset: 13,
                axisLabel: {
                    show: true,
                    // margin: 12.5,
                    // textStyle: {
                    color: 'rgba(242, 247, 254, 0.67)',
                    fontSize: '14',
                    // },
                },
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    onZero: false,
                    lineStyle: {
                        color: '#6DF3FE',
                        opacity: 0.5,
                    },
                },
                // data: ['sas', 'sas', '213s'],
            },
        ],
        series: [
            {
                type: 'bar',
                zlevel: 1,
                itemStyle: {
                    borderRadius: 1,
                    // linear-gradient(90deg, #288DFB 0%, #42EDFB 80%, #FFFFFF 99%);
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        {
                            offset: 0,
                            color: '#288DFB',
                        },
                        {
                            offset: 0.7,
                            color: '#42EDFB',
                        },
                        {
                            offset: 0.99,
                            color: '#FFFFFF',
                        },
                    ]),
                },
                barCategoryGap: '80%',
                label: {
                    show: true,
                    distance: 10,
                    position: 'right',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 14,
                    formatter: (params) => {
                        return numToChange(parseInt(params.data));
                    },
                },
                barWidth: '14%',
                // data: [12, 213, 421],
            },
        ],
    });
    const option = () => {
        return merge(initOption, myOption, props.chartData, optionData);
    };

    onMounted(() => {
        initCharts(echartId, option());
        // console.log(option());
    });
</script>
