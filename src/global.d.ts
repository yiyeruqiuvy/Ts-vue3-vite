/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2025-04-23 16:36:10
 * @LastEditors: peiqf
 * @LastEditTime: 2025-04-23 16:38:57
 */
// global.d.ts

// 声明类型
declare module '@/common/gis/js/cesium-method.js' {
  export default class CesiumMethod {
    initMap(containerId: string): void
    loadTDTImageryLayer(option: any): void
    loadArcgisImageryLayer(option: any, callBack: any): void
    viewerChange(coordinate: any): void
    addWaterAndBridge(): void
    initCesiumMap(regionCode: string, isRepeat?: boolean): void
    AddClamptoGroundPolygon(
      coordinates: number[],
      rotation: number,
      image: string
    ): void
    addMapListenr(): void
  }
}
// 声明类型
declare module '@/common/gis/js/cesium-tool/cesium-tool.js' {
  const CesiumTool: any // 根据实际功能替换为具体类型
  export default CesiumTool
}
// src/common/gis/js/cesium-tool/cesium-tool-business.d.ts
declare module '@/common/gis/js/cesium-tool/cesium-tool-business.js' {
  export default class CesiumToolBusiness {
    constructor()
    // 根据实际功能补充方法和属性的类型声明
    addLayerAndOurPoint(instance: any, sceneId: string): void
  }
}
