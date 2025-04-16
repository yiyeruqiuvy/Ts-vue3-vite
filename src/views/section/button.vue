<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2023-09-07 10:11:00
 * @LastEditors: peiqf
 * @LastEditTime: 2023-09-07 17:04:18
-->
<template>
  <div class="section-box">
    <sectionShow :componentConfig="componentConfig"></sectionShow>
  </div>
</template>

<script>
import componentConfig from "@/components/common/utils/config/buttonConfig";
import sectionShow from "@/components/sectionShow.vue";
export default {
  // name: "",
  components: {  sectionShow },
  data() {
    return { componentConfig };
  },
  computed: {},
  created() {
  },
};
</script>

<style lang="less" scoped>
// import dsa from '@/src/assets/less/common.less'
</style>
