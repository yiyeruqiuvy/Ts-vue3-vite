/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2022-12-21 16:11:06
 * @LastEditors: peiqf
 * @LastEditTime: 2024-04-24 09:53:06
 */
export default [
  {
    name: 'index',
    path: '/',
    component: () => import('@/views/index.vue'),
    children: [
      {
        name: 'title',
        path: '/',
        component: () => import('@/views/section/title.vue'),
      },
      {
        // name: 'title',
        path: 'title',
        component: () => import('@/views/section/title.vue'),
      },
      {
        name: 'button',
        path: 'button',
        component: () => import('@/views/section/button.vue'),
      },
    ],
  },
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
    name: 'echarts', // 路由的名称
    path: '/echarts', // 路由的路径
    // redirect: '/index',

    component: () => import('@/views/echarts.vue'), // 路由的组件
  },

  // {
  //     path: '/e', // 路由的路径
  //     // redirect: '/index',
  //     name: 'echarts', // 路由的名称
  //     component: () => import('@/views/echarts.vue'), // 路由的组件
  // },
];
