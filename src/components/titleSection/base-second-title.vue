<!--
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2023-07-24 14:50:11
 * @LastEditors: peiqf
 * @LastEditTime: 2023-08-16 09:24:33
-->
<template>
  <div
    class="base-second-title2"
    :class="noTri ? 'title-notri' : 'title-normal'"
  >
    <span>{{ title }}</span>
    <div v-if="isShowTip" class="title-tip">
      <div class="tip-content">
        统计时间范围为近30天
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    noTri: {
      type: Boolean,
      default: false,
    },
    isShowTip: {
      type: Boolean,
      default: () => {
        return false
      },
    },
  },
  data () {
    return {}
  },
  mounted () {},
  methods: {},
}
</script>

<style lang="less" scoped>
@import url('/public/font/alibaba.less');

.base-second-title2 {
  width: 100%;
  height: 0.21rem;
  line-height: 0.18rem;
  padding-left: 0.2rem;
  color: #ffffff;
  font-size: 0.16rem;
  font-family: Alibaba PuHuiTi;
  position: relative;
  display: flex;
}
.title-normal {
  background: url('./img/base_second_title2.png') left center/100% 100%;
  box-sizing: border-box;
}
.title-notri {
  background: url('./img/base_second_title2-notri.png') left center/100% 100%;
  box-sizing: border-box;
}
.title-tip {
  // position: absolute;
  // top: 6.89rem;
  // left: 1.22rem;
  width: 0.29rem;
  height: 0.29rem;
  background: url('./img/tips/icon-tip.png') no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  transform: translateY(-16%);
  .tip-content {
    display: none;
    position: relative;
    top: -0.36rem;
    left: -0.56rem;
    width: 1.43rem;
    height: 0.46rem;
    background: url('./img/tips/icon-border.png') no-repeat;
    background-size: 100% 100%;
    font-size: 0.13rem;
    line-height: 0.42rem;
    font-family: AlibabaPuHuiTiRegular;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
  }
}
.title-tip:hover .tip-content {
  display: inline-block;
}
</style>
