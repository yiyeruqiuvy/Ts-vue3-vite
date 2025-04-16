<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangting
 * @Date: 2023-04-14 21:11:59
 * @LastEditors: peiqf
 * @LastEditTime: 2025-04-16 16:22:43
-->
<template>
  <div class="first-title">
    {{ title }}
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    }
  },
  data() {
    return {}
  },
  mounted() {
    console.log('item222222')
  },
  methods: {},
  components: {}
}
</script>

<style lang="less" scoped>
// @import url('/public/font/alibaba.less');
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
