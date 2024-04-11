<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2022-09-19 09:51:17
 * @LastEditors: peiqf
 * @LastEditTime: 2023-01-03 14:43:15
-->
<template>
    <div class="boxs">
        <div class="title"><h1>大屏插件-其他常用组件</h1></div>
        <header-nav></header-nav>
        <div class="content">
            <div class="left">
                <ul class="ul" style="list-style: none">
                    <!-- <li>排行-无缝滚动</li> -->
                    <li>切换按钮组件</li>
                    <li>排行-轮播切换</li>
                    <li>
                        排行-轮播切换-动效
                        <ul>
                            <li>切换tab</li>
                            <li>显示相关数据</li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div class="right">
                <!-- 切换按钮 -->
                <div class="echats">
                    <moduleTitle title="切换按钮" title-width="388" />
                    <tabs-button :tabs-group="tabsGroup0"></tabs-button>
                </div>
                <!-- 无缝滚动表格 -->
                <div class="echats">
                    <moduleTitle title="无缝滚动表格" title-width="388" />
                    <scrollRanking
                        :table-data="tableData1"
                        :scroll-width="388"
                        :scroll-height="260"
                    />
                </div>
                <!-- 轮播表格-带切换 -->
                <div class="echats">
                    <moduleTitle title="切换表格" title-width="388" />
                    <tabs-button
                        style="margin: 0.1rem 0 0 0"
                        :tabs-group="tabsGroup1"
                        @changeBtn="changeBtn1"
                    ></tabs-button>

                    <swiper-ranking
                        :carousel-data="
                            carouselOption.data.idx === 0
                                ? carouselOption.data.data1
                                : carouselOption.data.data2
                        "
                        :carousel-option="carouselOption"
                        carousel-width="3.88rem"
                        swiper-id="swiperId1"
                        pag-size="5"
                        :carousel-idx="carouselOption.data.idx"
                        :top="3"
                        even-bg-color=" #06223d"
                        odd-bg-color="#092946"
                    />
                </div>
                <!-- 动效数字组件-->
                <div class="echats">
                    <moduleTitle title="动效数字" title-width="388" />
                    <single-number :end-val="12345678" :decimals="0" :delay="1200"></single-number>
                    <name-number
                        :count-info="countInfo"
                        :overall-situation="overallSituation"
                    ></name-number>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="other">
    import { reactive, onMounted } from 'vue';
    // import headerNav from '@/components/headerNav.vue';
    // import moduleTitle from '@/components/moduleTitle.vue';
    // import tabsButton from '@/components/other/tabsButton.vue';
    // import swiperRanking from '@/components/other/swiper-ranking.vue';
    // import scrollRanking from '@/components/other/scroll-ranking.vue';

    // import scrollTable from '@/components/other/scroll-table.vue'
    // import carouselRanking from '@/components/other/carousel-ranking.vue';
    // import swiperRanking from '@/components/other/swiper-ranking.vue';
    // import number from '@/components/other/number.vue';
    // import nameAndNumber from '@/components/other/nameAndNumber.vue';
    let tabsGroup0 = reactive({
        tabs: [
            { label: '按钮1', value: 'punish' },
            { label: '按钮2', value: 'reward' },
        ],
        currentTab: 0, //切换按钮的下标
    });
    let tabsGroup1 = reactive({
        tabs: [
            { label: '表格1', value: 'table1' },
            { label: '表格2', value: 'table2' },
        ],
        currentTab: 0, //切换按钮的下标
    });
    // 无缝滚动表格数据
    let tableData1 = reactive({
        tableHead: ['标题1', 'xx2', 'xx3'],
        buildField: ['row1', 'row2', 'row2'],
        tableData: [
            { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
            { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
            { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
            { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
            { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
            { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
            { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
            { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
            { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
        ],
    });
    // 轮播表格数据  基于swiper8+vue3
    let carouselOption = reactive({
        // 表头配置
        carouselHead: [
            { label: '排名', width: '10%' },
            { label: '区（市）县', width: '30%' },
            { label: '企业主体数量', width: '30%' },
            { label: '优质主体数量', width: '30%' },
        ],
        // 表头配置类型
        HeadType: ['row1', 'row2', 'row3', 'row4'],
        // 表头配置
        headStyle: {
            // 宽度
            carouselWidth: '3.88rem',
            // 表格表头高度
            headHeight: '0.3rem',
            // 表格数据高度 高度与pagSize相对应
            carouselHeight: '2.25rem',
        },
        // 表格轮播的时间
        delay: 3000,
        // 一页的行数
        pagSize: 5,
        // 开始的几个有高亮色
        top: 3,
        data: {
            data1: [
                {
                    row1: '1',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '2',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '3',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '4',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '5',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '6',
                    row2: '市法院',
                    row3: 1,
                    row4: 11,
                },
                {
                    row1: '7',
                    row2: '市法院',
                    row3: 1,
                    row4: 22,
                },
                {
                    row1: '8',
                    row2: '市法院',
                    row3: 1,
                    row4: 22,
                },
                {
                    row1: '9',
                    row2: '市法院',
                    row3: 1,
                    row4: 22,
                },
                // {
                //     row1: '10',
                //     row2: '市法院',
                //     row3: 1,
                //     row4: 22,
                // },
                // {
                //     row1: '11',
                //     row2: '市法院',
                //     row3: 1,
                //     row4: 22,
                // },
            ],
            data2: [
                {
                    row1: '21',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '21',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '21',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '21',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '21',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '21',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '21',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '99',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '21',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '99',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '99',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '99',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
                {
                    row1: '99',
                    row2: '市法院',
                    row3: 1,
                    row4: 32,
                },
            ],
            // 控制数据切换
            idx: 0,
        },
    });
    // 切换按钮回调方法
    const changeBtn1 = (data: Number) => {
        // 切换表格的数据
        carouselOption.data.idx = data;
        // console.log(data);
    };

    //
    let countInfo = reactive([
        {
            name: '信用记录总数',
            label: 'legalCreditRecordNum',
            value: 2737256,
            unit: '条',
        },
        {
            name: '信用主体总数',
            label: 'legalCreditRecordNumProportion',
            value: 66276472,
            unit: '个',
        },
    ]);
    let overallSituation = reactive({
        legalCreditRecordNum: 1,
        legalCreditRecordNumProportion: 1,
        naturalCreditRecordNum: 1,
        naturalCreditRecordNumProportion: 1,
    });
    // export default {
    //     name: 'Other',
    //     components: {
    //         moduleTitle,
    //         // scrollTable,
    //         scrollRanking,
    //         carouselRanking,
    //         tabsButton,
    //         swiperRanking,
    //         number,
    //         nameAndNumber,
    //     },
    //     data() {
    //         return {
    //             // 切换tab数据
    //             tabsGroup0: {
    //                 tabs1: [
    //                     { label: '按钮1', value: 'punish' },
    //                     { label: '按钮2', value: 'reward' },
    //                 ],
    //                 activeIdx: 0, //切换按钮的下标
    //             },
    //             tabsGroup1: {
    //                 tabs1: [
    //                     { label: '按钮1', value: 'punish' },
    //                     { label: '按钮2', value: 'reward' },
    //                 ],
    //                 activeIdx: 0, //切换按钮的下标
    //             },
    //             buttonStatus: 0,
    //             tabsGroup2: {
    //                 tabs1: [
    //                     { label: '失信惩戒', value: 'punish' },
    //                     { label: '守信激励', value: 'reward' },
    //                 ],
    //                 activeIdx: 0, //切换按钮的下标
    //             },

    //             // 切换按钮2状态
    //             activeUnion: 'punish',
    //             // 排行组件数据
    //             rewardsCountInfo: {
    //                 punish: [
    //                     { deptName: '市法院', objNumber: 1, dealNumber: 32 },
    //                     { deptName: '市住建局', objNumber: 3, dealNumber: 25 },
    //                     { deptName: '市应急局', objNumber: 2, dealNumber: 19 },
    //                     { deptName: '市税务局', objNumber: 1, dealNumber: 13 },
    //                     { deptName: '市市场监管局', objNumber: 5, dealNumber: 27 },
    //                     { deptName: '市人社局', objNumber: 1, dealNumber: 8 },
    //                     { deptName: '市人社局', objNumber: 1, dealNumber: 8 },
    //                     { deptName: '市人社局', objNumber: 1, dealNumber: 8 },
    //                     { deptName: '市人社局', objNumber: 1, dealNumber: 8 },
    //                     { deptName: '市人社局', objNumber: 1, dealNumber: 8 },
    //                     { deptName: '市人社局', objNumber: 1, dealNumber: 8 },
    //                 ],
    //                 reward: [
    //                     { deptName: '市团委', objNumber: 1, dealNumber: 19 },
    //                     { deptName: '市税务局', objNumber: 1, dealNumber: 15 },
    //                     { deptName: '市民政局', objNumber: 3, dealNumber: 18 },
    //                     { deptName: '市应急局', objNumber: 1, dealNumber: 22 },
    //                     { deptName: '成都海关', objNumber: 1, dealNumber: 21 },
    //                 ],
    //             },
    //             // activeDepart: 'punish',
    //             social: {
    //                 zhiye_column: [
    //                     {
    //                         name: '姓名',
    //                         dataIndex: 'zd06001',
    //                     },
    //                     {
    //                         name: '身份证号码',
    //                         dataIndex: 'zd06002',
    //                     },
    //                     {
    //                         name: '执业机构名称',
    //                         dataIndex: 'zd06003',
    //                     },
    //                     {
    //                         name: '执业类别',
    //                         dataIndex: 'zd06004',
    //                     },
    //                 ],
    //                 data: {},
    //             },
    //             tableHead: ['xx1', 'xx2', 'xx3'],
    //             tableData: [
    //                 { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
    //                 { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
    //                 { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
    //                 { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
    //                 { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
    //                 { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
    //                 { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
    //                 { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
    //                 { row1: 'xx1', row2: 'xx2', row3: 'xx3' },
    //             ],
    //             // 无动效排行组件数据
    //             carouselHead: ['排名', '区县', '111'],
    //             swiperData: {
    //                 coverOrPromise: 0,
    //                 swiperData1: [
    //                     {
    //                         row1: 'xx111',
    //                         row2: 'xxxx222',
    //                         row3: 'xxxx333',
    //                         // typeList: listPromise[j].promiseTypeList,
    //                     },
    //                     {
    //                         row1: 'xx111',
    //                         row2: 'xxxx222',
    //                         row3: 'xxxx333',
    //                         // typeList: listPromise[j].promiseTypeList,
    //                     },
    //                     {
    //                         row1: 'xx111',
    //                         row2: 'xxxx222',
    //                         row3: 'xxxx333',
    //                         // typeList: listPromise[j].promiseTypeList,
    //                     },
    //                     {
    //                         row1: 'xx111',
    //                         row2: 'xxxx222',
    //                         row3: 'xxxx333',
    //                         // typeList: listPromise[j].promiseTypeList,
    //                     },
    //                     {
    //                         row1: 'xx111',
    //                         row2: 'xxxx222',
    //                         row3: 'xxxx333',
    //                         // typeList: listPromise[j].promiseTypeList,
    //                     },
    //                     {
    //                         row1: 'xx111',
    //                         row2: 'xxxx222',
    //                         row3: 'xxxx333',
    //                         // typeList: listPromise[j].promiseTypeList,
    //                     },
    //                 ],
    //                 swiperData2: [
    //                     {
    //                         row1: 'yy111',
    //                         row2: 'yyy222',
    //                         row3: 'yyy333',
    //                         // typeList: listPromise[j].promiseTypeList,
    //                     },
    //                     {
    //                         row1: 'yy111',
    //                         row2: 'yyy222',
    //                         row3: 'yyy333',
    //                         // typeList: listPromise[j].promiseTypeList,
    //                     },
    //                     {
    //                         row1: 'yy111',
    //                         row2: 'yyy222',
    //                         row3: 'yyy333',
    //                         // typeList: listPromise[j].promiseTypeList,
    //                     },
    //                     {
    //                         row1: 'yy111',
    //                         row2: 'yyy222',
    //                         row3: 'yyy333',
    //                         // typeList: listPromise[j].promiseTypeList,
    //                     },
    //                     {
    //                         row1: 'yy111',
    //                         row2: 'yyy222',
    //                         row3: 'yyy333',
    //                         // typeList: listPromise[j].promiseTypeList,
    //                     },
    //                     {
    //                         row1: 'yy111',
    //                         row2: 'yyy222',
    //                         row3: 'yyy333',
    //                         // typeList: listPromise[j].promiseTypeList,
    //                     },
    //                     {
    //                         row1: 'yy111',
    //                         row2: 'yyy222',
    //                         row3: 'yyy333',
    //                         // typeList: listPromise[j].promiseTypeList,
    //                     },
    //                 ],
    //             },

    //             // 动效轮播排行数据
    //             buildHead: [
    //                 { label: '行业（部门）', width: '40%' },
    //                 { label: '对象数', width: '30%' },
    //                 { label: '措施数', width: '30%' },
    //             ],
    //             buildField: ['deptName', 'objNumber', 'dealNumber'],
    //             // 数字标题组件数据
    //             countInfo: [
    //                 {
    //                     name: '信用记录总数',
    //                     label: 'legalCreditRecordNum',
    //                     value: 2737256,
    //                     unit: '条',
    //                 },
    //                 {
    //                     name: '信用主体总数',
    //                     label: 'legalCreditRecordNumProportion',
    //                     value: 66276472,
    //                     unit: '个',
    //                 },
    //             ],
    //             overallSituation: {
    //                 legalCreditRecordNum: 1,
    //                 legalCreditRecordNumProportion: 1,
    //                 naturalCreditRecordNum: 1,
    //                 naturalCreditRecordNumProportion: 1,
    //             },
    //         };
    //     },
    //     // watch: {
    //     //   swiperData: {
    //     //     handler(newValue, oldValue) {
    //     //       console.log(newValue)
    //     //       debugger
    //     //       if (newValue.coverOrPromise === 0) {
    //     //         // this.$nextTick(() => {
    //     //         this.carouselHead[2] == '111'
    //     //         // })
    //     //       } else {
    //     //         // this.$nextTick(() => {
    //     //         this.carouselHead[2] == '222'
    //     //         // })

    //     //       }
    //     //     },
    //     //     deep: true,
    //     //   },
    //     // },
    //     created() {},
    //     mounted() {
    //         // this.handleData()
    //         // console.log('xxxx')
    //     },
    //     methods: {
    //         tabChange1(type, index, item) {
    //             this.activeIdx[type] = index;
    //             if (type === 'tabs1') {
    //                 this.activeDepart = item.value;
    //                 if (item.label === '承诺数量') {
    //                     this.swiperData.coverOrPromise = 1;
    //                     this.carouselHead[2] = '信用承诺数量';
    //                 } else {
    //                     this.swiperData.coverOrPromise = 0;
    //                     this.carouselHead[2] = '覆盖类型数量';
    //                 }
    //             }
    //         },
    //     },
    // };
</script>

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
                flex: 1;
                margin-left: 0.5rem;
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
                .c-i-m-left-bottom-box {
                    height: 2.98rem;
                    box-sizing: border-box;
                    padding-top: 16px;
                    .r-a-p-department-header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 0.16rem;
                        .r-a-p-department-count {
                            position: relative;
                            padding-right: 0.02rem;
                            .r-a-p-content-title::before {
                                content: '';
                                position: absolute;
                                top: -0.07rem;
                                left: -0.25rem;
                                width: 0.37rem;
                                height: 0.41rem;
                                background: url('~@/assets/img/legend.png') no-repeat center;
                                background-size: 100% 100%;
                            }
                            .r-a-p-content-title {
                                font-style: italic;
                                margin-right: 0.08rem;
                            }
                            .r-a-p-content-num {
                                font-size: 0.18rem;
                            }
                        }
                    }
                }

                .echats {
                    margin-left: 0.3rem;
                    width: 3.88rem;
                    height: 2.9rem;
                }
            }
        }
    }
</style>
