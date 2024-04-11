<!--
 * @Descripttion: 雷达图
 * @Author: peiqf
 * @Date: 2022-09-20 14:10:51
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-26 16:20:58
-->
<template>
    <div :id="echartId" class="echart"></div>
</template>

<script setup lang="ts" name="radarEchart">
    import { reactive, getCurrentInstance, onMounted } from 'vue';
    import { merge } from 'lodash';
    import 'echarts-wordcloud/dist/echarts-wordcloud';
    import { initCharts, deepClone } from '@/common/mixin/mixin';
    import { optionData } from '@/common/mixin/echarts.d';
    const props = withDefaults(defineProps<{ chartData: typeof proxy.option }>(), {});
    const echartId = new Date().getTime() + Math.random().toString(36).substr(2) + 'id';

    const { proxy } = getCurrentInstance();
    const initOption = deepClone(proxy.option);
    let myOption = reactive({
        tooltip: {},
        // tooltip: {
        //     confine: true,
        //     trigger: 'item',
        //     formatter: function (params) {
        //         let relVal = params.name;
        //         let indicator = that.allOption.radar.indicator;
        //         for (let i = 0; i < params.data.value.length; i++) {
        //             relVal +=
        //                 '<br/>' + indicator[i]['name'] + ' : ' + params.data.value[i] + ' ' + '分';
        //         }
        //         return relVal;
        //     },
        // },
        legend: {
            bottom: 5,
            itemWidth: 14,
            itemHeight: 4,
            itemGap: 20,
            textStyle: {
                color: '#F2FCFD',
                fontSize: 13,
            },
        },
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
            },
        },
        series: [],
    });
    let option = () => {
        return merge(initOption, myOption, props.chartData, optionData);
    };
    onMounted(() => {
        let myOptData = option();
        myOptData.tooltip = {
            confine: true,
            trigger: 'item',
            borderColor: 'rgba(39, 199, 254, 0.99)',
            backgroundColor: 'rgba(48, 157, 255, 0.6)',
            textStyle: {
                color: '#F2FCFD',
            },
            formatter: function (params) {
                let relVal = params.name;
                let indicator = option().radar.indicator;

                for (let i = 0; i < params.data.value.length; i++) {
                    relVal +=
                        '<br/>' + indicator[i]['name'] + ' : ' + params.data.value[i] + ' ' + '分';
                }
                return relVal;
            },
        };
        // console.log(myOptData);
        initCharts(echartId, myOptData);
    });
</script>

<!-- <style lang="less" scoped>
    .radar-box {
        width: 100%;
    }
</style> -->
