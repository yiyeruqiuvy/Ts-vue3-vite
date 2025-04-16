<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2023-09-07 14:12:50
 * @LastEditors: peiqf
 * @LastEditTime: 2023-09-07 14:15:37
-->
<template>
  <div
    class="module"
    :class="'module-bg' + bgConfig.bgType"
    :style="'border-radius:' + bgConfig.borderRadius"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    bgConfig: {
      type: Object,
      default: () => ({
        bgType: '1', // 1 横着的渐变 2 竖着的渐变 3 带边框的样式
        borderRadius: '0.1rem' // 盒子的box-radius
      })
    }
  }
}
</script>

<style lang="less" scoped>
.module {
  width: 100%;
  height: 100%;
}
.module-bg1 {
  background: linear-gradient(
    -90deg,
    rgba(25, 37, 62, 0.8),
    rgba(34, 62, 97, 0.8)
  ) !important;
}

.module-bg2 {
  background: linear-gradient(
    180deg,
    rgba(25, 37, 62, 0.8),
    rgba(34, 62, 97, 0.8)
  ) !important;
}

.module-bg3 {
  background: rgba(23, 36, 62, 0.36) !important;
  border: 0.02rem solid rgba(37, 165, 254, 0.36) !important;
}

.module-bg4 {
  background: transparent;
}
</style>
