<!--
 * @Descripttion: 标题组件
 * @Author: peiqf
 * @Date: 2025-04-23 15:40:20
 * @LastEditors: peiqf
 * @LastEditTime: 2025-04-23 16:09:46
-->
<template>
  <div class="header-box" :class="'header-box-' + size">
    <!-- 中间文字 -->
    <div class="center">
      <div class="center-title" :data-text="title">
        {{ title }}
      </div>
      <!-- <div v-if="subTitle" class="sub-title">
        {{ subTitle }}
      </div> -->
    </div>
    <!-- 右边插槽 -->
    <slot></slot>
  </div>
</template>
<script setup lang="ts" name="name1">
import { onMounted } from 'vue'
// const count = ref<number>(9)
const props = withDefaults(defineProps<{ title?: string; size?: string }>(), {
  title: 'xxx',
  size: 'big'
})
onMounted(() => {
  console.log(props)
})
</script>

<style scoped lang="scss">
@media screen and (max-width: 1920px) {
  .header-box {
    position: absolute;
    width: 100%;
    height: 1.71rem;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    background: url('./img/top-v3.png') no-repeat;
    // background: url('./img/top-v3.png') no-repeat;
    z-index: 101;
    background-position-y: -0.4rem !important;
    background-size: cover;

    .center {
      position: absolute;
      top: 0.05rem;
      font-size: 0.35rem;
      font-family: Alibaba PuHuiTi;
      font-weight: bold;
      // color: #ffffff;
      background: linear-gradient(0deg, #c3d4f6 0%, #ffffff 99.5361328125%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      .center-title {
        font-family: AlibabaPuHuiTiB;
        font-size: 0.35rem;
        position: relative;
        background: linear-gradient(358deg, #c1ebff 0%, #ffffff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .sub-title {
        margin-top: 0.1rem;
        height: 0.33rem;
        line-height: 0.33rem;
        text-align: center;
        font-size: 0.23rem;
        font-family: AlimamaShuHeiTi-Bold;
        color: #edf3ff;
        background-image: linear-gradient(
          180deg,
          rgba(20, 24, 27, 0.11) 3%,
          rgba(121, 177, 239, 0.44) 100%
        );
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.22);
      }
    }
  }
}
@media screen and (min-width: 1921px) {
  .header-box {
    position: absolute;
    width: 100%;
    height: 2.82rem;
    top: 0;
    display: flex;
    justify-content: center;
    // background: url('./img/top-v3.png') no-repeat;
    background: url('./img/head/3d地图头部切图-带蒙层.png') no-repeat;

    z-index: 101;
    left: 0;
    background-size: cover;

    .title {
      height: 0.5rem;
      object-fit: contain;
      margin-top: -0.5rem;
    }

    .center {
      position: absolute;
      top: 8%;
      font-size: 0.76rem;
      font-family: Alibaba PuHuiTi;
      font-weight: bold;
      // color: #ffffff;
      background: linear-gradient(to bottom, #ffffff, #c3d4f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      .center-title {
        font-family: AlimamaShuHeiTi-Bold;
        font-size: 0.84rem;
        // color: #81848F;
        text-align: center;
        // text-shadow: 0 0.08rem 0.16rem rgba(0,0,0,0.23);
        font-weight: 700;
        // background: linear-gradient(to bottom,#FFFFFF,#C3D4F6);
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
        background: linear-gradient(to bottom, #ffffff, #c3d4f6);
        -webkit-background-clip: text;
        // background-clip: text;
        // color: transparent;
        &::after {
          position: absolute;
          top: 0;
          left: 0;
          content: attr(data-text); // 拿自定义属性
          text-shadow: 0 0.08rem 0.16rem rgba(0, 0, 0, 0.23);
          z-index: -1;
        }
      }
      .sub-title {
        margin-top: 0.1rem;
        height: 0.33rem;
        line-height: 0.33rem;
        text-align: center;
        font-size: 0.23rem;
        font-family: AlimamaShuHeiTi-Bold;
        color: #edf3ff;
        background-image: linear-gradient(
          180deg,
          rgba(20, 24, 27, 0.11) 3%,
          rgba(121, 177, 239, 0.44) 100%
        );
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.22);
      }
    }
  }
}
.deep-bg {
  width: 100%;
  height: 100%;
  background: red;
}
</style>
