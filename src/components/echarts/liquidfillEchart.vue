<!--
 * @Descripttion: 水球图
 * @Author: peiqf
 * @Date: 2022-09-20 14:28:58
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-16 09:05:48
-->

<template>
    <div :id="echartId" class="echart"></div>
</template>

<script setup lang="ts" name="lineAreaChart">
    import { reactive, getCurrentInstance, onMounted } from 'vue';
    // import * as echarts from 'echarts/core';
    import { merge } from 'lodash';
    import 'echarts-liquidfill';

    import 'echarts-wordcloud/dist/echarts-wordcloud';
    import { initCharts, deepClone } from '@/common/mixin/mixin';
    import { optionData } from '@/common/mixin/echarts.d';
    const props = withDefaults(defineProps<{ chartData: typeof proxy.option }>(), {});
    const echartId = new Date().getTime() + Math.random().toString(36).substr(2) + 'id';

    const { proxy } = getCurrentInstance();
    const initOption = deepClone(proxy.option);
    let myOption = reactive({
        color: [
            {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 2,
                colorStops: [
                    // !! 在此添加渐变过程色 !!
                    { offset: 0.01, color: '#06F9FB' },
                    { offset: 1, color: '#084E7B' },
                ],
            },
            {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 2,
                colorStops: [
                    // !! 在此添加渐变过程色 !!
                    { offset: 0.01, color: '#001145' },
                    { offset: 1, color: '#0099FF' },
                ],
            },
        ],
        title: {
            text: '',
            left: 'center',
            bottom: -6,
            textStyle: {
                fontFamily: 'Source Han Sans CN',
                fontWeight: 400,
                fontSize: 14,
                color: '#FEFEFE',
            },
        },
        series: [
            {
                type: 'liquidFill', // 图表类型
                radius: '64px',
                center: ['50%', '45%'],
                data: [0.45, 0.45], // data个数代表波浪数
                backgroundStyle: {
                    color: {
                        type: 'radial', // linear 线性渐变  radial径向渐变
                        x: 0.48, // 0.5为正中心，如果小于渐变中心靠左
                        y: 0.54, // 0.5为正中心，如果小于渐变中心靠上
                        r: 0.8,
                        colorStops: [
                            {
                                offset: 0,
                                color: '#001145', // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: '#059cc5', // 100% 处的颜色
                            },
                        ],
                    },
                    shadowColor: 'rgba(19,218,255,0.9000)', //阴影
                    shadowBlur: 10, //阴影模糊
                },
                label: {
                    fontFamily: 'Heiti SC',
                    color: '#6BCEFF',
                    fontWeight: 500,
                    fontSize: 21,
                },
                color: [
                    //color一定要是个数组 ，每一项对应一个波浪，可以给每个波浪单独配置颜色
                    {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 1,
                                color: '#0190A7',
                            },
                            {
                                offset: 0,
                                color: '#26C2E8',
                            },
                        ],
                        globalCoord: false,
                    },
                    {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 1,
                                color: '#0190A7',
                            },
                            {
                                offset: 0,
                                color: '#26C2E8',
                            },
                        ],
                        globalCoord: false,
                    },
                ],
                outline: {
                    show: false,
                },
            },
            //进度线
            {
                type: 'pie',
                center: ['50%', '45%'],
                radius: [38, 43], //进度线粗细
                hoverAnimation: false,
                label: {
                    show: false,
                },
                labelLine: {
                    show: false,
                },
                data: [
                    {
                        name: '已占比列',
                        value: 45, //进度
                        itemStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 2,
                                colorStops: [
                                    // !! 在此添加渐变过程色 !!
                                    { offset: 0.01, color: '#08F9FB' },
                                    { offset: 1, color: '#001145' },
                                ],
                            },
                        },
                    },
                    {
                        //画剩余的刻度圆环
                        name: '未占比例',
                        value: 55,
                        itemStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 2,
                                colorStops: [
                                    // !! 在此添加渐变过程色 !!
                                    { offset: 0.01, color: '#113B64' },
                                    { offset: 1, color: '#0099FF' },
                                ],
                            },
                        },
                    },
                ],
                emphasis: {
                    disabled: true,
                },
            },
        ],
        animationDelay: function (idx) {
            // 越往后的数据延迟越大
            return idx * 10 + 3000;
        },
    });

    const option = () => {
        return merge(initOption, myOption, props.chartData, optionData);
    };
    onMounted(() => {
        // console.log(option());
        initCharts(echartId, option());
    });
</script>

<style scoped lang="less">
    // .rank_bar_echart {
    //     width: 3.84rem;
    //     height: 1.6rem;
    // }
</style>
