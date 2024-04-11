<!-- 
 * @Descripttion: 柱状图DIY2
 * @Author: peiqf
 * @Date: 2022-07-18 14:33:49
 * @LastEditors: peiqf
 * @LastEditTime: 2023-04-12 14:53:54
-->

<template>
    <div :id="echartId" class="echart"></div>
</template>

<!-- <script setup lang="ts" name="barEchart">
    import { Echarts } from '@/common/class/echarts';
    import { reactive, getCurrentInstance, onBeforeMount, onMounted, nextTick } from 'vue';
    import { merge } from 'lodash';

    import { deepClone, handleDataTo4 } from '@/common/mixin/mixin';
    // import { number } from 'echarts/core';
    import { optionData } from '@/common/mixin/echarts.d';
    const props = withDefaults(defineProps<{ chartData: typeof proxy.option }>(), {
        chartData: {},
    });
    const echartId = new Date().getTime() + Math.random().toString(36).substr(2) + 'id';

    const { proxy } = getCurrentInstance();
    const initOption = deepClone(proxy.option);
    let yHeight = reactive({
        yAxis: [
            {
                max: 22,
                interval: 2,
            },
            {
                max: 22,
                interval: 2,
            },
        ],
    });
    let myOption = reactive({
        // color: ['#3CFFB3', '#6ED9EF'],
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            top: '2%',
            left: '0',
            textStyle: {
                color: '#F2FCFD',
                fontSize: 12,
            },
            // align: 'left',
            orient: 'horizontal',
            padding: [6, 2],
            itemGap: 6,
            itemWidth: 12,
            itemHeight: 12,
            icon: 'rect',
            data: [],
        },

        grid: {
            top: '24%',
            left: '3%',
            right: '2%',
            bottom: '0%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: [],
            axisLabel: {
                interval: 0,
                color: 'rgba(240, 252, 253, 0.7)',
                fontSize: 13,
                rotate: 45,
                margin: 29,
                align: 'center',
            },
            axisLine: { show: true, lineStyle: { color: '#9FDCFE' } },
            axisTick: { show: false },
        },

        yAxis: [
            {
                name: '特定岗位人群承诺书数量',
                nameGap: 0,
                type: 'value',
                min: 0,
                splitNumber: 4,
                max: yHeight.yAxis[0].max,
                interval: yHeight.yAxis[0].interval,
                offset: 13,
                axisLabel: {
                    interval: 0,
                    color: 'rgba(240, 252, 253, 0.7)',
                    fontSize: 14,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(240, 252, 253, 0.2)',
                        type: 'dashed',
                    },
                },
                nameTextStyle: {
                    color: 'rgba(240, 252, 253, 0.7)',
                    fontSize: 12,
                    padding: [0, -100, 20, 0],
                    align: 'right',
                },
            },
            {
                name: '不“挖矿”承诺书数量',
                nameGap: 0,
                type: 'value',
                min: 0,
                max: yHeight.yAxis[1].max,
                interval: yHeight.yAxis[1].interval,
                splitNumber: 4,
                axisLabel: {
                    interval: 0,
                    color: 'rgba(240, 252, 253, 0.7)',
                    fontSize: 14,
                },
                nameTextStyle: {
                    color: 'rgba(240, 252, 253, 0.7)',
                    padding: [0, -30, 20, 0],
                    align: 'right',
                    fontSize: 12,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(240, 252, 253, 0.1)',
                        type: 'dashed',
                    },
                },
            },
        ],
        series: [],
        animationDelay: function (idx: number) {
            // 越往后的数据延迟越大
            // console.log(_time)
            // if (_time === 1) {
            return idx * 10 + 300;
            // } else return idx * 10;
        },
    });
    const calculationY = () => {
        let max1 = handleDataTo4(Math.max(...props.chartData.series[0].data));
        let max2 = handleDataTo4(
            Math.max(...props.chartData.series[1].data, ...props.chartData.series[2].data)
        );
        yHeight.yAxis[0].max = max1;
        yHeight.yAxis[0].interval = max1 / 4;
        yHeight.yAxis[1].max = max2;
        yHeight.yAxis[1].interval = max2 / 4;
        // return yHeight;
    };
    // calculationY();

    const option = () => {
        return merge(initOption, myOption, props.chartData, optionData);
    };

    onBeforeMount(() => {
        calculationY();
        myOption.yAxis[0].max = yHeight.yAxis[0].max;
        myOption.yAxis[0].interval = yHeight.yAxis[0].interval;
        myOption.yAxis[1].max = yHeight.yAxis[1].max;
        myOption.yAxis[1].interval = yHeight.yAxis[1].interval;
    });
    onMounted(() => {
        // calculationY();
        // console.log(option());
        // console.log(yHeight);
        nextTick(() => {
            new Echarts(echartId, option()).init();
            // initCharts(echartId, option());
        });
        // console.log(option());
    });
</script> -->
<script setup lang="ts" name="barEchart">
    import { ref, reactive, watchEffect, onMounted, nextTick } from 'vue';
    import { Echarts } from '@/common/class/echarts';
    // import { defaultOption } from '../../mixins/echartOption';
    import { optionData } from '@/common/mixin/echarts.d';

    import { merge } from 'lodash';
    // props
    const props = defineProps({
        chartData: {
            type: Object,
        },
        isAuto: {
            type: Boolean,
            default: true,
        },
    });
    // data
    let echartId = ref(new Date().getTime() + Math.random().toString(36).substr(2) + 'id');
    let myOption = reactive({
        // color: ['#3CFFB3', '#6ED9EF'],
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            top: '2%',
            left: '0',
            textStyle: {
                color: '#F2FCFD',
                fontSize: 12,
            },
            // align: 'left',
            orient: 'horizontal',
            padding: [6, 2],
            itemGap: 6,
            itemWidth: 12,
            itemHeight: 12,
            icon: 'rect',
            data: [],
        },

        grid: {
            top: '24%',
            left: '3%',
            right: '2%',
            bottom: '0%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: [],
            axisLabel: {
                interval: 0,
                color: 'rgba(240, 252, 253, 0.7)',
                fontSize: 13,
                rotate: 45,
                margin: 29,
                align: 'center',
            },
            axisLine: { show: true, lineStyle: { color: '#9FDCFE' } },
            axisTick: { show: false },
        },

        yAxis: [
            {
                name: '特定岗位人群承诺书数量',
                nameGap: 0,
                type: 'value',
                min: 0,
                splitNumber: 4,
                // max: yHeight[0].max,
                // interval: yHeight[0].interval,
                offset: 8,
                axisLabel: {
                    interval: 0,
                    color: 'rgba(240, 252, 253, 0.7)',
                    fontSize: 14,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(240, 252, 253, 0.2)',
                        type: 'dashed',
                    },
                },
                nameTextStyle: {
                    color: 'rgba(240, 252, 253, 0.7)',
                    fontSize: 12,
                    padding: [0, -100, 20, 0],
                    align: 'right',
                },
            },
            {
                name: '不“挖矿”承诺书数量',
                nameGap: 0,
                type: 'value',
                min: 0,
                // max: yHeight[1].max,
                // interval: yHeight[1].interval,
                splitNumber: 4,
                axisLabel: {
                    interval: 0,
                    color: 'rgba(240, 252, 253, 0.7)',
                    fontSize: 14,
                },
                nameTextStyle: {
                    color: 'rgba(240, 252, 253, 0.7)',
                    padding: [0, -30, 20, 0],
                    align: 'right',
                    fontSize: 12,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(240, 252, 253, 0.1)',
                        type: 'dashed',
                    },
                },
            },
        ],
        series: [],
        animationDelay: function (idx) {
            // 越往后的数据延迟越大
            // console.log(_time)
            // if (_time === 1) {
            return idx * 10 + 300;
            // } else return idx * 10;
        },
    });
    // 方法
    let option = () => merge({}, optionData, myOption, props.chartData);
    const init = () => {
        nextTick(() => {
            new Echarts(echartId.value, option(), 0, props.isAuto).init();
        });
    };
    // 监听
    watchEffect(() => {
        option();
        init();
    });

    onMounted(() => {
        init();
    });
</script>
<style scoped></style>
