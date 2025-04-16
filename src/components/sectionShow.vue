<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2023-09-07 14:25:28
 * @LastEditors: peiqf
 * @LastEditTime: 2025-04-16 17:58:37
-->
<template>
  <div>
    <div
      v-for="(item, index) in _componentConfig"
      :key="index"
      :class="item.className || ''"
      :style="item.style"
    >
      <div
        v-for="(item2, index2) in item.components"
        :key="index2"
        :style="item2.style"
      >
        <!-- <template> -->
          <div style="color: red; font-size: 0.3rem">
            {{ item2.componentsDesc }}
          </div>
          <!-- <baseFirstTitle :title="'21121'"></baseFirstTitle> -->
          <component :is="item2.com" v-bind="item2.config" />
          <baseModuleBg
            style="
              border-radius: 0.1rem;
              width: calc(100% - 0.6rem);
              height: calc(100% - 1.1rem);
              position: relative;
              left: 50%;
              transform: translateX(-50%);
              padding: 0.1rem 0.1rem;
            "
          >
            <div style="color: yellowgreen; font-size: 0.22rem">
              {{ item2.parameterDesc }}
            </div>
          </baseModuleBg>
        <!-- </template> -->
      </div>
    </div>
    <!-- 测试 -->
     <component :is="com1" title="9999" />
     <component :is="com2" title="88888" />

  </div>
</template>

<script setup lang="ts" name="sectionShow">
  // import baseFirstTitle from "@/components/titleSection/base-first-title.vue"
  import { onBeforeMount, onMounted,nextTick, reactive ,defineAsyncComponent,markRaw, ref} from 'vue'
  import {app} from '@/main'

  const props = defineProps({
    componentConfig: {
            type: Object,
            default: () => {
                return {};
            },
        },
    })
    const _componentConfig = reactive([
      ... props.componentConfig
    ])
    let com2= ref('')
    const com1 = markRaw(defineAsyncComponent(() =>
      import(`@/components/titleSection/BaseFirstTitle.vue`)))
  const initComponents = (config:any)=> {
      // console.log(app._context.components,'app.component')
      config.forEach((item:any) => {
        item.components.forEach((item2:any) => {
          const ket = item2.name
          console.log(app._context.components,item2.name,'item2')
          if (app._context.components.hasOwnProperty(item2.name)) {
            console.log('组件已经注册!')
         }else { 
          const comUrl = `./${item2.path}.vue`
          // console.log(`@/components/${item2.path}.vue`,comUrl,'999')
          item2.com = markRaw(defineAsyncComponent(() =>import(comUrl)))
          if(comUrl === './src/components/titleSection/BaseFirstTitle.vue'){
            com2 = item2.com
          }
           console.log(item2.com === com1,'item2.component')
           console.log(item2.com,com1,'item2')

        //  app.component(item2.name, item2.component) 
         }

// ))
          
        })
      })
      // this.componentConfig = config;
    }
    initComponents(_componentConfig)
    console.log(com2,'com2')
    // onBeforeMount(() => {
    //     // console.log(infeedBarData);
    //     nextTick(() => {
    //       initComponents(_componentConfig)
    //     });
    // });
  

</script>

<!-- <script>
// import Vue from "vue";
import baseModuleBg from "@/components/otherSection/base-module-bg.vue";
import {app} from '@/main'
export default {
  name: "sectionShow",
  components: { baseModuleBg },
  props: {
    componentConfig: {
      type: Array,
      default: () => {
        return {};
      },
    },
    // namPatch: {
    //   type: String,
    //   default: () => {
    //     return "titleSection";
    //   },
    // },
  },
  data() {
    return {};
  },
  computed: {},
  created() {
    // this.$nextTick(() => {
    //   this.initComponents(this.componentConfig);
    // });
  },
  mounted() {
    this.$nextTick(() => {
      this.initComponents(this.componentConfig);
    });
  }
  ,
  methods: {
    // 注册组件
    initComponents(config) {
      config.forEach((item) => {
        item.components.forEach((item2) => {
          app.component(`${item2.name}`, () =>
            import(`./${item2.path}`)
          );
        });
      });
      // this.componentConfig = config;
    },
  },
};
</script> -->

<style lang="less" scoped></style>
