/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2022-12-19 15:37:11
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-28 16:34:05
 */
import { createApp } from 'vue';
// import './style.css';

import App from './App.vue';
const app = createApp(App);

// 大屏自适应
import './assets/less/common.less';

// 引入pinia
import { createPinia } from 'pinia';
app.use(createPinia());
// 引入vuerouter
import router from './router/index';
app.use(router);

// import '@/common/types/echarts.d.ts';
// 引入echarts;
import * as echarts from 'echarts/core';
import type {
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  LineSeriesOption,
} from 'echarts/charts';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import type {
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  LegendComponentOption,
  DatasetComponentOption,
  DataZoomComponentOption,
} from 'echarts/components';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  // 数据集组件
  DatasetComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// // 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | DatasetComponentOption
  | DataZoomComponentOption
>;

// // 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

const option: ECOption = {
  // ...
};
// export default option;
// 全局注册echarts类型
app.config.globalProperties.option = option;
// app.config.globalProperties.ECOption = ECOption;
// app.config.globalProperties.foo = 'bar';

// 引入highechart
// import HighchartsVue from 'highcharts-vue';
// import Highchart from 'highcharts/highcharts';
// import * as Highcharts from 'highcharts';

// import highcharts3d from 'highcharts/highcharts-3d';
// import * as Exporting from 'highcharts/modules/exporting';
// Exporting(Highcharts);
// app.use(HighchartsVue);

app.mount('#app');
