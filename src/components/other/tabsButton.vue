<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2022-09-21 13:52:35
 * @LastEditors: peiqf
 * @LastEditTime: 2023-03-22 15:51:49
-->
<template>
    <div class="r-a-p-tabs-button">
        <div
            v-for="(item, index) in tabs.tabs"
            :key="'tabs' + index"
            class="r-a-p-tabs-default"
            :class="{ 'r-a-p-tabs-active': tabs.currentTab === index }"
            @click="tabChange(index, item.value)"
        >
            {{ item.label }}
        </div>
    </div>
</template>

<script setup lang="ts" name="other">
    import { reactive, onMounted } from 'vue';
    import { deepClone } from '@/common/mixin/mixin';
    const props = defineProps({
        tabsGroup: {
            type: Object,
            default: () => {
                return {
                    tabs: [
                        { label: '按钮1', value: 'punish' },
                        { label: '按钮2', value: 'reward' },
                    ],
                    currentTab: 0, //切换按钮的下标
                };
            },
        },
        status: {},
        status2: {},
    });
    let tabs = reactive(deepClone(props.tabsGroup));
    const emit = defineEmits(['changeBtn']);

    // 定义事件
    const changeBtn = (data: number) => {
        emit('changeBtn', data);
    };
    function tabChange(index, value) {
        tabs.currentTab = index;
        changeBtn(index);
        // props.$emit('update:status', value);
        // props.$emit('update:status2', index);
    }
</script>
<style lang="less" scoped>
    /* @import url(); 引入css类 */
    .r-a-p-tabs-button {
        display: flex;
        font-size: 0.14rem;
        font-family: SourceHanSansCN-Medium;
        font-weight: 500;
        color: #f0fcfd;
        .r-a-p-tabs-default {
            width: 0.8rem;
            height: 0.26rem;
            line-height: 0.24rem;
            border: 0.02rem solid #006be6;
            cursor: pointer;
            text-align: center;
            box-sizing: border-box;
            &:first-child {
                border-radius: 0.06rem 0 0 0.06rem;
            }
            &:last-child {
                border-radius: 0 0.06rem 0.06rem 0;
            }
        }
        .r-a-p-tabs-active {
            background: #006be6;
        }
    }
</style>
