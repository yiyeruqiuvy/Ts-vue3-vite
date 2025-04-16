<!--
 * @Description: 
 * @Author: sujl
 * @Date: 2023-02-19 15:36:12
 * @LastEditors: peiqf
 * @LastEditTime: 2023-09-07 16:40:44
-->
<template>
  <div class="left_title">
    <!-- <slot></slot> -->
    <div class="img"><img src="./img/first_img.png" /></div>
    <div class="title">
      <div class="text1">
        <span v-for="(item, idx) of titleData" :key="idx">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  watch: {
    immediate: true,
    title(newVal, oldVal) {
      this.titleData = []
      this.titleData = newVal.split('')
      console.log(this.titleData)
      // console.log(newVal)
      // let titleArr = newVal.split('')
      // if (titleArr.length > 40) {
      //   this.titleData = []
      //   this.titleData = titleArr
      // }
    }
  },
  data() {
    return {
      titleData: []
    }
  },

  mounted() {
    this.titleData = []
    this.titleData = this.title.split('')
    console.log(this.titleData)
    // this.titleData = []
    // console.log(this.title)
    // let titleArr = this.title.split('')
    // if (titleArr.length > 42) {
    //   this.titleData = []
    //   this.titleData = titleArr
    // }
  }
}
</script>

<style scoped lang="less">
// @import '~@/scopes/project/common/font/font.css';

.left_title {
  height: auto;
  width: 100%;
  background: linear-gradient(90deg, #0e3262, rgba(11, 22, 33, 0.2));
  border-radius: 0.04rem;
  margin-bottom: 0.08rem;
  display: flex;
  // align-items: center;
  // height: 0.34rem;

  .img {
    img {
      height: 0.3rem;
      margin-left: 0.05rem;
      // position: relative;
      // top: -0.13rem;
    }
    // position: relative;
    // top: -0.13rem;
  }
  .title {
    .text1 {
      span {
        font-size: 0.18rem;
        font-family: Alibaba PuHuiTi;
        font-weight: 600;
        color: #ffffff;
        background: linear-gradient(0deg, #3ca2f8 0%, #ffffff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
}
</style>
