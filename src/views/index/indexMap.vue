<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2025-04-21 10:19:19
 * @LastEditors: peiqf
 * @LastEditTime: 2025-04-21 10:23:37
-->
<script setup lang="ts" name="name1">
  import { ref, onMounted } from 'vue';
          const count1 = ref<number>(9);
        const props = withDefaults(defineProps<{ count?: number | boolean; title?: string }>(), {
    count: 666,
    title: 'xxx',
  });
  onMounted(() => {
    console.log(count1.value);
  });
</script>
<template>
  <div class="count">props： {{ props.count }}</div>
</template>
<style lang="less"></style>
