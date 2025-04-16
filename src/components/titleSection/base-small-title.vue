<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2023-09-07 15:57:19
 * @LastEditors: peiqf
 * @LastEditTime: 2023-09-07 15:57:49
-->
<!--
 * author: wangyf
 * description: 大屏右边模块预警模块小标题
 * Date: 2023-02-20 14:35:46
 *-->
<template>
  <div class="warning-title" :title="title">
    {{ title }}
  </div>
</template>

<script>
export default {
  props: {
    title: {
      require: true,
      type: String
    }
  }
}
</script>

<style scoped lang="less">
// @import '~@/scopes/project/common/font/font.css';
.warning-title {
  font-size: 0.23rem;
  font-family: Alibaba PuHuiTi;
  font-weight: 400;
  color: #ffffff;
  background: linear-gradient(0deg, #3ca2f8 0%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
