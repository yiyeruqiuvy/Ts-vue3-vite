<!--
 * @Descripttion: 无缝滚动排行组件demo
 * @Author: peiqf
 * @Date: 2022-07-14 10:45:18
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-29 10:55:25
-->

<template>
    <div>
        <div ref="ranking" class="ranking">
            <div class="rankingHead">
                <span v-for="item in tableData.tableHead" :key="item">{{ item }}</span>
            </div>
            <div class="scrollRanking">
                <ul style="list-style: none; padding: 0">
                    <li class="carouseBody">
                        <div
                            v-for="(item, index) in tableData.tableData"
                            :key="index"
                            class="scrollRow"
                        >
                            <span class="col-1">{{ item.row1 }}</span>
                            <span class="col-2">{{ item.row2 }}</span>
                            <span class="col-3">{{ item.row3 }}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="scrollRanking">
    import '@/utils/scroll.js';
    import { getCurrentInstance, onMounted } from 'vue';
    const { proxy } = getCurrentInstance();

    const props = defineProps({
        tableData: {
            type: Object,
            default: () => {
                return {};
            },
        },
        scrollWidth: {
            type: Number,
            default: () => {
                return '';
            },
        },
        scrollHeight: {
            type: Number,
            default: () => {
                return '';
            },
        },
    });
    function scroll() {
        let height = $('.carouseBody').outerHeight();
        $('.scrollRanking').myScroll({
            speed: 50, // 数值越大，速度越慢
            rowHeight: height, // li的高度
        });
    }
    onMounted(() => {
        proxy.$refs.ranking.style.width = props.scrollWidth / 100 + 'rem';
        proxy.$refs.ranking.style.height = props.scrollHeight / 100 + 'rem';
        scroll();
        // console.log(props.tableData);
    });
    // export default {
    //     name: 'ScrollRanking',
    //     props: ['tableHead', 'tableData', 'scrollWidth', 'scrollHeight'],
    //     data() {
    //         return {};
    //     },
    //     mounted() {
    //         this.$refs.ranking.style.width = this.scrollWidth / 100 + 'rem';
    //         this.$refs.ranking.style.height = this.scrollHeight / 100 + 'rem';

    //         this.scroll();
    //     },
    //     methods: {
    //         scroll() {
    //             let height = $('.carouseBody').outerHeight();
    //             $('.scrollRanking').myScroll({
    //                 speed: 50, // 数值越大，速度越慢
    //                 rowHeight: height, // li的高度
    //             });
    //         },
    //     },
    // };
</script>

<style lang="less" scoped>
    // @import url("~@/assets/less/font.less");

    .ranking {
        width: 3.88rem;
        // height: calc(100% - 0.4rem);
    }
    .rankingHead {
        display: flex;
        align-items: center;
        width: 100%;
        height: 0.3rem;

        background: linear-gradient(180deg, #072742 0%, #0e4165 100%);
        box-shadow: 0px 1px rgba(64, 162, 253, 0.6);
        border-bottom: 0.01rem solid rgba(21, 87, 134, 0.58);

        margin-top: 0.22rem;
    }
    .rankingHead span {
        display: block;
        text-align: center;
        font-size: 0.14rem;
        font-weight: 400;
        color: #f2fcfd;
        font-family: SourceHanSansCN-Regular;
    }

    .scrollRanking {
        // height: 1.9rem;
        height: calc(100% - 0.6rem);
        overflow: hidden;
        .scrollRow {
            height: 0.34rem;
            background: rgb(9 41 71);
            border: 0.01rem solid rgba(21, 87, 134, 0.58);
            margin: 0.01rem 0;
            display: flex;
        }
        .scrollRow:nth-child(2n) {
            background: rgb(7 35 63);
        }
    }

    .scrollRow span {
        display: inline-block;
        text-align: center;
        line-height: 0.34rem;
        font-size: 0.14rem;
        font-weight: 400;
        color: linear-gradient(0deg, #f6ce54 0%, #fff4d8 100%);
        background: linear-gradient(0deg, #f6ce54 0%, #fff4d8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .scrollRow:nth-child(n + 4) span {
        background: #f2fcfd;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .scrollRow .col-1,
    .rankingHead span:nth-child(1) {
        width: 30%;
    }
    .scrollRow .col-2,
    .rankingHead span:nth-child(2) {
        width: 40%;
    }
    .scrollRow .col-3,
    .rankingHead span:nth-child(3) {
        width: 30%;
    }
</style>
