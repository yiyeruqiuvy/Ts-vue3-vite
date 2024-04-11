<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2022-09-21 10:24:18
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-22 09:11:17
-->
<template>
    <div>
        <header class="header">
            <router-link to="/" class="header-to">echarts组件</router-link>
            <router-link to="/highCharts3d" class="header-to">3d饼图</router-link>
            <router-link to="/other" class="header-to">其他组件</router-link>
        </header>
    </div>
</template>

<script lang="ts" name="HeaderNav"></script>
<style lang="less" scoped>
    /* @import url(); 引入css类 */
    .header {
        display: flex;
        justify-content: center;
        .header-to {
            font-size: 0.3rem;
            padding: 0.3rem;
            color: antiquewhite;
            text-decoration: none;
        }
    }
</style>
