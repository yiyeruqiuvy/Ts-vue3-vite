<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2022-12-21 16:56:53
 * @LastEditors: peiqf
 * @LastEditTime: 2023-04-12 17:32:00
-->
<script setup lang="ts" name="echarts">
    // import headerNav from '@/components/headerNav.vue';
    import { reactive, onMounted, onBeforeMount } from 'vue';
    import { handleDataTo4 } from '../common/mixin/mixin';
    import img from '@/assets/img/juxing.png';

    import * as echarts from 'echarts/core';
    // import infeedBarEchart from '@/components/echarts/infeed-bar-echart.vue';
    // import barEchart from '@/components/echarts/bar-echart.vue';
    // import lineChart from '@/components/echarts/line-chart.vue';
    // import lineAreaChart from '@/components/echarts/line-area-chart.vue';
    // import lineAreaEchart from '@/components/echarts/line-area-echart.vue';
    // import pieChart2d from '@/components/echarts/pie-chart-2d.vue';
    // import wordCloud from '@/components/echarts/wordCloud.vue';
    // import partPie from '@/components/echarts/partPie.vue';
    // import radarEchart from '@/components/echarts/radar-echart.vue';
    import liquidFill from '@/components/echarts/liquidfillEchart.vue';
    // const count = ref<number>(9);
    // const props = withDefaults(defineProps<{ count?: number | boolean; title?: string }>(), {
    //     count: 666,
    //     title: 'xxx',
    // });
    // 条形图数据
    const infeedBarData = reactive({
        yAxis: [
            {
                data: ['双流区', '成华区', '金牛区', '简阳市', '浦江县'],
            },
        ],
        series: [
            {
                data: [23, 34, 53, 32, 52],
            },
        ],
    });
    // 柱状图
    let barData = {
        grid: {
            top: '16%',
            left: '3%',
            right: '2%',
            bottom: '12%',
            containLabel: true,
        },
        legend: {
            top: '93%',
            left: '11%',
            data: [
                {
                    name: '需求数（个）',
                    itemStyle: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#FFFFFF',
                            },
                            {
                                offset: 0.43,
                                color: 'rgba(39,199,254,0.9900)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(48,157,255,0.1200)',
                            },
                        ]),
                        global: false, // 缺省为 false
                    },
                },
                {
                    name: '已解决需求数（个）',
                    itemStyle: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,

                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#FFFFFF',
                            },
                            {
                                offset: 0.43,
                                color: 'rgba(121,254,159,0.9900)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(0,245,87,0.1200)',
                            },
                        ]),
                        global: false, // 缺省为 false
                    },
                },
                {
                    name: '解决率（%）',
                    itemStyle: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#FFFFFF',
                            },
                            {
                                offset: 0.43,
                                color: 'rgba(254,225,121,0.9900)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(245,196,0,0.1200)',
                            },
                        ]),
                        global: false, // 缺省为 false
                    },
                },
            ],
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'none',
            },
            className: 'bar-tooltip1-box',
            formatter: function (params) {
                var htmlText = `<div class='bar-tooltip1-style'>
        <div style="text-align:left;position:relative;top:0.16rem;left:0.05rem;
        margin:0rem 0 0 0.16rem;font-size: 0.14rem;
        font-family: SourceHanSansCN-Normal;
        font-weight: 500;
        color: #F2FCFD;"> ${params[0].name} </div>
        <div style="display:flex;flex-wrap: wrap; width:1.5rem;text-align:left;
          position:relative;top:0.2rem;left:0.2rem;font-size: 0.14rem;
          font-family: SourceHanSansCN-Regular;
          font-weight: 400;color: #F2F7FE;opacity: 0.87;">
          <div style="width:1.5rem;margin:0.01rem"> 需求数：
          <span style="border: 0px solid #FCF7AF;
          box-shadow: 0rem 0rem 0rem 0rem rgba(0,0,0,0.5);color:#FCF7AF;font-family:PangMen">${params[0].data}</span>个 </div>
          <div style="width:1.5rem;margin:0.01rem"> 已解决需求数： <span style="border: 0px solid #FCF7AF;
          box-shadow: 0rem 0rem 0rem 0rem rgba(0,0,0,0.5);color:#FCF7AF;font-family:PangMen">${params[1].data}</span> 个</div>
          <div style="width:1.5rem;margin:0.01rem"> 解决率： <span style="border: 0px solid #FCF7AF;
          box-shadow: 0rem 0rem 0rem 0rem rgba(0,0,0,0.5);color:#FCF7AF;font-family:PangMen">${params[2].data}</span>%</div>
        </div>
        </div>`;
                return htmlText;
            },
        },
        xAxis: {
            data: [
                '西昌市',
                '会理市',
                '德昌县',
                '冕宁县',
                '越西县',
                '甘洛县',
                '喜德县',
                '美姑县',
                '雷波县',
                '宁南县',
                '普格县',
                '会东县',
                '盐源县',
                '木里县',
                '布拖县',
                '金阳县',
                '昭觉县',
            ],
        },
        yAxis: [
            {
                name: '个',
                // offset: 1,
                nameTextStyle: {
                    color: 'rgba(240, 252, 253, 0.7)',
                    fontSize: 12,
                    padding: [0, 10, 20, 0],
                    align: 'right',
                },
            },
            {
                name: '%',
                nameTextStyle: {
                    color: 'rgba(240, 252, 253, 0.7)',
                    padding: [0, -22, 20, 0],
                    align: 'right',
                    fontSize: 12,
                },
            },
        ],
        series: [
            {
                name: '需求数（个）',
                type: 'bar',
                barGap: '80%',

                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: '#FFFFFF',
                        },
                        {
                            offset: 0.43,
                            color: 'rgba(39,199,254,0.9900)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(48,157,255,0.1200)',
                        },
                    ]),
                    global: false, // 缺省为 false
                },
                // yAxisIndex: 1,
                barWidth: '20%',
                data: [42, 12, 2, 10, 4, 20, 22, 20, 3, 15, 57, 23, 13, 7, 10, 28, 3],
            },
            {
                name: '已解决需求数（个）',
                type: 'bar',
                barGap: '80%',
                itemStyle: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: '#FFFFFF',
                        },
                        {
                            offset: 0.43,
                            color: 'rgba(121,254,159,0.9900)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(0,245,87,0.1200)',
                        },
                    ]),
                    global: false, // 缺省为 false
                },
                // yAxisIndex: 2,
                barWidth: '20%',
                data: [6, 0, 0, 0, 2, 0, 0, 1, 0, 2, 0, 2, 0, 0, 0, 1, 0],
            },
            {
                name: '解决率（%）',
                type: 'line',
                barGap: '80%',
                itemStyle: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: '#FFFFFF',
                        },
                        {
                            offset: 0.43,
                            color: 'rgba(254,225,121,0.9900)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(245,196,0,0.1200)',
                        },
                    ]),
                    global: false, // 缺省为 false
                },
                // yAxisIndex: 3,
                barWidth: '10%',
                data: [
                    14.29, 0.0, 0.0, 0.0, 50.0, 0.0, 0.0, 5.0, 0.0, 13.33, 0.0, 8.7, 0.0, 0.0, 0.0,
                    3.57, 0.0,
                ],
            },
        ],
        dataZoom: [
            {
                show: true,
                height: 17,
                xAxisIndex: [0],
                bottom: 26,
                start: 20,
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
    };
    let bar3dData = {
        seriesData: [
            {
                name: 'cc',
                value: 47,
                itemStyle: {
                    color: '#f77b66',
                },
            },
            {
                name: 'aa',
                value: 44,
                itemStyle: {
                    color: '#3edce0',
                },
            },
            {
                name: 'bb',
                value: 32,
                itemStyle: {
                    color: '#f94e76',
                },
            },
            {
                name: 'ee',
                value: 16,
                itemStyle: {
                    color: '#018ef1',
                },
            },
            {
                name: 'dd',
                value: 23,
                itemStyle: {
                    color: '#9e60f9',
                },
            },
        ],
        styleData: {
            legend: {
                // show: true,
                top: '2%',
                left: '0',
                textStyle: {
                    color: '#F2FCFD',
                    fontSize: 12,
                },
                // align: 'left',
                orient: 'horizontal',
                padding: [6, 20],
                itemGap: 6,
                itemWidth: 20,
                itemHeight: 12,
                icon: 'rect',
            },
        },
    };
    let yHeight = [
        {
            max: 0,
            interval: 2,
        },
        {
            max: 0,
            interval: 2,
        },
    ];
    // 折线图
    const lineData = reactive({
        xAxis: {
            data: ['1', '2', '3', '4', '5'],
        },
        yAxis: { name: '条' },
        series: [
            {
                data: [22, 54, 47, 34, 88],
            },
        ],
    });
    // 区域折线图
    const lineOptions = reactive({
        // animationDelay: function (idx) {
        //     return 300;
        // },
        legend: {
            show: false,
        },
        grid: {
            left: '0%',
            right: '12%',
        },
        dataset: {
            dimensions: ['product', '分布情况'],
            source: [
                { product: '锦江区', 分布情况: 43.3 },
                { product: '武侯区', 分布情况: 83.1 },
                { product: '成华区', 分布情况: 86.4 },
                { product: '青羊区', 分布情况: 72.4 },
            ],
        },
    });
    // 区域折线图2
    const lineOptions2 = reactive({
        xAxis: {
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
        },
        series: [
            {
                data: [220, 520, 720, 520, 320, 520, 320],
            },
        ],
    });
    // 2d饼图
    const seriesData = [
        {
            name: '惩戒',
            value: 23343,
        },
        {
            name: '激励',
            value: 67903,
        },
    ];
    const calculateValue = (seriesData: any, param: any) => {
        return seriesData.filter((item: any) => item.name === param)[0].value;
    };
    const calculatePercentage = (originArray: any, seriesName: any, digit: any) => {
        let sum: number = 0;
        let seriesValue: number = 10;
        let digits = digit ? digit : 4;
        originArray.forEach((item: any) => {
            if (seriesName === item.name) {
                seriesValue = item.value;
            }
            sum += item.value;
        });
        let result = parseFloat((seriesValue / sum) * 100).toFixed(digits) + '%';
        return result;
    };
    const pieData = reactive({
        legend: {
            formatter: (param: any) => {
                let htmlStr = [
                    '{a|' + param + '：' + '}',
                    '{b|' + calculatePercentage(seriesData, param, 2) + '}' + '\xa0\xa0',
                    '{a|' + calculateValue(seriesData, param) + '}',
                ];
                return htmlStr.join('');
            },
        },
        series: [
            {
                name: '奖惩反馈类型分布',
                radius: [0, '48%'],
                center: ['30%', '50%'],
            },
            {
                name: '奖惩反馈类型分布',
                radius: ['50%', '58%'],
                center: ['30%', '50%'],
                label: {
                    position: 'center',
                    formatter: (param) => {
                        let count = 0;
                        seriesData.forEach((item) => (count = count + item.value));
                        return `{value|${count}}\n{title|奖惩反馈数}`;
                    },
                    rich: {
                        title: {
                            height: 13,
                            color: 'rgba(244, 252, 253, 0.84)',
                            fontFamily: 'SourceHanSansCN-Regular',
                            fontSize: 14,
                            fontWeight: 400,
                            lineHeight: 35,
                        },
                        value: {
                            height: 17,
                            color: '#FCF6B3',
                            fontFamily: 'PangMen',
                            fontSize: 24,
                            fontWeight: 400,
                            textShadowColor: 'rgba(251, 165, 54, 0.75)',
                            textShadowBlur: 16,
                            textShadowOffsetX: 2,
                            textShadowOffsetY: 4,
                        },
                    },
                },
                emphasis: {
                    scale: true,
                },
                data: seriesData,
                itemStyle: {
                    // 间隔
                    borderWidth: 3,
                    borderColor: '#000',
                },
            },
        ],
    });
    // 词云
    const wordCloudData = reactive({
        series: [
            {
                data: [
                    {
                        name: '咻咻领域',
                        value: 2,
                    },
                    {
                        name: 'xxxd领域',
                        value: 3,
                    },
                    {
                        name: 'iop领22域',
                        value: 5,
                    },
                    {
                        name: 'iop领212域',
                        value: 5,
                    },
                    {
                        name: 'iop32领域',
                        value: 5,
                    },
                    {
                        name: 'iop领63域',
                        value: 5,
                    },
                ],
            },
        ],
    });
    //半圆环图
    const partPie1Data = reactive({
        title: [
            {
                text: '80%',
                subtext: '及时性',
            },
        ],
        series: [
            {
                data: [, , 80 / 2],
            },
            {},
        ],
        // percent: '80%',
        // title: '及时性',
        // value: '80',
    });
    //雷达图
    const radarData = reactive({
        color: ['#00E2FF', '#FCF6B3', '#79FFCE'],
        radar: {
            axisName: {
                formatter: function (params) {
                    let newParamsName = ''; // 最终拼接成的字符串
                    let paramsNameNumber = params.length; // 实际标签的个数
                    let provideNumber = 6; // 每行能显示的字的个数
                    let rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
                    /**
                     * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                     */
                    // 条件等同于rowNumber>1
                    if (paramsNameNumber > provideNumber) {
                        /** 循环每一行,p表示行 */
                        for (let p = 0; p < rowNumber; p++) {
                            let tempStr = ''; // 表示每一次截取的字符串
                            let start = p * provideNumber; // 开始截取的位置
                            let end = start + provideNumber; // 结束截取的位置
                            // 此处特殊处理最后一行的索引值
                            if (p == rowNumber - 1) {
                                // 最后一次不换行
                                tempStr = params.substring(start, paramsNameNumber);
                            } else {
                                // 每一次拼接字符串并换行
                                tempStr = params.substring(start, end) + '\n';
                            }
                            newParamsName += tempStr; // 最终拼成的字符串
                        }
                    } else {
                        // 将旧标签的值赋给新标签
                        newParamsName = params;
                    }
                    //将最终的字符串返回
                    return newParamsName;
                },
            },
            // 角标
            indicator: [
                { name: '信用制度和基础建设', max: 100 },
                { name: '营商环境', max: 100 },
                { name: '信用监管情况', max: 100 },
                { name: '权益保护', max: 100 },
                { name: '工作落实情况', max: 100 },
            ],
        },
        series: [
            {
                type: 'radar',
                areaStyle: {
                    opacity: 0.4,
                },
                symbol: function (value, params) {
                    if (params.data.name == '平均水平') {
                        return 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAnFBMVEUAAAAA4/8A4/8A4v8A4/8A4/8A4/8A4/8A4v8A4/8A5P8A4v8A4/8A4/8A4/8A4v8A4/8A4v8A4/8A4v8A4/8A4/8A4/8A4/8A4v8A4v8A5P8A5P8A4P8A6P////8A4/9v7//u/f+b9P+K8v9E6/876v8j6P8K5f/7///4/v/0/v/F+P+49/+p9f+j9P+Q8v+B8f9n7/9U7f8S5v/n+BoHAAAAHnRSTlMA73A65bebiFQtHBEE+NvVx8S/sq2kfndpWUxCKQu/rxKGAAAAfElEQVQI12XNRRLDMABDUcUOFFJmstxgGe9/t5p2fbs/oxnByDdpshB9eN0Rrajjah+xed6KinQ95uesjJKR2Ut+L8qpKIAVtfLunAEZy5BXTgDBd8gH5+aG7dFnzTWAhLXtk2Z8MNmL2eri1XCwA2xPaQ0lArlMs22Ofz+A1g61grZvUgAAAABJRU5ErkJggg==';
                    } else if (params.data.name == '最高水平') {
                        return 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAY1BMVEUAAAD89rX797T99rX/9LP897X897T89rX99rX89rX89rT79rT99rX897T897X69LX/+bT797T997X/9bj//6r//7/////89rT9+c/897r+/OP9+MT//vj+/e7+/Of++939+taB4B6+AAAAFnRSTlMAsTp4FfXz4c7EqohuZGEwKdp5GQkIu0MfqQAAAHFJREFUCNdly0cSwzAMQ1FIci9xqkFZcbn/KSPG3Pnt/gwAdR/6p4cpHFUznfVglP2ILP8Dx/SdM2H9yT/GXCpxBAbKfFrYAT13y5UtEHhYbnSAZ7QUBgANxa5VkXMqmZZ1E/IG5WuqSku9x6514YWrH6FhColChIj6AAAAAElFTkSuQmCC';
                    } else {
                        return 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAgVBMVEUAAAB6/9B6/897/9d5/896/9B7/895/9B7/9B6/9F5/895/9N5/896/896/896/896/895/9B6/9B5/896/9B6/895/9B6/9B7/894/858/8////96/8/d//O//+mG/9SB/9J+/9HU/++d/9yL/9b4//zw//rt//jL/+26/+aU/9jn/3edAAAAG3RSTlMAvg4I1JiCYFc0HxT88+7mxbeypJKGeHdqREAAFGLiAAAAdklEQVQI12XORw7CMABE0Ukjjd7BP8Uh1PsfENlY2fB2X5rFyEuqWJNLNIc0D3UAO1rYJK7O2PZuzNCxkxQvGYzz7Cmlgpv5ebOXZrQhG6K/zKdxSybVCxpfj46rpCP9y01HtnIy6D8drMPRIgVWp0QK6rKS9wVfsw0owU0CzwAAAABJRU5ErkJggg==';
                    }
                },
                // 数据
                data: [
                    {
                        value: [90, 70, 80, 35, 66],
                        name: '平均水平',
                    },
                    {
                        value: [80, 90, 50, 35, 66],
                        name: '最高水平',
                    },
                    {
                        value: [10, 20, 40, 35, 47],
                        name: '最低水平',
                    },
                ],
            },
        ],
    });
    const radarOption = reactive({
        color: ['#00E2FF', '#FCF6B3', '#79FFCE'],
        radar: {
            center: ['50%', '50%'],
            radius: '58%',
            triggerEvent: true, //打开鼠标点击坐标轴事件
            axisName: {
                show: true,
                height: 56,
                rich: {
                    a: {
                        fontSize: 14,
                        color: '#fff',
                        align: 'center',
                        backgroundColor: {
                            image: img,
                        },
                        padding: [0, 20, 0, 20],
                        lineHeight: 35,
                        height: 35,
                    },
                    b: {
                        color: '#fff',
                        fontSize: 14,
                        padding: [0, 0, 30, 0],
                        lineHeight: 50,
                        // height: 50,
                        align: 'center',
                    },
                    c: {
                        fontSize: 14,
                        color: '#fff',
                        align: 'center',
                        padding: [0, 20, 0, 20],
                        lineHeight: 35,
                        height: 35,
                    },
                },
                formatter: function (value: any, indicator: any) {
                    return indicator.isSelecd
                        ? `{a| ${value} }` + '\n' + `{b|${indicator.maxScore}}`
                        : `{c| ${value} }` + '\n' + `{b|${indicator.maxScore}}`;
                },
            },
            indicator: [
                { name: '信用制度和基础建设（10分）', max: 100, isSelecd: true, maxScore: '222' },
                { name: '营商环境', max: 100, isSelecd: false, maxScore: '222' },
                { name: '信用监管情况', max: 100, isSelecd: false, maxScore: '222' },
                { name: '权益保护', max: 100, isSelecd: false, maxScore: '222' },
                { name: '工作落实情况', max: 100, isSelecd: false, maxScore: '222' },
            ],
        },
        series: [
            {
                type: 'radar',

                areaStyle: {
                    opacity: 0.4,
                },
                symbol: function (value: any, params: any) {
                    if (params.data.name == '平均水平') {
                        return 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAnFBMVEUAAAAA4/8A4/8A4v8A4/8A4/8A4/8A4/8A4v8A4/8A5P8A4v8A4/8A4/8A4/8A4v8A4/8A4v8A4/8A4v8A4/8A4/8A4/8A4/8A4v8A4v8A5P8A5P8A4P8A6P////8A4/9v7//u/f+b9P+K8v9E6/876v8j6P8K5f/7///4/v/0/v/F+P+49/+p9f+j9P+Q8v+B8f9n7/9U7f8S5v/n+BoHAAAAHnRSTlMA73A65bebiFQtHBEE+NvVx8S/sq2kfndpWUxCKQu/rxKGAAAAfElEQVQI12XNRRLDMABDUcUOFFJmstxgGe9/t5p2fbs/oxnByDdpshB9eN0Rrajjah+xed6KinQ95uesjJKR2Ut+L8qpKIAVtfLunAEZy5BXTgDBd8gH5+aG7dFnzTWAhLXtk2Z8MNmL2eri1XCwA2xPaQ0lArlMs22Ofz+A1g61grZvUgAAAABJRU5ErkJggg==';
                    } else if (params.data.name == '最高水平') {
                        return 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAY1BMVEUAAAD89rX797T99rX/9LP897X897T89rX99rX89rX89rT79rT99rX897T897X69LX/+bT797T997X/9bj//6r//7/////89rT9+c/897r+/OP9+MT//vj+/e7+/Of++939+taB4B6+AAAAFnRSTlMAsTp4FfXz4c7EqohuZGEwKdp5GQkIu0MfqQAAAHFJREFUCNdly0cSwzAMQ1FIci9xqkFZcbn/KSPG3Pnt/gwAdR/6p4cpHFUznfVglP2ILP8Dx/SdM2H9yT/GXCpxBAbKfFrYAT13y5UtEHhYbnSAZ7QUBgANxa5VkXMqmZZ1E/IG5WuqSku9x6514YWrH6FhColChIj6AAAAAElFTkSuQmCC';
                    } else {
                        return 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAgVBMVEUAAAB6/9B6/897/9d5/896/9B7/895/9B7/9B6/9F5/895/9N5/896/896/896/896/895/9B6/9B5/896/9B6/895/9B6/9B7/894/858/8////96/8/d//O//+mG/9SB/9J+/9HU/++d/9yL/9b4//zw//rt//jL/+26/+aU/9jn/3edAAAAG3RSTlMAvg4I1JiCYFc0HxT88+7mxbeypJKGeHdqREAAFGLiAAAAdklEQVQI12XORw7CMABE0Ukjjd7BP8Uh1PsfENlY2fB2X5rFyEuqWJNLNIc0D3UAO1rYJK7O2PZuzNCxkxQvGYzz7Cmlgpv5ebOXZrQhG6K/zKdxSybVCxpfj46rpCP9y01HtnIy6D8drMPRIgVWp0QK6rKS9wVfsw0owU0CzwAAAABJRU5ErkJggg==';
                    }
                },
                data: [
                    {
                        value: [90, 70, 80, 35, 66],
                        name: '平均水平',
                    },
                    {
                        value: [80, 90, 50, 35, 66],
                        name: '最高水平',
                    },
                    {
                        value: [10, 20, 40, 35, 47],
                        name: '最低水平',
                    },
                ],
            },
        ],
    });
    // 水球图
    const liquidFillData = reactive({
        color1: 'rgba(0, 255, 236, 1)',
        color2: 'rgba(0, 255, 236, 1)',
        label: '行政许可',
        value: 0.45,
    });
    // 方法
    // 计算柱状图Y轴的分段
    const calculationY = () => {
        // debugger;
        let max1 = handleDataTo4(Math.max(...barData.series[0].data));
        let max2 = handleDataTo4(Math.max(...barData.series[1].data, ...barData.series[2].data));
        yHeight[0].max = max1;
        yHeight[0].interval = max1 / 4;
        yHeight[1].max = max2;
        yHeight[1].interval = max2 / 4;
    };

    // 对双柱状图数据进行处理
    const initBarData = () => {
        calculationY();
        // console.log(yHeight);
        barData.yAxis[0].max = yHeight[0].max;
        barData.yAxis[0].interval = yHeight[0].interval;
        barData.yAxis[1].max = yHeight[1].max;
        barData.yAxis[1].interval = yHeight[1].interval;
    };
    const handleClick = (value: any) => {
        // console.log(value)
        radarOption.radar.indicator.map((item: any) => {
            if (item.name !== value) {
                item.isSelecd = false;
            } else item.isSelecd = true;
        });
        // title = value;
        // isSelecd = value;
        // querySecondIndexInfoByFirst(value);
    };
    onBeforeMount(() => {});
    onMounted(() => {
        initBarData();
        // console.log(infeedBarData);
    });
</script>
<template>
    <!-- <div class="count">props： {{ props.count }}</div> -->
    <div class="boxs">
        <div class="title"><h1>大屏插件-echart部分</h1></div>
        <header-nav></header-nav>
        <div class="content">
            <div class="left">
                <ul class="ul" style="list-style: none">
                    <li>条形图</li>
                    <li>柱状图</li>
                    <li>折线图-可伸缩</li>
                    <li>区域折线图</li>
                    <li>区域折线图2</li>
                    <li>2d平面饼图</li>
                    <li>半圆环图</li>
                    <li>词云</li>
                    <li>雷达图</li>
                    <li>水滴图</li>
                </ul>
            </div>
            <div class="right">
                <div class="echart-box">
                    <moduleTitle title="条形图" title-width="388" />
                    <infeedBarEchart class="echats" :chart-data="infeedBarData" />
                </div>
                <!-- <div style="color: red">
                    {{ typeof $option }} -->
                <!-- </div> -->
                <div class="echart-box">
                    <moduleTitle title="柱状图" title-width="388" />
                    <barEchart class="echats" :chart-data="barData" />
                </div>
                <div class="echart-box">
                    <moduleTitle title="折线图-可伸缩" title-width="388" />
                    <lineChart class="echats" :chart-data="lineData" />
                </div>
                <div class="echart-box">
                    <moduleTitle title="区域折线图" title-width="388" />
                    <lineAreaChart
                        class="echats"
                        chart-id="lineAreaEchart"
                        :chart-data="lineOptions"
                    ></lineAreaChart>
                </div>
                <div class="echart-box">
                    <moduleTitle title="区域折线图2" title-width="388" />
                    <lineAreaEchart class="echats" :chart-data="lineOptions2"></lineAreaEchart>
                </div>
                <div class="echart-box">
                    <moduleTitle title="2d平面饼图" title-width="388" />
                    <pieChart2d class="echats" :chart-data="pieData" />
                </div>
                <div class="echart-box">
                    <moduleTitle title="半圆环图" title-width="388" />
                    <partPie class="echats" :chart-data="partPie1Data" />
                </div>
                <div class="echart-box">
                    <moduleTitle title="词云" title-width="388" />
                    <wordCloud class="echats" :chart-data="wordCloudData" />
                </div>
                <div class="echart-box">
                    <moduleTitle title="雷达图" title-width="388" />
                    <!-- <radar-echart class="echats" :chart-data="radarData" /> -->
                    <Radar class="echats" :optionData="radarOption" :changeTwo="handleClick" />
                </div>
                <div class="echart-box">
                    <moduleTitle title="水滴图" title-width="388" />
                    <liquidFill class="echats" :chart-data="liquidFillData"></liquidFill>
                </div>
                <div class="echart-box">
                    <moduleTitle title="3d柱状图" title-width="388" />
                    <BarEchart3d class="echats" :chart-data="bar3dData" />
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
    /* @import url(); 引入css类 */
    .boxs {
        width: 19.2rem;
        // height: 10.8rem;
        height: 100%;
        background: url('@/assets/img/nomap-bg.png') no-repeat 100% 100%;
        .title {
            color: aliceblue;
            text-align: center;
            margin: 0.3rem;
        }
        .content {
            display: flex;
            color: aliceblue;
            overflow: scroll;
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
                // align-content: space-around;
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
    :deep(.bar-tooltip1-box) {
        padding: 0 !important;
        border: none !important;
        background-color: transparent !important;
        box-shadow: none !important;
        .bar-tooltip1-style {
            width: 1.76rem;
            height: 1.26rem;
            background-image: url('@/assets/img/tooltip.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            // background-size: cover;
            color: #f2fcfd;
        }
    }
</style>
