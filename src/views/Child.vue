<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2022-12-20 16:28:27
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-21 11:40:56
-->
<!-- 子组件中 Child.vue -->

<script setup lang="ts">
    // import { defineProps } from 'vue';

    // 分离模式 ts+vue3的props
    // 使用typescript定义props
    // interface Prop {
    //     count?: number;
    // }

    // // // 直接使用defineProps
    // const ChildProps = withDefaults(defineProps<Prop>(), {
    //     count: 10,
    // });

    // 组合模式
    const props = withDefaults(defineProps<{ count?: number | boolean; title?: string }>(), {
        count: 900,
        title: '默认标题',
    });
    // withDefaults(defineProps<{ count?: number | boolean; title?: string }>(), {
    //     count: 900,
    //     title: '默认标题',
    // });
    // const ChildProps = defineProps({
    //     count: 10,
    // });

    //下面的看不懂
    // interface testType {
    //     name: string;
    //     age: number;
    // }
    // const props = withDefaults(
    //     defineProps<{
    //         text: testType;
    //     }>(),
    //     {
    //         text: {
    //             name: 'flying_dark_feather',
    //             age: 20,
    //         },
    //     }
    // );
    const chileEmit = defineEmits(['sendMsg']);

    // 定义事件
    const handleEmit = () => {
        chileEmit('sendMsg', 'hello world');
    };
</script>

<template>
    <div>我是子组件</div>
    <!-- <div>子组件的count： {{ ChildProps.count }}</div> -->
    <div class="count">props： {{ props.count }}</div>
    <!-- emits事件 -->
    <el-button @click="handleEmit">点击子组件的数据传递给父组件</el-button>

    <!-- <el-button>props的count +1</el-button> -->
</template>
<style lang="scss" scoped>
    .count {
        font-size: $fs;
        color: $white;
    }
</style>
