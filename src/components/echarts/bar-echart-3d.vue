<!-- 
 * @Descripttion: echart 3d柱状图
 * @Author: peiqf
 * @Date: 2022-07-18 14:33:49
 * @LastEditors: peiqf
 * @LastEditTime: 2023-04-12 16:58:33
-->
<template>
    <div :id="echartId" class="echart"></div>
</template>

<script setup lang="ts" name="barEchart3d">
    import { ref, reactive, watchEffect, onMounted } from 'vue';
    import { Echarts } from '@/common/class/echarts';
    // import { defaultOption } from '../../mixins/echartOption';
    // import { optionData } from '@/common/mixin/echarts.d';
    import 'echarts-gl';
    import { merge } from 'lodash';
    // props
    const props = defineProps({
        chartData: {
            type: Object, // styleData 样式表，seriesData：数据表
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
            itemWidth: 20,
            itemHeight: 12,
            icon: 'rect',
        },
    });
    // let myChart = ref(null);
    let option = reactive({});
    // 方法
    //获取3d丙图的最高扇区的高度
    const getHeight3D = (series: any, height: any) => {
        series.sort((a: any, b: any) => {
            return b.pieData.value - a.pieData.value;
        });
        return (height * 25) / series[0].pieData.value;
    };
    // 生成模拟 3D 饼图的配置项  合并配置项
    const getPie3D = (pieData: any, internalDiameterRatio: any) => {
        const series = [];
        // 总和
        let sumValue = 0;
        let startValue = 0;
        let endValue = 0;
        const legendData = [];
        const k =
            typeof internalDiameterRatio !== 'undefined'
                ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
                : 1 / 3;

        // 为每一个饼图数据，生成一个 series-surface 配置
        for (let i = 0; i < pieData.length; i += 1) {
            sumValue += pieData[i].value;

            const seriesItem = {
                name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
                type: 'surface',
                parametric: true,
                wireframe: {
                    show: false,
                },
                pieData: pieData[i],
                pieStatus: {
                    selected: false,
                    hovered: false,
                    k,
                },
            };

            if (typeof pieData[i].itemStyle !== 'undefined') {
                const { itemStyle } = pieData[i];

                // eslint-disable-next-line no-unused-expressions
                typeof pieData[i].itemStyle.color !== 'undefined'
                    ? (itemStyle.color = pieData[i].itemStyle.color)
                    : null;
                // eslint-disable-next-line no-unused-expressions
                typeof pieData[i].itemStyle.opacity !== 'undefined'
                    ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
                    : null;

                seriesItem.itemStyle = itemStyle;
            }
            series.push(seriesItem);
        }
        // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
        // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
        // console.log(series);
        for (let i = 0; i < series.length; i += 1) {
            endValue = startValue + series[i].pieData.value;

            series[i].pieData.startRatio = startValue / sumValue;
            series[i].pieData.endRatio = endValue / sumValue;
            series[i].parametricEquation = getParametricEquation(
                series[i].pieData.startRatio,
                series[i].pieData.endRatio,
                false,
                false,
                k,
                // 我这里做了一个处理，使除了第一个之外的值都是10
                series[i].pieData.value === series[0].pieData.value ? 35 : 10
            );

            startValue = endValue;

            legendData.push(series[i].name);
        }
        let boxHeight = getHeight3D(series, 15); //通过传参设定3d饼/环的高度

        // 准备待返回的配置项，把准备好的 legendData、series 传入。
        const option = {
            // animation: false,
            legend: {
                show: true,
            },
            // tooltip: {
            //     formatter: (params: any) => {
            //         if (params.seriesName !== 'mouseoutSeries') {
            //             return `${
            //                 params.seriesName
            //             }<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
            //                 params.color
            //             };"></span>${option.series[params.seriesIndex].pieData.value}`;
            //         }
            //         return '';
            //     },
            // },
            labelLine: {
                show: true,
                lineStyle: {
                    color: '#7BC0CB',
                },
            },
            label: {
                show: true,
                position: 'outside',
                formatter: '{b} \n{c} {d}%',
            },
            xAxis3D: {
                min: -1,
                max: 1,
            },
            yAxis3D: {
                min: -1,
                max: 1,
            },
            zAxis3D: {
                min: -1,
                max: 1,
            },
            grid3D: {
                show: false,
                boxHeight: boxHeight,
                top: '-15%',
                left: '-15%',
                viewControl: {
                    //3d效果可以放大、旋转等，请自己去查看官方配置
                    projection: 'perspective',
                    alpha: 35, //角度(这个很重要 调节角度的) x轴
                    beta: 60, //y轴旋转
                    distance: 250, //调整视角到主体的距离，类似调整zoom(这是整体大小)
                    rotateSensitivity: 0, //设置为0无法旋转  1
                    zoomSensitivity: 0, //设置为0无法缩放
                    panSensitivity: 0, //设置为0无法平移
                    autoRotate: false, //自动旋转
                },
                // 后处理特效可以为画面添加高光、景深、环境光遮蔽（SSAO）、调色等效果。可以让整个画面更富有质感。
                postEffect: {
                    // 配置这项会出现锯齿，请自己去查看官方配置有办法解决
                    enable: false,
                    bloom: {
                        enable: true,
                        bloomIntensity: 0.1,
                    },
                    SSAO: {
                        enable: true,
                        quality: 'medium',
                        radius: 2,
                    },
                    // temporalSuperSampling: {
                    //   enable: true,
                    // },
                },
            },
            series,
        };
        const myOptions = merge({}, myOption, option, props.chartData.styleData);
        // console.log(myOptions);
        return myOptions;
    };
    // const getPie3D1 = (pieData: any, internalDiameterRatio: any) => {
    //     let series = [];
    //     let sumValue = 0;
    //     let startValue = 0;
    //     let endValue = 0;
    //     let legendData = [];
    //     let k =
    //         typeof internalDiameterRatio !== 'undefined'
    //             ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
    //             : 1 / 3;

    //     // 为每一个饼图数据，生成一个 series-surface 配置
    //     for (let i = 0; i < pieData.length; i++) {
    //         sumValue += pieData[i].value;

    //         let seriesItem = {
    //             name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
    //             type: 'surface',
    //             parametric: true,
    //             wireframe: {
    //                 show: false,
    //             },
    //             pieData: pieData[i],
    //             pieStatus: {
    //                 selected: false,
    //                 hovered: false,
    //                 k: k,
    //             },
    //         };

    //         if (typeof pieData[i].itemStyle != 'undefined') {
    //             let itemStyle = {};

    //             typeof pieData[i].itemStyle.color != 'undefined'
    //                 ? (itemStyle.color = pieData[i].itemStyle.color)
    //                 : null;
    //             typeof pieData[i].itemStyle.opacity != 'undefined'
    //                 ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
    //                 : null;

    //             seriesItem.itemStyle = itemStyle;
    //         }
    //         series.push(seriesItem);
    //     }

    //     // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
    //     // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
    //     for (let i = 0; i < series.length; i++) {
    //         endValue = startValue + series[i].pieData.value;
    //         console.log(series[i]);
    //         series[i].pieData.startRatio = startValue / sumValue;
    //         series[i].pieData.endRatio = endValue / sumValue;
    //         series[i].parametricEquation = getParametricEquation(
    //             series[i].pieData.startRatio,
    //             series[i].pieData.endRatio,
    //             false,
    //             false,
    //             k,
    //             series[i].pieData.value
    //         );

    //         startValue = endValue;

    //         legendData.push(series[i].name);
    //     }

    //     // // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
    //     series.push({
    //         name: 'mouseoutSeries',
    //         type: 'surface',
    //         parametric: true,
    //         wireframe: {
    //             show: false,
    //         },
    //         itemStyle: {
    //             opacity: 0.1,
    //             color: '#E1E8EC',
    //         },
    //         parametricEquation: {
    //             u: {
    //                 min: 0,
    //                 max: Math.PI * 2,
    //                 step: Math.PI / 20,
    //             },
    //             v: {
    //                 min: 0,
    //                 max: Math.PI,
    //                 step: Math.PI / 20,
    //             },
    //             x: function (u, v) {
    //                 return ((Math.sin(v) * Math.sin(u) + Math.sin(u)) / Math.PI) * 2;
    //             },
    //             y: function (u, v) {
    //                 return ((Math.sin(v) * Math.cos(u) + Math.cos(u)) / Math.PI) * 2;
    //             },
    //             z: function (u, v) {
    //                 return Math.cos(v) > 0 ? -0.5 : -5;
    //             },
    //         },
    //     });

    //     // // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
    //     series.push({
    //         name: 'mouseoutSeries',
    //         type: 'surface',
    //         parametric: true,
    //         wireframe: {
    //             show: false,
    //         },
    //         itemStyle: {
    //             opacity: 0.1,
    //             color: '#E1E8EC',
    //         },
    //         parametricEquation: {
    //             u: {
    //                 min: 0,
    //                 max: Math.PI * 2,
    //                 step: Math.PI / 20,
    //             },
    //             v: {
    //                 min: 0,
    //                 max: Math.PI,
    //                 step: Math.PI / 20,
    //             },
    //             x: function (u, v) {
    //                 return ((Math.sin(v) * Math.sin(u) + Math.sin(u)) / Math.PI) * 2;
    //             },
    //             y: function (u, v) {
    //                 return ((Math.sin(v) * Math.cos(u) + Math.cos(u)) / Math.PI) * 2;
    //             },
    //             z: function (u, v) {
    //                 return Math.cos(v) > 0 ? -5 : -7;
    //             },
    //         },
    //     });
    //     series.push({
    //         name: 'mouseoutSeries',
    //         type: 'surface',
    //         parametric: true,
    //         wireframe: {
    //             show: false,
    //         },
    //         itemStyle: {
    //             opacity: 0.1,
    //             color: '#E1E8EC',
    //         },

    //         parametricEquation: {
    //             u: {
    //                 min: 0,
    //                 max: Math.PI * 2,
    //                 step: Math.PI / 20,
    //             },
    //             v: {
    //                 min: 0,
    //                 max: Math.PI,
    //                 step: Math.PI / 20,
    //             },
    //             x: function (u, v) {
    //                 return ((Math.sin(v) * Math.sin(u) + Math.sin(u)) / Math.PI) * 2.2;
    //             },
    //             y: function (u, v) {
    //                 return ((Math.sin(v) * Math.cos(u) + Math.cos(u)) / Math.PI) * 2.2;
    //             },
    //             z: function (u, v) {
    //                 return Math.cos(v) > 0 ? -7 : -7;
    //             },
    //         },
    //     });
    //     return series;
    // };
    // 生成扇形的曲面参数方程
    const getParametricEquation = (
        startRatio: any,
        endRatio: any,
        isSelected: any,
        isHovered: any,
        k: any,
        h: any
    ) => {
        // 计算
        const midRatio = (startRatio + endRatio) / 2;

        const startRadian = startRatio * Math.PI * 2;
        const endRadian = endRatio * Math.PI * 2;
        const midRadian = midRatio * Math.PI * 2;

        // 如果只有一个扇形，则不实现选中效果。
        if (startRatio === 0 && endRatio === 1) {
            // eslint-disable-next-line no-param-reassign
            isSelected = false;
        }

        // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
        // eslint-disable-next-line no-param-reassign
        k = typeof k !== 'undefined' ? k : 1 / 3;

        // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
        const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
        const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;

        // 计算高亮效果的放大比例（未高亮，则比例为 1）
        const hoverRate = isHovered ? 1.05 : 1;

        // 返回曲面参数方程
        return {
            u: {
                min: -Math.PI,
                max: Math.PI * 3,
                step: Math.PI / 32,
            },

            v: {
                min: 0,
                max: Math.PI * 2,
                step: Math.PI / 20,
            },

            x(u: any, v: any) {
                if (u < startRadian) {
                    return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                if (u > endRadian) {
                    return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
            },

            y(u: any, v: any) {
                if (u < startRadian) {
                    return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                if (u > endRadian) {
                    return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
            },

            z(u: any, v: any) {
                if (u < -Math.PI * 0.5) {
                    return Math.sin(u);
                }
                if (u > Math.PI * 2.5) {
                    return Math.sin(u) * h * 0.1;
                }
                // 当前图形的高度是Z根据h（每个value的值决定的）
                return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
            },
        };
    };
    // 设置监听事件
    const handleONEvent = () => {
        option = getPie3D(props.chartData.seriesData, 0.5);
        let selectedIndex = '';
        let hoveredIndex = '';
        // console.log(option);
        // 初始化
        let myChart = null;
        myChart = new Echarts(echartId.value, option).init();
        //  修正取消高亮失败的 bug
        // 监听 mouseover，近似实现高亮（放大）效果
        myChart.on('mouseover', function (params: any) {
            // 准备重新渲染扇形所需的参数
            let isSelected;
            let isHovered;
            let startRatio;
            let endRatio;
            let k;
            let i;
            // debugger
            // 如果触发 mouseover 的扇形当前已高亮，则不做操作
            if (hoveredIndex === params.seriesIndex) {
                return;

                // 否则进行高亮及必要的取消高亮操作
            } else {
                // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
                if (hoveredIndex !== '') {
                    // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
                    isSelected = option.series[hoveredIndex].pieStatus.selected;
                    isHovered = false;
                    startRatio = option.series[hoveredIndex].pieData.startRatio;
                    endRatio = option.series[hoveredIndex].pieData.endRatio;
                    k = option.series[hoveredIndex].pieStatus.k;
                    i =
                        option.series[hoveredIndex].pieData.value === option.series[0].pieData.value
                            ? 35
                            : 10;
                    // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
                    option.series[hoveredIndex].parametricEquation = getParametricEquation(
                        startRatio,
                        endRatio,
                        isSelected,
                        isHovered,
                        k,
                        i
                    );
                    option.series[hoveredIndex].pieStatus.hovered = isHovered;

                    // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
                    hoveredIndex = '';
                }
                // debugger
                // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
                if (params.seriesName !== 'mouseoutSeries') {
                    // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
                    isSelected = option.series[params.seriesIndex].pieStatus.selected;
                    isHovered = true;
                    startRatio = option.series[params.seriesIndex].pieData.startRatio;
                    endRatio = option.series[params.seriesIndex].pieData.endRatio;
                    k = option.series[params.seriesIndex].pieStatus.k;

                    // 对当前点击的扇形，执行高亮操作（对 option 更新）
                    option.series[params.seriesIndex].parametricEquation = getParametricEquation(
                        startRatio,
                        endRatio,
                        isSelected,
                        isHovered,
                        k,
                        option.series[params.seriesIndex].pieData.value + 5
                    );
                    option.series[params.seriesIndex].pieStatus.hovered = isHovered;

                    // 记录上次高亮的扇形对应的系列号 seriesIndex
                    hoveredIndex = params.seriesIndex;
                }

                // 使用更新后的 option，渲染图表
                // console.log(option);
                // myChart = new Echarts(echartId, option).init()
                myChart.setOption(option);
            }
        });
        // // 修正取消高亮失败的 bug
        myChart.on('globalout', function () {
            // 准备重新渲染扇形所需的参数
            let isSelected;
            let isHovered;
            let startRatio;
            let endRatio;
            let k;
            let i;
            // console.log(option);
            if (hoveredIndex !== '') {
                // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
                isSelected = option.series[hoveredIndex].pieStatus.selected;
                isHovered = false;
                k = option.series[hoveredIndex].pieStatus.k;
                startRatio = option.series[hoveredIndex].pieData.startRatio;
                endRatio = option.series[hoveredIndex].pieData.endRatio;
                // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
                i =
                    option.series[hoveredIndex].pieData.value === option.series[0].pieData.value
                        ? 35
                        : 10;
                option.series[hoveredIndex].parametricEquation = getParametricEquation(
                    startRatio,
                    endRatio,
                    isSelected,
                    isHovered,
                    k,
                    i
                );
                option.series[hoveredIndex].pieStatus.hovered = isHovered;

                // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
                hoveredIndex = '';
            }
            // 使用更新后的 option，渲染图表
            myChart.setOption(option);
        });
        myChart.on('legendselectchanged', function (params: any) {
            // console.log(params);
            return;
        });
    };
    // let options = () => merge({}, optionData, myOption, props.chartData);
    // const init = () => {
    //     nextTick(() => {
    //         new Echarts(echartId.value, options(), 0, props.isAuto).init();
    //     });
    // };
    // 监听
    watchEffect(() => {
        // options();
        // init();
    });

    onMounted(() => {
        // init();
        handleONEvent();
    });
</script>
<style scoped></style>
