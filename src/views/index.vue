<!--
 * @Descripttion: 新的主页
 * @Author: peiqf
 * @Date: 2024-04-11 14:25:04
 * @LastEditors: peiqf
 * @LastEditTime: 2024-04-11 14:36:05
-->
<template>
  <div id="big-screen" class="">
    <div class="screen-box">
      <div class="left-box">
        <slideHeaderNav></slideHeaderNav>
      </div>
      <div class="center-box">
        <router-view></router-view>
      </div>
      <div class="right-box"></div>
    </div>
  </div>
</template>
<script setup lang="ts" name="name1">
    import { ref, onMounted } from 'vue';
    const count = ref<number>(9);
    const props = withDefaults(defineProps<{ count?: number | boolean; title?: string }>(), {
        count: 666,
        title: 'xxx',
    });
    onMounted(() => {
        // console.log(count.value);
    });
</script>

<style lang="less" scoped>
#big-screen {
  width: 19.2rem;
  height: 10.8rem;
  background: url("@/assets/img/nomap-bg.png") no-repeat 100% 100%;
  .screen-box {
    width: 100%;
    height: 100%;
    display: flex;
    .left-box {
      width: 2.5rem;
      // background: #a72c2c;
      height: 100%;
      padding: 0.1rem;
    }
    .center-box {
      flex: 1;
      // background: #156db9;
      height: 100%;
      padding: 0.1rem;
    }
    .right-box {
      width: 2rem;
      // background: #1ac958;
      height: auto;
      padding: 0.1rem;
    }
  }
}
</style>
