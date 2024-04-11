<!--
 * @Descripttion: 2d饼图
 * @Author: peiqf
 * @Date: 2022-09-19 14:55:23
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-26 15:13:49
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
        legend: {
            top: 'center',
            right: 10,
            itemWidth: 12,
            itemHeight: 12,
            orient: 'vertical',
            itemGap: 19,
            textStyle: {
                align: 'right',
                verticalAlign: 'middle',
                rich: {
                    a: {
                        color: '#F2F7FE',
                        fontSize: 14,
                        fontWeight: 400,
                        fontFamily: 'Source Han Sans CN',
                        opacity: 0.87,
                        padding: [4, 0, 0, 0],
                    },
                    b: {
                        color: '#F2F7FE',
                        fontSize: 14,
                        fontWeight: 400,
                        fontFamily: 'Source Han Sans CN',
                        opacity: 0.87,
                        padding: [4, 0, 0, 0],
                    },
                },
            },
        },
        tooltip: {
            type: 'item',
        },
        series: [
            {
                name: '渠道占比',
                type: 'pie',
                radius: [0, '80%'],
                center: ['30%', '50%'],
                label: {
                    show: false,
                },
                emphasis: {
                    disabled: true,
                },
                avoidLabelOverlap: false,
                hoverAnimation: false,
                itemStyle: {
                    color: '#0B1931',
                    borderWidth: 4,
                    borderColor: '#283850',
                },
                tooltip: {
                    show: false,
                },
                labelLine: {
                    show: false,
                },
                data: [{ value: 0, name: '', percent: 0 }],
            },
            {
                name: '渠道占比',
                type: 'pie',
                radius: ['86%', '96%'],
                center: ['30%', '50%'],
                avoidLabelOverlap: false,
                hoverAnimation: false,
                itemStyle: {
                    borderRadius: 0,
                    // borderColor: "#fff",
                    borderWidth: 2,
                    color: function (params) {
                        // 传入的是数据项 seriesIndex, dataIndex, data, value 等各个参数
                        const colorList = ['#4199FB', '#74F2F3', '#3DCC92', '#FBA50E', '#D9362B'];
                        return colorList[params.dataIndex];
                    },
                },
                label: {
                    position: 'center',
                    formatter: `{value|${15638}}\n{title|严重失信企业总数}`,
                    rich: {
                        title: {
                            height: 16,
                            color: 'rgba(244, 252, 253, 0.84)',
                            fontFamily: 'Source Han Sans CN',
                            fontSize: 16,
                            fontWeight: 400,
                            lineHeight: 54,
                        },
                        value: {
                            height: 23,
                            color: '#FCF6B3',
                            fontFamily: 'PangMenZhengDao',
                            fontSize: 27,
                            fontWeight: 400,
                            textShadow: '0px 1px 1px #FCF6B3',
                        },
                    },
                },
                emphasis: {
                    scale: true,
                },
                data: [],
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
