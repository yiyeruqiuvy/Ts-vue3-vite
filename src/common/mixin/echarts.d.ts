/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2022-12-23 16:06:53
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-26 10:48:59
 */
const optionData = {
    // grid: {
    //     left: '6%',
    //     right: '15%',
    //     bottom: '13%',
    //     top: '3%',
    //     // containLabel: true,
    // },
    tooltip: {
        trigger: 'axis',
        borderColor: 'rgba(39, 199, 254, 0.99)',
        backgroundColor: 'rgba(48, 157, 255, 0.6)',
        textStyle: {
            color: '#F2FCFD',
        },
    },
    // xAxis: {
    //     show: true,
    //     type: 'value',
    //     axisLine: {
    //         show: false,
    //     },
    //     axisTick: {
    //         show: false,
    //     },
    //     axisLabel: {
    //         show: false,
    //         color: '#F2F7FE',
    //     },
    //     splitLine: {
    //         show: true,
    //         lineStyle: {
    //             color: 'rgba(240, 252, 253, 0.1)',
    //             type: 'dashed',
    //         },
    //     },
    // },
    // yAxis: [
    //     {
    //         type: 'category',
    //         inverse: true,
    //         // offset: 13,
    //         axisLabel: {
    //             show: true,
    //             // margin: 12.5,
    //             // textStyle: {
    //             color: 'rgba(242, 247, 254, 0.67)',
    //             fontSize: '14',
    //             // },
    //         },
    //         splitLine: {
    //             show: false,
    //         },
    //         axisTick: {
    //             show: false,
    //         },
    //         axisLine: {
    //             show: true,
    //             onZero: false,
    //             lineStyle: {
    //                 color: '#6DF3FE',
    //                 opacity: 0.5,
    //             },
    //         },
    //         // data: ['sas', 'sas', '213s'],
    //     },
    // ],
    animationDelay: function (idx: any) {
        // 越往后的数据延迟越大
        // console.log(_time)
        // if (_time === 1) {
        return idx * 10 + 500;
        // } else return idx * 10;
    },
};

export { optionData };
