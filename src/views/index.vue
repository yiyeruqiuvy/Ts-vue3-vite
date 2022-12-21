<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2022-12-19 15:37:11
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-21 11:21:38
-->
<script setup lang="ts">
    // 引入store
    // name:'index',
    import { useStore } from '../store/countStore';
    import { ref } from 'vue';

    // 引入子组件 无需注册无需return直接使用
    import ChildCmp from './Child.vue';

    // 定义一个数字传递给子组件,同样无需return,直接使用
    const count = ref<number>(9);
    // 使用store
    const count2 = useStore();

    // 事件
    // 接收子组件传递的数据
    const receive = (val) => {
        console.log('接收子组件的数据', val);
    };
</script>

<template>
    <!-- 使用store中的store -->

    <p>store中的count： {{ count2.count }}</p>
    <el-button>store中的count +1</el-button>
    <ChildCmp :count="count" @sendMsg="receive" />
    <!-- <ChildCmp :count="count" name="zhangsan" age="99" /> -->
</template>

<style scoped></style>
