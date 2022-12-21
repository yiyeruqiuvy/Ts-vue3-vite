/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2022-12-19 15:37:11
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-20 15:16:28
 */
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
// 引入pinia
import { createPinia } from 'pinia';
import router from './router/index';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
