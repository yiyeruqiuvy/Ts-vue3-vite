<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2022-12-28 13:42:52
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-16 09:23:14
-->
<template>
    <div>
        <div :id="hchartId" class="td_pie_echart"></div>
    </div>
</template>
<script setup lang="ts" name="pieHchart3d2">
    import { ref, nextTick, onMounted, reactive } from 'vue';
    import highcharts from 'highcharts'; //必须引入
    // import highcharts3d from 'highcharts/highcharts-3d';
    import highcharts3d from 'highcharts/highcharts-3d';
    import highchartsMore from 'highcharts/highcharts-more'; // 扩展包
    // import { deepClone } from '@/common/mixin/mixin';
    import { merge, debounce } from 'lodash';
    import { deepClone } from '@/common/mixin/mixin';
    import { Highchart } from '@/common/class/highcharts';

    highcharts3d(highcharts);
    highchartsMore(highcharts);
    const props = defineProps({
        selectName: {
            type: String,
            default: () => {
                return '自然人';
            },
        },
        chartData: {
            type: Object,
            default: () => {
                return {};
            },
        },
        echartsBoxWidth: {
            type: Number,
            default: 360,
        },
        echartsBoxHeight: {
            type: Number,
            default: 280,
        },
    });
    let pointBasicPosition = reactive([]);
    // let pieChart = ref<any>();
    let optionData = deepClone(props.chartData);
    const hchartId = new Date().getTime() + Math.random().toString(36).substr(2) + 'id';
    let myOption = reactive({
        credits: {
            enabled: false,
        },
        title: {
            text: '',
        },
        chart: {
            type: 'pie',
            width: 380,
            height: 200,
            spacingLeft: 0,
            marginRight: 21,
            marginLeft: 21,
            marginTop: 0,
            marginBottom: 27,
            options3d: {
                enabled: true,
                alpha: 64,
            },
            backgroundColor: 'rgba(0,0,0,0)',
            events: {
                load: function () {
                    let each = highcharts.each;
                    let points = this.series[0].points;
                    // allpoints = points;
                    // 获取随机抬起
                    // let raiseIndex = Math.floor(points.length * Math.random());
                    each(points, function (p, i) {
                        // console.log(p);
                        if (p.name === props.selectName) {
                            let result = pointBasicPosition.filter(
                                (item) => item.name === p.name
                            )[0];
                            p.graphic.attr({
                                translateY:
                                    result.basicY > 0 ? -result.basicY * 3 : +result.basicY * 3,
                            });
                            p.graphic.side1.attr({
                                translateY:
                                    result.basicY > 0 ? -result.basicY * 3 : +result.basicY * 3,
                            });
                            p.graphic.side2.attr({
                                translateY:
                                    result.basicY > 0 ? -result.basicY * 3 : +result.basicY * 3,
                            });
                            p.graphic.attr({
                                translateX: result.basicX > 0 ? -result.basicX : +result.basicX,
                            });
                            p.graphic.side1.attr({
                                translateX: result.basicX > 0 ? -result.basicX : +result.basicX,
                            });
                            p.graphic.side2.attr({
                                translateX: result.basicX > 0 ? -result.basicX : +result.basicX,
                            });
                        }
                    });
                },
            },
        },
        legend: {
            itemStyle: {
                color: '#F2F7FE',
            },
            itemHoverStyle: {
                color: '#F2F7FE',
            },
            layout: 'horizontal',
            itemMarginTop: 50,
            itemDistance: 40, //项之间的距离
            symbolRadius: 0,
            align: 'center', //水平方向位置
            y: 12, //距离Y轴的距离
        },
        tooltip: {
            enabled: false,
            borderColor: 'rgba(39, 199, 254, 0.99)',
            backgroundColor: 'rgba(48, 157, 255, 0.6)',
            style: {
                color: '#F2FCFD',
            },
        },
        plotOptions: {
            pie: {
                size: '120%', // 外圈直径大小
                allowPointSelect: false,
                cursor: 'pointer',
                depth: 26,
                colors: [
                    '#FFBA00',
                    {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                            [0, '#00A8FF'],
                            [1, '#8FDFFE'],
                        ],
                    },
                ],
                states: {
                    inactive: {
                        opacity: 1,
                    },
                },
                dataLabels: {
                    enabled: true,
                    distance: 18,
                    color: '#FBB231',
                    formatter: function () {
                        let p = ((this.y / this.total) * 100).toFixed(1) + '%';
                        return this.point.isNull
                            ? void 0
                            : this.point.name + '<br/>' + formatNum(this.y) + '条' + ' ' + p;
                    },
                    connectorColor: '#FFFFFF', //连接线颜色
                },
                showInLegend: true,
                point: {
                    events: {
                        mouseOver: function () {
                            let result = pointBasicPosition.filter(
                                (item) => this.name === item.name
                            )[0];
                            this.update({
                                sliced: true,
                                selected: true,
                            });
                            this.graphic.attr({
                                translateY:
                                    result.basicY > 0 ? -result.basicY * 3 : +result.basicY * 3,
                            });
                            this.graphic.side1.attr({
                                translateY:
                                    result.basicY > 0 ? -result.basicY * 3 : +result.basicY * 3,
                            });
                            this.graphic.side2.attr({
                                translateY:
                                    result.basicY > 0 ? -result.basicY * 3 : +result.basicY * 3,
                            });
                            this.graphic.attr({
                                translateX: result.basicX > 0 ? -result.basicX : +result.basicX,
                            });
                            this.graphic.side1.attr({
                                translateX: result.basicX > 0 ? -result.basicX : +result.basicX,
                            });
                            this.graphic.side2.attr({
                                translateX: result.basicX > 0 ? -result.basicX : +result.basicX,
                            });
                        },
                    },
                },
            },
        },
        series: [
            {
                type: 'pie',
                name: '疫情失信名单记录',
                data: [],
            },
        ],
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 388,
                        maxHeight: 180,
                    },
                    chartOptions: {
                        credits: {
                            enabled: false,
                        },
                        title: {
                            text: '',
                        },
                        legend: {
                            itemStyle: {
                                color: '#F2F7FE',
                            },
                            layout: 'horizontal',
                            itemMarginTop: 50,
                            itemDistance: 40, //项之间的距离
                            symbolRadius: 0,
                            align: 'center', //水平方向位置
                            // x: -72, //距离x轴的距离
                            y: 12, //距离Y轴的距离
                        },
                        toolTip: {
                            show: false,
                        },
                    },
                },
            ],
        },
    });
    // 格式化数字
    function formatNum(num: any) {
        // (\+|-)? 表示 正负号； (\d+) 表示整数部分； (\.\d+)? 表示小数部分
        if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(num)) {
            // 不满足规则说明传递来的数据不是一个正常数字的格式
            return num;
        }

        // 上面已经执行了test，所以这里的a、b、c已经是能够获得值的了，分别是正负号、整数部分、小数部分。
        let a = RegExp.$1,
            b = RegExp.$2,
            c = RegExp.$3;

        // 用来匹配出整数部分 首次出现连续四个数字加一个逗号 或者 结尾连续四个数字 的形式；
        let re = /(\d)(\d{3})(,|$)/;

        // 从左往右匹配 当遇到第一个逗号就停止，或者没有逗号一直到结尾停止。这样拿到逗号（结尾）前四个数字
        while (re.test(b)) {
            // 将匹配成功的四个数字，替换成一个数字加逗号加三个数字的形式
            // $1 表示正则表达式中的第一个子表达式，也就是 (\d) ，它表示匹配到的四个数字中的第一个数字
            // $2 也就是 (\d{3}) ， 表示匹配到的 后面三个数字
            // $3 也就是 (,|$) ， 表示匹配到的四个数字后面的 逗号或者空（结尾就是空）
            // replace方法是不影响原字符串的，它返回一个替换好的新字符串，所以这里要将替换好的覆盖原来的
            b = b.replace(re, '$1,$2$3');

            // 由于re不是全局的正则表达式（ 没有加参数g ），所以每次循环替换首次匹配成功的一处
            // 也就是 每次循环 拿到 整数部分第一个逗号往前数的 四个数字
            // 然后 将拿到的四个数字中 在第一个数字与后三个数字之间加上逗号
            // 直到整数部分从左往右 匹配不到 连续四个数字加逗号 的形式，循环结束
        }

        // 拼接原来的正负号、已分隔好的整数部分、原来的小数部分
        return a + '' + b + '' + c;
    }
    function handleData() {
        let quantity = 0; // 总数

        optionData.series[0].data.forEach((item: any) => {
            quantity += item.y;
        });
        optionData.series[0].data.forEach((item: any) => {
            item.bfb = parseInt((item.y / quantity) * 100);
            item.h = 6;
        });
    }
    let option = () => {
        handleData();
        return merge({}, myOption, optionData);
    };

    // 初始化饼图
    function initTdPieEchart() {
        // let that = this;
        pointBasicPosition.splice(0, pointBasicPosition.length);
        // let allpoints = null;

        // 修改3d饼图绘制过程
        let each = highcharts.each,
            round = Math.round,
            cos = Math.cos,
            sin = Math.sin,
            deg2rad = highcharts.deg2rad;
        highcharts.wrap(highcharts.seriesTypes.pie.prototype, 'translate', function (proceed) {
            proceed.apply(this, [].slice.call(arguments, 1));
            // Do not do this if the chart is not 3D
            if (!this.chart.is3d()) {
                return;
            }
            let series = this,
                chart = series.chart,
                options = chart.options,
                seriesOptions = series.options,
                depth = seriesOptions.depth || 0,
                options3d = options.chart.options3d,
                alpha = options3d.alpha,
                beta = options3d.beta,
                z = seriesOptions.stacking ? (seriesOptions.stack || 0) * depth : series._i * depth;
            z += depth / 2;
            if (seriesOptions.grouping !== false) {
                z = 0;
            }
            each(series.data, function (point) {
                let shapeArgs = point.shapeArgs,
                    angle;
                point.shapeType = 'arc3d';
                let ran = point.options.h;
                shapeArgs.z = z;
                shapeArgs.depth = depth * 0.75 + ran;
                shapeArgs.alpha = alpha;
                shapeArgs.beta = beta;
                shapeArgs.center = series.center;
                shapeArgs.ran = ran;
                angle = (shapeArgs.end + shapeArgs.start) / 2;
                pointBasicPosition.push({
                    name: point.name,
                    basicX: cos(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad),
                    basicY: sin(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad),
                });
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
            H.wrap(highcharts.SVGRenderer.prototype, 'arc3dPath', function (proceed) {
                let ret = proceed.apply(this, [].slice.call(arguments, 1));
                ret.zTop = (ret.zOut + 0.5) / 100;
                return ret;
            });
        })(highcharts);
        new Highchart(hchartId, option());
        // initHcharts(hchartId, option());

        //  highcharts.chart(hchartId, option());
    }
    // 设置图尺寸
    function setPreviewSize() {
        nextTick(function () {
            const box = document.getElementsByClassName('td_pie_echart')[0];
            box.style.width = props.echartsBoxWidth / 100 + 'rem';
            box.style.height = props.echartsBoxHeight / 100 + 'rem';
            initTdPieEchart();
        });
    }
    onMounted(() => {
        setPreviewSize();
        window.addEventListener('resize', function () {
            debounce((myChart) => {
                // 引入debounce，防止频繁更改浏览页尺寸出现页面抖动
                if (myChart) {
                    myChart.resize();
                }
            }, 100);
        });
    });
</script>

<style lang="less">
    .td_pie_echart {
        width: 3.6rem;
        height: 2.8rem;
        color: red;
    }
</style>
