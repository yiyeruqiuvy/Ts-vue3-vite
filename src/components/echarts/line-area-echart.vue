<!--
 * @Descripttion: 区域这折线图2
 * @Author: peiqf
 * @Date: 2022-09-21 16:15:09
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-26 14:56:36
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
    const props = withDefaults(defineProps<{ chartData: typeof proxy.option }>(), {});
    const echartId = new Date().getTime() + Math.random().toString(36).substr(2) + 'id';

    const { proxy } = getCurrentInstance();
    const initOption = deepClone(proxy.option);
    let myOption = reactive({
        grid: {
            top: '21%',
            left: '2%',
            right: '2%',
            bottom: '0%',
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
            },
        },
        xAxis: {
            axisTick: {
                show: false,
                alignWithLabel: true,
            },
            axisLine: {
                lineStyle: {
                    color: '#9FDCFE',
                },
            },
            axisLabel: {
                color: 'rgba(215, 242, 254, 0.8)',
                fontSize: 12,
                fontWeight: 500,
                fontFamily: 'SourceHanSansCN-Normal',
                interval: 0,
            },
            data: ['1月'],
        },
        yAxis: {
            name: '单位/次',
            nameTextStyle: {
                fontFamily: 'SourceHanSansCN-Normal',
                fontSize: 12,
                color: 'rgba(242, 252, 253, 0.8)',
                fontWeight: 400,
            },
            minInterval: 1,
            type: 'value',
            axisTick: {
                show: false,
            },
            axisLabel: {
                margin: 16,
                color: 'rgba(242, 252, 253, 0.8)',
                fontSize: 12,
                fontWeight: 400,
                fontFamily: 'SourceHanSansCN-Normal',
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(240, 252, 253, 0.2)',
                    type: 'dashed',
                },
            },
            axisLine: {
                show: false,
            },
        },
        series: [
            {
                data: [820],
                type: 'line',
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        {
                            // 只要修改前四个参数就ok
                            offset: 0,
                            color: 'rgba(102,238,180,0)',
                        }, // 柱图渐变色
                        {
                            offset: 1,
                            color: '#66EEB4',
                        },
                    ]),
                },
                lineStyle: {
                    color: '#49AF8C',
                },
                // animationDelay: function (idx) {
                //   return 3200
                // },
                showSymbol: false,
                ellipsis: {
                    disabled: true,
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
