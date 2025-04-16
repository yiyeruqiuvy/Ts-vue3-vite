<!--
 * @Description: 
 * @Author: sujl
 * @Date: 2023-02-19 15:36:12
 * @LastEditors: peiqf
 * @LastEditTime: 2023-09-07 16:31:28
-->
<template>
  <div class="third-title">
    <slot></slot>
    <div class="third-title-box">
      <img src="./img/third-title.png" />
      {{ title }}
    </div>
  </div>
</template>

<script>
export default {
  name: "base-third-title",
  props: {
    title: {
      type: String,
      // default: ''
    },
  },
};
</script>

<style scoped lang="less">
// @import '~@/scopes/project/common/font/font.css';
// @import url("/public/font/alibaba.less");
.third-title {
  width: 100%;
  font-family: AlibabaPuHuiTiMedium;
  position: relative;
  &-box {
    font-size: 0.18rem;
    font-family: AlibabaPuHuiTiRegular;
    font-weight: 400;
    color: #a5daff;
    line-height: 0.22rem;
  }
  img {
    width: 0.1rem;
    height: 0.14rem;
    margin-right: 0.05rem;
    margin-top: -0.04rem;
    vertical-align: middle;
  }
}
</style>
