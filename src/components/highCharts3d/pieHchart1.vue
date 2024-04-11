<!--
 * @Descripttion: 3d饼图带高度层次
 * @Author: peiqf
 * @Date: 2022-12-27 16:34:53
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-16 09:19:52
-->
<template>
    <div class="big-box">
        <div :id="hchartId" ref="container" class="com-container"></div>
        <img src="./img/roll1.png" alt="" />
    </div>
</template>
<script setup lang="ts" name="pieHchart1">
    import { nextTick, reactive, onMounted } from 'vue';
    import { merge } from 'lodash';
    // import { initHcharts } from '@/common/mixin/mixin';
    import { Highchart } from '@/common/class/highcharts';
    import HighCharts from 'highcharts'; //必须引入
    // import highcharts3d from 'highcharts/highcharts-3d';
    import highcharts3d from 'highcharts/highcharts-3d';
    import highchartsMore from 'highcharts/highcharts-more'; // 扩展包

    highcharts3d(HighCharts);
    highchartsMore(HighCharts);

    // import HighCharts from 'highcharts';
    // import exporting from "highcharts/modules/exporting"; // 导出图例包
    // import exportData from "highcharts/modules/export-data"; //导出数据包
    // import accessibility from "highcharts/modules/accessibility"; // 辅助类配置图表可访问性包 可以阅读官网 https://api.highcharts.com.cn/highcharts/accessibility.highContrastTheme.html
    // const echartId = new Date().getTime() + Math.random().toString(36).substr(2) + 'id';
    // const { proxy } = getCurrentInstance();
    // exporting(Highcharts);
    // exportData(Highcharts);
    // accessibility(Highcharts);
    const hchartId = new Date().getTime() + Math.random().toString(36).substr(2) + 'id';

    const props = defineProps({
        chartData: {
            type: Object,
            default: () => {},
        },
    });
    let myOption = reactive({
        chart: {
            type: 'pie',
            animation: false,
            backgroundColor: 'rgba(0,0,0,0)',
            width: 340,
            height: 260,
            margin: [0, 0, 46, 0],
            // marginRight: 20,
            // marginLeft: 50,
            // marginTop: 0,
            // marginBottom: 46,
            events: {
                load: function () {
                    const each = HighCharts.each;
                    const points = this.series[0].points;
                    each(points, function (p, i) {
                        p.graphic.attr({
                            translateY: -p.shapeArgs.ran,
                        });
                        p.graphic.side1.attr({
                            translateY: -p.shapeArgs.ran,
                        });
                        p.graphic.side2.attr({
                            translateY: -p.shapeArgs.ran,
                        });
                    });
                },
            },
            options3d: {
                enabled: true,
                alpha: 65, //倾斜角度
            },
        },
        title: {
            // show: 'false',
            text: null,
        },
        // subtitle: {
        //   text: null,
        // },
        credits: {
            enabled: false,
        },
        // legend失去效果
        legend: {
            // height: 50,
            width: 380,
            // 【图例】位置样式
            itemDistance: 30,
            // enabled:false,
            itemMarginTop: 10,
            // width: 300,
            symbolRadius: 0,
            symbolHeight: 11,
            symbolWidth: 11,
            floating: true,
            layout: 'horizontal',
            // align: 'right', // 水平方向位置
            // verticalAlign: 'bottom', // 垂直方向位置
            x: 40, // 距离x轴的距离
            y: 20, // 距离Y轴的距离
            itemStyle: {
                // lineHeight: '24rem',
                fontSize: '0.12rem',
                color: 'RGBA(170, 227, 253, 1)',
            },
            itemHoverStyle: {
                color: 'RGBA(170, 227, 253, 1)',
            },
            labelFormatter: function () {
                /*
                 *  格式化函数可用的变量：this， 可以用 console.log(this) 来查看包含的详细信息
                 *  this 代表当前数据列对象，所以默认的实现是 return this.name
                 */
                return (
                    `<span style="font-size: 0.14rem;font-family: SourceHanSansCN-Regular;font-weight: 400;color: #F2F7FE;opacity: 0.87;"> ${this.name}</span> &nbsp;` +
                    `<span style="font-size: 0.14rem;font-family: SourceHanSansCN-Regular;font-weight: 400;
background: linear-gradient(0deg, #7AD4FB 0%, #FFFFFF 99.5361328125%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;">${this.y}% 详情</span>`
                );
            },
        },
        tooltip: {
            borderColor: 'rgba(39, 199, 254, 0.99)',
            backgroundColor: 'rgba(48, 157, 255, 0.6)',
            style: {
                color: '#F2FCFD',
            },
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 20,
                innerSize: 75,
                showInLegend: true, //打开legend
                center: ['53.6%', '45%'],
                size: '80%',
                events: {
                    click: (event) => {
                        // console.log(event.point.name)
                        let name = event.point.name;
                        openModal(name);
                        return false;
                    },
                },
                point: {
                    events: {
                        legendItemClick: function (event) {
                            // console.log(event.target.name)
                            let name = event.target.name;
                            openModal(name);
                            return false;
                        },
                    },
                },
                dataLabels: {
                    enabled: true,
                    // overflow: 'allow',
                    crop: false,
                    distance: 20,
                    // rotation: 5,
                    color: 'RGBA(253, 212, 141, 1)',
                    formatter: function () {
                        return (
                            `<div style="background: linear-gradient(0deg, #fbb231 0%, #ffffff 88%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;font-size: 0.1rem;font-family: SourceHanSansCN-Regular;
font-weight: 400;
">${this.point.name}</div>` +
                            '<br/>' +
                            `<span style="font-size: 0.11rem;font-family: SourceHanSansCN-Regular;
font-weight: 400;
color: #FFFFFF;">${this.point.y} %详情 </span>`
                        );
                    },
                    padding: 1,
                    connectorColor: 'rgba(255, 255, 255, 1)', //连接线颜色
                    // connectorShape: 'fixedOffset', // default
                    connectorPadding: 0,
                    // crookDistance: '70%',
                    // crop:false,
                    style: {
                        fontSize: '0.12rem',
                    },
                },
                // 显示图例
            },
            series: {
                events: {
                    legendItemClick: function () {
                        return false;
                    },
                },
            },
        },
        series: [
            {
                type: 'pie',
                name: '占比',
                // h 是高度  y是占的圆环长度
                colorByPoint: true,
                colors: [
                    'rgba(29, 174, 236, 1)',
                    'rgba(170, 82, 208, 1)',
                    'rgba(254, 216, 49, 1)',
                    'rgba(156, 209, 77, 1)',
                    'rgba(253, 106, 108, 1)',
                ],
                data: [],
            },
        ],
    });

    let option = merge({}, myOption, props.chartData);

    function openModal(name: string) {
        console.log(name);
    }
    // 创建3d饼图
    function initChart() {
        // 修改3d饼图绘制过程
        const each = HighCharts.each;
        const round = Math.round;
        const cos = Math.cos;
        const sin = Math.sin;
        const deg2rad = Math.deg2rad;
        // console.log(deg2rad);
        // debugger;

        HighCharts.wrap(HighCharts.seriesTypes.pie.prototype, 'translate', function (proceed) {
            proceed.apply(this, [].slice.call(arguments, 1));
            // Do not do this if the chart is not 3D
            // console.log(this.chart.is3d());
            if (!this.chart.is3d()) {
                return;
            }
            const series = this;
            const chart = series.chart;
            // console.log(chart.options);
            const options = chart.options;
            const seriesOptions = series.options;
            const depth = seriesOptions.depth || 0;
            const options3d = options.chart.options3d;
            const alpha = options3d.alpha;
            const beta = options3d.beta;
            var z = seriesOptions.stacking ? (seriesOptions.stack || 0) * depth : series._i * depth;
            z += depth / 2;
            if (seriesOptions.grouping !== false) {
                z = 0;
            }
            each(series.data, function (point) {
                const shapeArgs = point.shapeArgs;
                let angle;
                point.shapeType = 'arc3d';
                let ran = point.options.h;
                shapeArgs.z = z;
                shapeArgs.depth = depth * 0.75 + ran;
                shapeArgs.alpha = alpha;
                shapeArgs.beta = beta;
                shapeArgs.center = series.center;
                shapeArgs.ran = ran;
                angle = (shapeArgs.end + shapeArgs.start) / 2;
                point.slicedTranslation = {
                    translateX: round(
                        cos(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad)
                    ),
                    translateY: round(
                        sin(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad)
                    ),
                };
            });
        });
        (function (H) {
            H.wrap(HighCharts.SVGRenderer.prototype, 'arc3dPath', function (proceed) {
                // Run original proceed method
                const ret = proceed.apply(this, [].slice.call(arguments, 1));
                ret.zTop = (ret.zOut + 0.5) / 100;
                return ret;
            });
        })(HighCharts);
        // 生成不同高度的3d饼图

        // const highEcharts = ;
        // console.log(highEcharts)
        // let that = this;
        new Highchart(hchartId, option);
        // initHcharts(hchartId, option);
        // HighCharts.chart(hchartId, );
    }

    onMounted(() => {
        nextTick(() => {
            // getCharts();
            initChart();
        });
    });
</script>

<style scoped lang="less">
    .big-box {
        // position: absolute;
        width: 3.88rem;
        height: 3.3rem;
        // top: 0.33rem;
        // left: 0.1rem;
        // display: flex;
        // position: relative;
        // background-image: url('../img/dizuo.png');
    }
    .com-container {
        width: 3.88rem;
        position: absolute;
        z-index: 9;
    }
    img {
        position: relative;
        top: 15.7%;
        left: 16.8%;
        width: 2.3rem;
        height: 1.5rem;
        z-index: 0;
    }
</style>
