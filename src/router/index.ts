/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2022-12-19 16:09:52
 * @LastEditors: peiqf
 * @LastEditTime: 2025-04-21 10:18:36
 */
import { createWebHashHistory, createRouter } from 'vue-router';
const routes = [
    {
        path: '/example', // 路由的路径
        // redirect: '/index',
        name: '', // 路由的名称
        component: () => import('../views/example/index.vue'), // 路由的组件
    },
   
];

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
    history: createWebHashHistory(), // 内部提供了 history 模式的实现，这里使用 hash 模式
    routes, // `routes: routes` 的缩写
});
export default router;
