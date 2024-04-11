/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2022-12-19 16:09:52
 * @LastEditors: peiqf
 * @LastEditTime: 2022-12-21 16:13:24
 */
import { createWebHashHistory, createRouter } from 'vue-router';
import routes from './routes';
// const routes = [
//     {
//         path: '/', // 路由的路径
//         // redirect: '/index',
//         name: 'index', // 路由的名称
//         component: () => import('../views/index.vue'), // 路由的组件
//     },
//     // {
//     //     path: '/index',
//     //     name: 'index',
//     //     component: () => import('../views/index.vue'),
//     // },
// ];

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
    history: createWebHashHistory(), // 内部提供了 history 模式的实现，这里使用 hash 模式
    routes, // `routes: routes` 的缩写
});
export default router;
