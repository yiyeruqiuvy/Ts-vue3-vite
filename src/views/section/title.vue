<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2023-09-07 10:11:00
 * @LastEditors: peiqf
 * @LastEditTime: 2024-04-24 09:54:21
-->
<template>
  <div class="section-box">
    <sectionShow namPatch="titleSection" :componentConfig="componentConfig"></sectionShow>
  </div>
</template>

<script setup lang='ts' name='name1'>
import { ref, onMounted } from 'vue'
import componentConfig from "@/components/common/utils/config/titleConfig";

  const count = ref<number>(9);
  const props = withDefaults(defineProps<{ count?: number | boolean; title?: string }>(), {
    count: 666,
    title:'xxx'
    });
  onMounted(() => {
    console.log(count.value,'value')
    console.log(componentConfig,'componentConfig')
  }
  )
</script>

<!-- <script>
// import componentConfig from "@/components/common/utils/config/titleConfig";
// import sectionShow from "@/components/sectionShow.vue";
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
</script> -->

<style lang="less" scoped>
// import dsa from '@/src/assets/less/common.less'
</style>
