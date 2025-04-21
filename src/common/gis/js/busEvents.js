/**
 * @Author: wangyh wangyh@yinhai.com
 * @Date: 2024-03-30 21:27
 * @LastEditors: wangyh wangyh@yinhai.com
 * @LastEditTime: 2024-03-30 21:27
 * @FilePath: busTypes
 * @Description: 地图bus
 */

const PREFIX = 'widescreen_sj_map_module_'

export const MAP_BUS_EVENTS = {
  // 根据指标显示重庆3d地图5色图
  INDEX_CQ_3D_AREA_COLOR: 'index_cq_3d_area_color',
  // 点击重庆3d地图区县
  CLICK_CQ_3D_AREA: 'click_cq_3d_area',
}
// 添加前缀防重复
Object.keys(MAP_BUS_EVENTS).forEach(k => {
  MAP_BUS_EVENTS[k] = PREFIX + MAP_BUS_EVENTS[k]
})

export function bindBus (vm, event, callBack) {
  if (event) {
    vm.$bus.on(event, callBack)
    vm.$once('hook:beforeDestroy', () => this.$bus.off(event, callBack))
  }
}

export default MAP_BUS_EVENTS
