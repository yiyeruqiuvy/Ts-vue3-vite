/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2022-12-21 16:11:06
 * @LastEditors: peiqf
 * @LastEditTime: 2023-01-04 10:46:19
 */
export default [
    // {
    //     // name: 'echarts',
    //     path: '/echarts',
    //     component: () => import('@/views/echarts.vue'),
    // },
    // {
    //     // name: 'echarts',
    //     path: '/',
    //     component: () => import('@/views/echarts'),
    // },
    {
        name: 'highCharts3d',
        path: '/highCharts3d',
        component: () => import('@/views/highCharts3d.vue'),
    },
    {
        name: 'other',
        path: '/other',
        component: () => import('@/views/other.vue'),
    },
    {
        path: '/', // 路由的路径
        // redirect: '/index',
        name: 'echarts', // 路由的名称
        component: () => import('@/views/echarts.vue'), // 路由的组件
    },

    // {
    //     path: '/e', // 路由的路径
    //     // redirect: '/index',
    //     name: 'echarts', // 路由的名称
    //     component: () => import('@/views/echarts.vue'), // 路由的组件
    // },
];
