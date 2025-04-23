<!--
 * @Author: wangting
 * @LastEditors: peiqf
 * @Date: 2023-02-21 14:12:30
 * @LastEditTime: 2025-04-23 15:47:12
 * @Description: desc
 * @FilePath: \cqGit\src\scopes\project\bigScreen\common\components\base-head\index.vue
-->
<template>
  <div class="header-box" :class="'header-box-' + size">
    <!-- <div class="deep-bg" v-if="showDeepBg"></div> -->
    <!-- 中间文字 -->
    <div class="center" @click="manage3DMap">
      <div class="center-title" :data-text="title">
        {{ title }}
      </div>
      <div v-if="subTitle" class="sub-title">
        {{ subTitle }}
      </div>
    </div>
    <!-- 右边插槽 -->
    <slot></slot>
  </div>
</template>
<script>
// import moment from 'moment'
// import VConsole from '@/corePage/index/vConsole.js'
// import { queryMixin } from '@/scopes/project/bigScreenMapbox/modulePart/situationAwareness/mixin/queryComponents.js'
export default {
  // mixins: [queryMixin],
  props: {
    // 标题
    title: {
      type: String,
      default: '重庆市城市运行和治理中心'
    },
    // 标题
    subTitle: {
      type: String,
      default: ''
    },
    // 整体的大小 big: 最大(市级大屏) medium: 区级大屏
    size: {
      type: String,
      default: 'big'
    },
    showDeepBg: {}
  },
  data() {
    return {}
  },
  mounted() {
    // this.loadTime()
  }
}
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

    .time {
      position: absolute;
      left: -0.5rem;
      top: -0.11rem;
      letter-spacing: 0.8px;
      display: flex;
      align-items: center;
      transform: scale(0.6);

      .date {
        margin-right: 0.1rem;
        font-size: 0.23rem;
        font-family: Alibaba PuHuiTi;
        font-weight: 600;
        color: #ffffff;
        background: linear-gradient(0deg, #3ca2f8 0%, #ffffff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .real-time {
        font-size: 0.38rem;
        font-family: Impact;
        font-weight: 400;

        background: linear-gradient(0deg, #3ca2f8 0%, #ffffff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

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

    .select-box {
      position: absolute;
      right: 0.63rem;
      top: 34%;
      min-width: 4rem;
      max-height: 3rem;
      border: 0.02rem solid #0294f2;
      box-shadow: 0 0 0.1rem 0.05rem #107ac1 inset;
      background-color: rgba(20, 31, 54, 0.8);
      -webkit-backdrop-filter: blur(0.08rem);
      backdrop-filter: blur(0.08rem);
      border-radius: 0.06rem;
      z-index: 999;

      font-size: 0.21rem;
      font-family: Alibaba PuHuiTi;
      font-weight: 600;
      color: #ffffff;
      padding: 0.2rem;
      pointer-events: fill;

      .top {
        font-size: 0.25rem;
      }

      .select-content {
        display: flex;
        flex-wrap: wrap;
        max-height: 1.2rem;
        overflow: auto;
      }

      .select-item {
        width: 25%;
      }
      .top,
      .select-item {
        background: linear-gradient(0deg, #25a6ff 0%, #ffffff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;

        &:hover {
          background: linear-gradient(0deg, #f8d73c 0%, #ffffff 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }

      .text-active {
        background: linear-gradient(0deg, #f8d73c 0%, #ffffff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  .header-box-medium {
    height: 1.2rem;

    .center {
      top: 6%;
      font-size: 0.36rem;
      font-family: AlibabaPuHuiTiR;
      font-weight: 400;

      .center-title {
        background: linear-gradient(0deg, #4fc7ff 0%, #d7f2ff 36.8896484375%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .time {
      .date {
        font-size: 0.12rem;
        font-family: AlibabaPuHuiTiR;
        font-weight: 400;
        color: #ffffff;
        background: linear-gradient(0deg, #3ca2f8 0%, #ffffff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .real-time {
        font-size: 0.19rem;
        font-family: Impact;
        font-weight: 400;
        color: #ffffff;
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
    .area-list {
      position: absolute;
      font-size: 0.24rem;
      color: #fff;
      right: 0.4rem;
      top: -1%;
      font-weight: 550;
      background-size: 100% 100%;
      border: 0.02rem solid #0294f2;
      box-shadow: 0 0 0.06rem 0.02rem #107ac1 inset;
      padding: 0.01rem 0.2rem;
      display: flex;
      align-items: center;
      font-size: 0.21rem;
      font-family: Alibaba PuHuiTi;
      font-weight: 600;
      color: #ffffff;
      background: linear-gradient(0deg, #25a6ff 0%, #ffffff 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      border-radius: 0.06rem;
      pointer-events: all;
      transform: scale(0.7);

      .icon {
        margin: 0 0.05rem;
      }

      img {
        width: 0.2rem;
        margin-right: 0.05rem;
      }
    }

    .title {
      height: 0.5rem;
      object-fit: contain;
      margin-top: -0.5rem;
    }

    .time {
      position: absolute;
      left: -0.5rem;
      top: -0.11rem;
      letter-spacing: 0.8px;
      display: flex;
      align-items: center;
      transform: scale(0.6);

      .date {
        margin-right: 0.1rem;
        font-size: 0.23rem;
        font-family: Alibaba PuHuiTi;
        font-weight: 600;
        color: #ffffff;
        background: linear-gradient(0deg, #3ca2f8 0%, #ffffff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .real-time {
        font-size: 0.38rem;
        font-family: Impact;
        font-weight: 400;

        background: linear-gradient(0deg, #3ca2f8 0%, #ffffff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
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

    .select-box {
      position: absolute;
      right: 0.63rem;
      top: 34%;
      min-width: 4rem;
      max-height: 3rem;
      border: 0.02rem solid #0294f2;
      box-shadow: 0 0 0.1rem 0.05rem #107ac1 inset;
      background-color: rgba(20, 31, 54, 0.8);
      -webkit-backdrop-filter: blur(0.08rem);
      backdrop-filter: blur(0.08rem);
      border-radius: 0.06rem;
      z-index: 999;

      font-size: 0.21rem;
      font-family: Alibaba PuHuiTi;
      font-weight: 600;
      color: #ffffff;
      padding: 0.2rem;
      pointer-events: fill;

      .top {
        font-size: 0.25rem;
      }

      .select-content {
        display: flex;
        flex-wrap: wrap;
        max-height: 1.2rem;
        overflow: auto;
      }

      .select-item {
        width: 25%;
      }
      .top,
      .select-item {
        background: linear-gradient(0deg, #25a6ff 0%, #ffffff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;

        &:hover {
          background: linear-gradient(0deg, #f8d73c 0%, #ffffff 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }

      .text-active {
        background: linear-gradient(0deg, #f8d73c 0%, #ffffff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  .header-box-medium {
    height: 1.2rem;

    .center {
      top: 6%;
      font-size: 0.36rem;
      font-family: AlibabaPuHuiTiR;
      font-weight: 400;

      .center-title {
        background: linear-gradient(0deg, #4fc7ff 0%, #d7f2ff 36.8896484375%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .time {
      .date {
        font-size: 0.12rem;
        font-family: AlibabaPuHuiTiR;
        font-weight: 400;
        color: #ffffff;
        background: linear-gradient(0deg, #3ca2f8 0%, #ffffff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .real-time {
        font-size: 0.19rem;
        font-family: Impact;
        font-weight: 400;
        color: #ffffff;
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
