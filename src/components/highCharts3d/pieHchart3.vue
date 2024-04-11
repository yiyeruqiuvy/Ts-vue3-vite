<!--
 * @Descripttion:
 * @Author: wangxueyao
 * @Date: 2022-07-12
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-16 09:28:45
 -->
<template>
    <div class="steric-pie">
        <div class="tooltips">
            <div class="currentValue">{{ currentValue }}</div>
            <div>{{ currentLabel }}信用记录数</div>
        </div>
        <div :id="hchartId" class="highcharts"></div>
        <img src="./img/roll.png" alt="" />
    </div>
</template>

<script setup lang="ts" name="pieHchart3">
    import { merge } from 'lodash';
    import HighCharts from 'highcharts'; //必须引入
    // import highcharts3d from 'highcharts/highcharts-3d';
    import highcharts3d from 'highcharts/highcharts-3d';
    import highchartsMore from 'highcharts/highcharts-more'; // 扩展包
    import { nextTick, reactive, ref, onMounted, onBeforeMount } from 'vue';
    import { Highchart } from '@/common/class/highcharts';

    highcharts3d(HighCharts);
    highchartsMore(HighCharts);
    const hchartId = new Date().getTime() + Math.random().toString(36).substr(2) + 'id';

    const props = defineProps({
        chartData: {
            type: Object,
            default: () => {
                return {};
            },
        },
    });
    let myOption = reactive({
        credits: {
            enabled: false,
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            itemStyle: {
                color: '#F2F7FE',
            },
            itemHoverStyle: {
                color: '#F2F7FE',
            },
            itemMarginTop: 34,
            itemDistance: 30,

            x: -30,
            y: -20,
            symbolRadius: 0,
            symbolHeight: 12,
            symbolWidth: 12,
            // labelFormatter: function () {
            //   /*
            //    *  格式化函数可用的变量：this， 可以用 console.log(this) 来查看包含的详细信息
            //    *  this 代表当前数据列对象，所以默认的实现是 return this.name
            //    */
            //   return `${this.name}：   ${(this.y/this.sum).toFixed(2)*100 ? (this.y/this.sum).toFixed(2)*100 : 0 }  %`
            // },
        },
        tooltip: {
            enabled: false,
            followPointer: false,
            useHTML: true,
            // borderColor: 'rgba(0,0,0,0)',
            shadow: false,
            // className:"mytooltip"
            borderColor: 'rgba(39, 199, 254, 0.99)',
            backgroundColor: 'rgba(48, 157, 255, 0.6)',
            // backgroundColor: {
            //   radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
            //   stops: [
            //     [0, '#808080'],
            //     [1, 'rgba(0,0,0,0)'],
            //   ],
            // },
            style: {
                color: '#F2F7FE',
                fontFamily: 'PangMen',
            },
            // formatter: function () {
            //   return (
            //     "The value for <b>" +
            //     this.x +
            //     "</b> is <br/><b>" +
            //     this.y +
            //     "</b>"
            //   );
            // },
        },
        chart: {
            type: 'pie',
            width: 420,
            height: 174,
            marginTop: 0,
            marginBottom: 0,
            // marginRight: 150,
            // marginLeft: -20,
            options3d: {
                enabled: true,
                alpha: 55,
            },
            backgroundColor: 'rgba(0,0,0,0)',
            animation: false,
        },
        plotOptions: {
            pie: {
                innerSize: 80,
                depth: 30,
                center: ['41.4%', '48%'],
                colors: ['#74F2F3', '#FFED93', '#5ED8FD', '#FCA95F'],
                dataLabels: {
                    enabled: false,
                },
                showInLegend: true,
                point: {
                    events: {
                        mouseOver: function (e) {
                            e.target.graphic.attr({
                                translateY: -10,
                            });
                            currentLabel.value = e.target.options.name;
                            currentValue.value = e.target.options.y;
                        },
                        mouseOut: function (e) {
                            e.target.graphic.attr({
                                translateY: 0,
                            });
                        },
                        legendItemClick: function (e) {
                            return false;
                        },
                    },
                },
                states: {
                    hover: {
                        enabled: true,
                        duration: 90,
                        halo: {
                            opacity: 0.9,
                        },
                        animation: {
                            duration: 80,
                        },
                    },
                },
            },
        },
        series: [
            {
                data: [],
            },
        ],
    });
    let currentLabel = ref<string>('');
    let currentValue = ref<number>(0);
    let option = merge({}, myOption, props.chartData);

    const handleData = () => {
        currentValue.value = props.chartData.series[0].data[0].y;
        currentLabel.value = props.chartData.series[0].data[0].name;
        let max: number = props.chartData.series[0].data[0].y;
        props.chartData.series[0].data.forEach((item: object) => {
            max = Math.max(item.y, max);

            if (item.y > max) {
                currentValue.value = item.y;
                currentLabel.value = item.name;
            }
        });
    };
    onBeforeMount(() => {
        handleData();
        // console.log(props.chartData);
    });
    onMounted(() => {
        nextTick(() => {
            new Highchart(hchartId, option);
            // HighCharts.chart(hchartId, option);
        });
    });
</script>

<style lang="less" scoped>
    .steric-pie {
        position: relative;
        .tooltips {
            position: absolute;
            top: 0.6rem;
            left: 0.55rem;
            z-index: 10;
            color: slategray;
            .currentValue {
                margin: 0 0 0 0.6rem;
            }
        }
    }
    .highcharts {
        position: absolute;
        z-index: 9;
    }
    img {
        position: absolute;
        top: 0.7rem;
        left: 0.22rem;
        width: 2.1rem;
        height: 1.07rem;
        z-index: 0;
    }
</style>
