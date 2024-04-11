<!--
 * @Descripttion: 词云
 * @Author: peiqf
 * @Date: 2022-09-19 15:26:22
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-26 15:26:29
-->

<template>
    <div :id="echartId" class="echart"></div>
</template>

<script setup lang="ts" name="lineAreaChart">
    import { reactive, getCurrentInstance, onMounted } from 'vue';
    // import * as echarts from 'echarts/core';
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
        series: [
            {
                type: 'wordCloud',
                gridSize: 22,
                shape: 'circle',
                left: 'center',
                top: 'center',
                width: '100%',
                height: '100%',
                right: null,
                bottom: null,
                sizeRange: [13, 24],
                rotationRange: [0, 0],
                rotationStep: 30,
                drawOutOfBound: false,
                layoutAnimation: true,
                textStyle: {
                    color: function (v) {
                        if (v.value > 7) {
                            return 'rgba(121, 253, 254, 1)';
                        } else if (v.value > 5) {
                            return 'rgba(121, 253, 254, 0.8)';
                        } else if (v.value > 2) {
                            return 'rgba(121, 253, 254, 0.6)';
                        } else {
                            return 'rgba(121, 253, 254, 0.3)';
                        }
                    },
                },
                emphasis: {
                    focus: 'self',
                    textStyle: {
                        textShadowBlur: 10,
                        textShadowColor: '#333',
                    },
                },
                data: [],
            },
        ],
        animation: true,
    });
    const option = () => {
        return merge(initOption, myOption, props.chartData, optionData);
    };
    onMounted(() => {
        // console.log(option());
        initCharts(echartId, option());
    });
</script>
