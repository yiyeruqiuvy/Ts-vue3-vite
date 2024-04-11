<!--
 * @Descripttion: 半圆环图
 * @Author: peiqf
 * @Date: 2022-09-19 16:34:44
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-26 15:51:33
-->
<template>
    <div :id="echartId" class="echart"></div>
</template>

<script setup lang="ts" name="lineAreaChart">
    import { reactive, getCurrentInstance, onMounted } from 'vue';
    import * as echarts from 'echarts/core';
    import { merge } from 'lodash';
    import 'echarts-wordcloud/dist/echarts-wordcloud';
    import { initCharts, deepClone } from '@/common/mixin/mixin';
    import { optionData } from '@/common/mixin/echarts.d';
    const props = withDefaults(defineProps<{ chartData: typeof proxy.option }>(), {});
    const echartId = new Date().getTime() + Math.random().toString(36).substr(2) + 'id';

    const { proxy } = getCurrentInstance();
    const initOption = deepClone(proxy.option);
    let myOption = reactive({
        tooltip: {
            show: false,
        },
        title: [
            {
                // text: this.chartData.percent,
                // subtext: `${this.chartData.title}`,
                left: '50%',
                top: '40%',

                textAlign: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: '0.2rem',
                    color: 'rgba(121, 253, 254, 1)',
                    textAlign: 'center',
                },
                itemGap: 25,
                subtextStyle: {
                    fontWeight: 'normal',
                    fontSize: '0.14rem',
                    color: 'rgba(224, 224, 224, 1)',
                    textAlign: 'center',
                },
            },
        ],
        angleAxis: {
            axisLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            min: 0,
            max: 100,
            // boundaryGap: ['0', '10'],
            startAngle: 180,
        },
        radiusAxis: {
            type: 'category',
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                show: true,
                margin: 15,
                fontSize: '0.14rem',
                color: 'rgba(224, 224, 224, 1)',
            },
            data: [0],

            z: 20,
        },
        polar: {
            radius: '180%',
            center: ['50%', '70%'],
        },
        series: [
            {
                type: 'bar',
                // data: [, , Number(this.chartData.value) / 2],
                z: 1,
                coordinateSystem: 'polar',
                barMaxWidth: 10,
                name: '警告事件',
                roundCap: true,
                color: new echarts.graphic.LinearGradient(0, 1, 1, 0, [
                    {
                        offset: 0,
                        color: 'rgba(9, 53, 84, 1)',
                    },
                    {
                        offset: 0.4,
                        color: 'rgba(121, 253, 254, 1)',
                    },
                ]),
                barGap: '-100%',
            },
            {
                type: 'bar',
                data: [, , 50],
                z: 0,
                silent: true,
                coordinateSystem: 'polar',
                barMaxWidth: 12,
                name: 'C',
                label: {
                    show: true,
                    position: 'end',
                    rotate: 0,
                    fontSize: '0.14rem',
                    color: 'rgba(224, 224, 224, 1)',
                    offset: [-10, 10],
                    formatter: (datas: object) => {
                        return '{d|' + datas.data * 2 + '}';
                    },
                    rich: {},
                },
                roundCap: true,
                color: 'rgba(5, 28, 71, 1)',
                barGap: '-100%',
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

<style></style>
