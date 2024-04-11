<!--
 * @Descripttion: 普通折线图
 * @Author: peiqf
 * @Date: 2022-09-19 14:35:14
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-26 14:25:05
-->

<template>
    <div :id="echartId" class="echart"></div>
</template>

<script setup lang="ts" name="lineChart">
    import { reactive, getCurrentInstance, onMounted } from 'vue';
    // import * as echarts from 'echarts/core';
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
        color: ['#6ED9EF'],
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            top: '6%',
            right: '6%',
            textStyle: {
                color: '#F4FCFD',
                fontSize: 12,
            },
            itemWidth: 10,
            itemHeight: 5,
            icon: 'rect',
            // data: [],
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '20%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: [],
            axisLabel: {
                interval: 0,
                color: 'rgba(240, 252, 253, 0.8)',
                fontSize: 12,
                rotate: 45,
                margin: 10,
            },
            axisLine: { show: true, lineStyle: { color: '#92D7FE' } },
            axisTick: { show: false },
        },
        yAxis: {
            name: '',
            type: 'value',
            axisLabel: {
                interval: 0,
                color: 'rgba(240, 252, 253, 0.8)',
                fontSize: 12,
            },
            nameTextStyle: { color: 'rgba(240, 252, 253, 0.8)' },
            splitLine: {
                show: true,
                lineStyle: { color: 'rgba(240, 252, 253, 0.1)', type: 'dashed' },
            },
        },
        dataZoom: [
            {
                show: true,
                height: 17,
                xAxisIndex: [0],
                bottom: 30,
                start: 10,
                end: 80,
                moveHandleSize: 0,
                handleIcon:
                    'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                handleSize: '110%',
                handleStyle: {
                    color: '#0B75EE',
                },
                textStyle: {
                    color: ' #F0FCFD',
                },
                borderColor: '#006BE6',
                fillerColor: '#0657B5',
                dataBackground: {
                    areaStyle: {
                        color: 'rgba(0, 0, 0, 0)',
                    },
                    lineStyle: {
                        color: 'rgba(0, 0, 0, 0)',
                    },
                },
            },
        ],
        series: [
            {
                type: 'line',
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
