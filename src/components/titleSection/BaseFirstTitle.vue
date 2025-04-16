<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2025-04-16 15:44:11
 * @LastEditors: peiqf
 * @LastEditTime: 2025-04-16 17:13:03
-->
<script setup lang='ts' name='BaseFirstTitle'>
import { ref, onMounted } from 'vue'
  // const count = ref<number>(9);
  const props = withDefaults(defineProps<{ title?: string }>(), {
title:''
 });
onMounted(() => {console.log(props.title)})
</script>
<template>
<div class="first-title">
    {{ title }}
  </div>
  
  </template>
<style lang='less' scoped>
.first-title {
  width: 100%;
  height: 0.62rem;
  line-height: 0.5rem;
  background-image: url('./img/big_title.png');
  background-size: 100% 100%;
  font-weight: bold;
  font-size: 0.22rem;
  font-family: AlibabaPuHuiTiBold;
  color: #fff;
  padding-left: 0.32rem;
  box-sizing: border-box;
}
</style>