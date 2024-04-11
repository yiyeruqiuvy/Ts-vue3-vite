<!--
 * @Descripttion: highcharts
 * @Author: peiqf
 * @Date: 2022-09-19 09:51:17
 * @LastEditors: peiqf
 * @LastEditTime: 2023-01-04 10:26:33
-->

<script setup lang="ts" name="highCharts3d">
    import { onMounted, reactive } from 'vue';
    // import headerNav from '@/components/headerNav.vue';

    // import moduleTitle from '@/components/moduleTitle.vue';
    // import pieHchart1 from '@/components/highCharts3d/pieHchart1.vue';
    // import pieHchart2 from '@/components/highCharts3d/pieHchart2.vue';
    // import pieHchart3 from '@/components/highCharts3d/pieHchart3.vue';

    // import highChart2 from '@/components/highCharts3d/highChart/highChart2.vue';
    // import highChart3 from '@/components/highCharts3d/highChart/highChart3.vue';
    // import highChart4 from '@/components/highCharts3d/highChart/highChart4.vue';
    // import highChart5 from '@/components/highCharts3d/highChart/highChart5.vue';
    // const list = () => {
    // 饼图1数据
    let pieData = reactive({
        series: [
            {
                data: [
                    { name: '5种及以上', y: 36, h: 18 },
                    { name: '4种', y: 20, h: 10 },
                    { name: '3种', y: 16, h: 8 },
                    { name: '2种', y: 10, h: 5 },
                    { name: '1种及以下', y: 9, h: 4.5 },
                ],
            },
        ],
    });
    // 饼图2数据
    let pieData2 = reactive({
        series: [
            {
                data: [
                    {
                        key: 'legalPerson',
                        name: '法人',
                        y: 99,
                        color: '#FFBA00',
                        h: 6,
                        bfb: 79,
                        total: 125,
                        // selected: true,
                        // sliced: true,
                    },
                    {
                        key: 'naturalPerson',
                        name: '自然人',
                        y: 26,
                        color: {
                            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                            stops: [
                                [0, '#00A8FF'],
                                [1, '#8FDFFE'],
                            ],
                        },
                        selected: true,
                        sliced: true,
                        h: 6,
                        bfb: 20,
                        total: 125,
                    },
                ],
            },
        ],
    });
    // };
    // 饼图3数据
    let pieData3 = reactive({
        title: {
            text: undefined,
        },
        plotOptions: {
            pie: {
                colors: ['#40A6FF', '#FFED93'],
            },
        },
        series: [
            {
                data: [
                    {
                        name: '应用模型',
                        y: 5,
                        h: 0.5,
                        sum: 8,
                    },
                    {
                        name: '分析模型',
                        y: 3,
                        h: 0.5,
                        sum: 8,
                    },
                ],
            },
        ],
    });
    onMounted(() => {
        // console.log(infeedBarData);
    });
</script>
<template>
    <div class="boxs">
        <div class="title"><h1>大屏插件-3d饼图</h1></div>
        <header-nav></header-nav>

        <div class="content">
            <div class="left">
                <ul class="ul" style="list-style: none">
                    <li>3d环图1</li>
                    <li>3d环图2</li>
                    <li>3d实心饼图1（hover）</li>
                    <li>3d实心饼图2（点击）</li>
                    <li>3d实心饼图3（效果比较好，有bug）</li>
                </ul>
            </div>
            <div class="right">
                <div class="echart-box">
                    <moduleTitle title="3d环图" title-width="388" />
                    <pieHchart1 :chart-data="pieData" class="echats" />
                </div>
                <div class="echart-box">
                    <moduleTitle title="3d饼图" title-width="388" />
                    <pieHchart2
                        :chart-data="pieData2"
                        :select-name="pieData2.series[0].data[1].name"
                    ></pieHchart2>
                </div>
                <div class="echart-box">
                    <moduleTitle title="3d空心饼图-上下浮动" title-width="388" />
                    <pieHchart3 :chart-data="pieData3"></pieHchart3>
                </div>
                <!-- <div>
                    <moduleTitle title="3d实心饼图1（hover）" title-width="388" />
                    <highChart3 class="echats" :chart-data="highChartData3"></highChart3>
                </div> -->
                <!-- <div>
                    <moduleTitle title="3d实心饼图2（点击）" title-width="388" />
                    <highChart4 class="echats" :chart-data="highChartData4" />
                </div> -->
                <!-- <div>
                    <moduleTitle title="3d实心饼图3（效果比较好，有bug）" title-width="388" />
                    <highChart5
                        class="echats"
                        :is-show-bg="true"
                        :is-show-tooltip="true"
                        :chart-data="highChartData5.ratioPie"
                    />
                </div> -->
            </div>
        </div>
    </div>
</template>

<!-- <script>
    import moduleTitle from '@/components/moduleTitle.vue';
    import highChart1 from '@/components/highCharts3d/highChart/highChart1.vue';
    import highChart2 from '@/components/highCharts3d/highChart/highChart2.vue';
    import highChart3 from '@/components/highCharts3d/highChart/highChart3.vue';
    import highChart4 from '@/components/highCharts3d/highChart/highChart4.vue';
    import highChart5 from '@/components/highCharts3d/highChart/highChart5.vue';

    export default {
        name: 'HighCharts3d',
        components: {
            moduleTitle,
            highChart1,
            highChart2,
            highChart3,
            highChart4,
            highChart5,
        },
        data() {
            return {
                // 3d饼图1
                highChartData1: {
                    legalCreditRecordNum: 232,
                    legalCreditRecordNumProportion: 20,
                    naturalCreditRecordNum: 1231,
                    naturalCreditRecordNumProportion: 78,
                },
                // 3d饼图2
                highChartData2: [
                    { name: '5种及以上', y: 36, h: 18 },
                    { name: '4种', y: 20, h: 10 },
                    { name: '3种', y: 16, h: 8 },
                    { name: '2种', y: 10, h: 5 },
                    { name: '1种及以下', y: 9, h: 4.5 },
                ],
                // 3d实心饼图1
                highChartData3: [
                    {
                        key: 'legalPerson',
                        name: '法人',
                        y: 10,
                        color: '#FFBA00',
                        total: 200,
                        h: 21,
                    },
                    {
                        key: 'naturalPerson',
                        name: '自然人',
                        y: 190,
                        color: {
                            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                            stops: [
                                [0, '#00A8FF'],
                                [1, '#8FDFFE'],
                            ],
                        },
                        total: 200,
                        h: 21,
                    },
                ],
                // 3d实心饼图2
                highChartData4: [
                    {
                        key: 'legalPerson',
                        name: '完全践诺',
                        y: 20,
                        color: '#FFBA00',
                        sliced: true,
                        selected: true,
                        // total: 200,
                        // h: 21,
                    },
                    {
                        key: 'naturalPerson',
                        name: '未完全践诺',
                        y: 80,
                        color: {
                            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                            stops: [
                                [0, '#00A8FF'],
                                [1, '#8FDFFE'],
                            ],
                        },
                        // total: 200,
                        // h: 21,
                    },
                ],
                //3d实心饼图3
                highChartData5: {
                    creditrecordnum: 0,
                    ratioPie: {
                        tooltip: {
                            enabled: false,
                        },
                        legend: {
                            layout: 'horizontal',
                            align: 'bottom',
                            x: 110,
                            y: -25,
                            itemDistance: 50,
                            itemStyle: {
                                color: '#F2F7FE',
                            },
                            itemHoverStyle: {
                                fontSize: '0.12rem',
                                color: '#F2F7FE',
                            },
                            itemMarginTop: 15,
                            symbolRadius: 0,
                            labelFormatter: function () {
                                return this.name;
                            },
                        },
                        chart: {
                            spacingTop: -50,
                            marginLeft: 0,
                            marginRight: 0,
                            marginTop: 30,
                            marginBottom: 60,
                            height: 290,
                            options3d: {
                                enabled: true,
                                alpha: 65,
                                // beta: 0,
                            },
                            animation: true,
                            events: {},
                        },
                        series: [
                            {
                                data: [
                                    {
                                        rate: '20%',
                                        y: 5,
                                        name: 'a型承诺',
                                    },
                                    {
                                        rate: '20%',
                                        y: 5,
                                        name: 'b型承诺',
                                    },
                                ],
                            },
                        ],
                        plotOptions: {
                            pie: {
                                innerSize: 0,
                                size: 180,
                                depth: 30,
                                allowPointSelect: true,
                                cursor: 'pointer',
                                colors: ['rgba(60, 191, 254, 1)', 'rgba(255, 186, 0, 1)'],
                                dataLabels: {},
                                slicedOffset: 30,
                                states: {
                                    hover: {
                                        enabled: false,
                                    },
                                    inactive: {
                                        opacity: 1,
                                    },
                                },
                                point: {},
                            },
                        },
                    },
                },
            };
        },
        created() {},
        mounted() {
            // console.log('xxxx')
            // setTimeout(() => {
            this.xx();
            // 修改点击和移动方法
            this.highChartData5.ratioPie.plotOptions.pie.point.events = {
                mouseOver: function (e) {
                    if (!e.target.sliced) {
                        this.slice();
                    }

                    e.target.graphic.attr({
                        translateY: -15,
                    });
                },
                mouseOut: function (e) {
                    if (e.target.sliced) {
                        this.slice();
                    }
                    e.target.graphic.attr({
                        translateY: 0,
                    });
                },
                // 默认是点击突出，这里屏蔽掉
                click: function () {
                    // this.slice();
                    return false;
                },
                // legendItemClick: function (e) {

                //   return false
                // },
            };
            // }, 1000)
        },
        methods: {
            xx() {
                this.highChartData5.creditrecordnum = 999;
                this.highChartData5.ratioPie.series[0].data = [];
                this.highChartData5.ratioPie.series[0].data = [
                    {
                        y: 30,
                        rate: '30%s',
                        h: 0.5,
                        sliced: true,
                        selected: true,
                        name: '法人',
                    },
                    {
                        y: 70,
                        rate: '70%',
                        h: 0.5,
                        // sliced: true,
                        name: '自然人',
                    },
                ];
                let that = this;
                this.highChartData5.ratioPie.plotOptions.pie.dataLabels = {
                    enabled: true, // 显示连线
                    padding: 0,

                    distance: '6%', //连线长度
                    formatter: function () {
                        //this 为当前的点（扇区）对象，可以通过  console.log(this) 来查看详细信息
                        return (
                            '<div style="font-size: 0.16rem;font-family: SourceHanSansCN-Regular;"> ' +
                            that.numToChangeUnit(this.y) +
                            '条</div><br/><div style="font-size: 0.14rem;color:#FBB231;font-family: SourceHanSansCN-Regular;font-weight: bold;">' +
                            this.point.options.rate +
                            '</div>'
                        );
                    },
                    style: {
                        // 标题样式设置
                        color: '#FFFFFF', //字体颜色
                        fontSize: '12px', //字体大小
                        fontWeight: '400', // 字体粗细
                        textOutline: 'none', // 去除黑色阴影
                    },
                };
            },
            numToChangeUnit(num) {
                if (num) {
                    return `${this.toFixed(Number(num) / 10000, 2)}万`;
                } else {
                    return 0 + '万';
                }
            },
            // 不进位，decimal保留小数位数
            toFixed(num, decimal) {
                num = num.toString();
                let index = num.indexOf('.');
                if (index !== -1) {
                    num = num.substring(0, decimal + index + 1);

                    let arr = num.toString().split('.')[0].split('').reverse();
                    arr.map((item, index) => {
                        if (index % 3 === 0 && index !== 0) {
                            arr.splice(index, 0, ',');
                        }
                    });
                    return `${arr.reverse().join('')}.${num.toString().split('.')[1]}`;
                } else {
                    num = num.substring(0);
                    let arr = num.toString().split('').reverse();
                    arr.map((item, index) => {
                        if (index % 3 === 0 && index !== 0) {
                            arr.splice(index, 0, ',');
                        }
                    });
                    return `${arr.reverse().join('')}.00`;
                }
            },
        },
    };
</script> -->

<style lang="less" scoped>
    /* @import url(); 引入css类 */
    .boxs {
        width: 19.2rem;
        height: 10.8rem;
        background: url('@/assets/img/nomap-bg.png') no-repeat 100% 100%;
        .title {
            color: aliceblue;
            text-align: center;
            margin: 0.5rem;
        }
        .content {
            display: flex;
            color: aliceblue;
            .left {
                margin-left: 0.5rem;
                flex: 1;
                .ul {
                    li {
                        padding: 0.15rem;
                    }
                }
            }
            .right {
                flex: 9;
                display: flex;
                flex-wrap: wrap;
                .echart-box {
                    margin-left: 0.3rem;
                    .echats {
                        width: 3.88rem;
                        height: 2.9rem;
                    }
                }
            }
        }
    }
</style>
