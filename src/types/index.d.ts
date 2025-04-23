/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2025-04-23 16:20:45
 * @LastEditors: peiqf
 * @LastEditTime: 2025-04-23 16:54:37
 */
// src/types/index.d.ts
export {}

declare global {
  interface Window {
    jjKey: any // 根据需要指定更具体的类型
    SJCesiumMethod: any // 根据需要指定更具体的类型
    CesiumTool: any
    CesiumToolBusiness: any
  }
}
