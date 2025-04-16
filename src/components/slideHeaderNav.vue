<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2023-09-07 10:30:40
 * @LastEditors: peiqf
 * @LastEditTime: 2024-04-11 14:26:14
-->
<template>
  <div class="slideHeaderNav-box">
    <header class="header">
      <div
        v-for="(navItem, idx) of navList"
        :key="idx"
        :to="navItem.path"
        class="header-to"
        :class="{ active: idx === currentIdx }"
        :title="navItem.label"
        @click="goTo(navItem, idx)"
      >
        {{ idx + 1 + '.' + navItem.label }}
      </div>
    </header>
  </div>
</template>

<script>
  export default {
    name: 'HeaderNav',
    data() {
      return {
        navList: [
          {
            label: '标题组件',
            path: 'title',
          },
          {
            label: '按钮组件',
            path: 'button',
          },
          {
            label: '模版',
            path: '/',
          },
          {
            label: '大屏表格',
            path: '/',
          },
          {
            label: 'echarts组件',
            path: '/echarts',
          },
          {
            label: 'hightcharts（版权不推荐使用）',
            path: '/highCharts3d',
          },
          {
            label: '弹窗组件',
            path: '/',
          },
          {
            label: '其他组件',
            path: '/',
          },

          {
            label: '相关技术',
            path: '/',
          },
        ],
        currentIdx: 0,
      };
    },
    created() {},
    mounted() {},
    methods: {
      goTo(data, idx) {
        this.currentIdx = idx;
        this.$router.push({ path: data.path });
      },
    },
  };
</script>
<style lang="less" scoped>
  /* @import url(); 引入css类 */
  .slideHeaderNav-box {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    .header {
      display: flex;
      justify-content: center;
      flex-direction: column;
      .header-to {
        font-size: 0.3rem;
        padding: 0 0 0 0.1rem;
        color: antiquewhite;
        text-decoration: none;
        border: 0.01rem solid #0d5060;
        margin: 0.08rem;
        border-radius: 0.1rem;
        width: auto;
        height: 0.8rem;
        line-height: 0.8rem;
        text-align: left;
        // display: flex;
        // align-items: center;
        // justify-content: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }
      .active {
        color: #2ce41dd1;
      }
    }
  }
</style>
