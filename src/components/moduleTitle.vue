<!--
 * @Descripttion: 标题组件
 * @Author: peiqf
 * @Date: 2022-07-13 15:31:28
 * @LastEditors: peiqf
 * @LastEditTime: 2022-09-19 10:45:58
-->

<template>
  <div class="titleBox" ref="titleBox">
    <img ref="titleImg" src="@/assets/img/moduleTitle/title-bg.png" />
    <span class="title">{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: 'moduleTitle',
  props: ['title', 'titleWidth'],
  mounted() {
    this.$refs.titleBox.style.width = this.titleWidth / 100 + 'rem'
    this.$refs.titleImg.style.width = this.titleWidth / 100 + 'rem'
  },
}
</script>

<style lang="less" scoped>
.titleBox {
  width: 3.88rem;
  height: 0.35rem;
  background: linear-gradient(90deg, #064283 0%, rgba(6, 66, 131, 0.16) 100%);

  img {
    // width: 3.88rem;
    height: 0.35rem;
  }
}
.title {
  height: 0.16rem;
  font-size: 0.15rem;
  // font-family: SourceHanSansCN-Regular;
  font-weight: 400;
  color: #f1f8fe;
  line-height: 0.35rem;
  margin-left: 0.07rem;
  position: relative;
  left: 0.2rem;
  top: -0.41rem;
}
</style>
