<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2022-09-21 15:48:47
 * @LastEditors: peiqf
 * @LastEditTime: 2023-01-03 14:39:43
-->
<template>
    <div class="map-center-tooptip-box">
        <div
            v-for="(item, index) in countInfo"
            :key="'center-tooptip' + index"
            class="map-center-tooptip-item"
        >
            <span class="r-a-p-content-title">·{{ item.name }}：</span>
            <span class="r-a-p-content-num">
                <!-- {{ overallSituation[item.label] || item.value}} -->
                <single-number v-if="item.value > 0" :end-val="item.value" :delay="1000" />
                <label>{{ item.unit }}</label>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts" name="name-number">
    import { number } from 'echarts/core';

    const props = defineProps({
        countInfo: {
            type: Array,
            default: () => {
                return [];
            },
        },
        overallSituation: { type: Object },
    });
</script>
<style lang="less" scoped>
    /* @import url(); 引入css类 */
    .map-center-tooptip-box {
        position: relative;
        top: 0.52rem;
        left: 0.3rem;
        .map-center-tooptip-item {
            position: relative;
            display: flex;
            align-items: center;
            margin-bottom: 0.16rem;
            vertical-align: middle;
            .r-a-p-content-title::before {
                content: '';
                position: absolute;
                top: -0.05rem;
                left: -0.25rem;
                width: 0.37rem;
                height: 0.41rem;
                background: url('~@/assets/img/legend.png') no-repeat center;
                background-size: 100% 100%;
            }
            .r-a-p-content-title {
                font-size: 0.16rem;
                font-family: SourceHanSansCN-Normal;
                font-weight: 400;
                color: #f2fcfd;
                font-style: italic;
            }
            .r-a-p-content-num {
                font-size: 0.22rem;
                font-family: PangMen;
                font-weight: 400;
                color: #fcf6b3;
                letter-spacing: 0.03rem;
                text-shadow: 0.02rem 0.04rem 0.16rem rgba(251, 165, 54, 0.75);
                text-align: center;
                margin-left: 0.05rem;
                label {
                    font-size: 0.13rem;
                    font-family: SourceHanSansCN-Regular;
                    font-weight: 400;
                    color: #fcf6b3;
                    opacity: 0.6;
                    margin-left: 0.05rem;
                }
            }
        }
    }
</style>
