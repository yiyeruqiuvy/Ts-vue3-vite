/*
 * @Descripttion: cesium地图撒点业务配置方法，交互能力 - 与数据相关
 * @Author: peiqf
 * @Date: 2024-03-18 21:22:02
 * @LastEditors: peiqf
 * @LastEditTime: 2025-04-23 15:36:59
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { merge, debounce } from 'lodash'
import axios from 'axios'
import { commonUtits } from '@/utils/tool.js'

import CesiumTool from './cesium-tool.js'
class CesiumToolBusiness {
  constructor() {
    this.CesiumTool = new CesiumTool()
    // 我们撒点的配置
    this.layerAndOurPointConfig = []
    this.getConfig()
  }

  /**
   * 获取增加图层和撒点的方法配置
   * @return {Promise<void>}
   */
  async getConfig() {
    const res = await commonUtits.getUrlPrefix({
      configCode: 'layerAndOurPonit'
    })
    // debugger
    if (res && res.status === 200) {
      const result = res.data.data.result || {}
      this.layerAndOurPointConfig = JSON.parse(result.configValue || '{}')
    }
  }

  /**
   * 按配置执行方法
   * @param mapOption
   * @param context vue 中调用的上下文 this
   */
  startFn(mapOption, context) {
    // debugger
    if (mapOption) {
      if (mapOption.type === 'ownPoint' && mapOption.fun === 'window') {
        // window[mapOption.funName] &&
        //   window[mapOption.funName](mapOption.param, context)
        this.addPointsByType(mapOption.param, context)
      } else if (mapOption.type === 'ownPoint' && mapOption.fun === 'emit') {
        context.$bus.emit(mapOption.funName, mapOption.params)
      } else {
        // 默认arcgis
        this.addArcgisLayerByOption(mapOption, context)
        // this.CesiumTool.addArcgisLayer(mapOption, context)
      }
    }
  }

  /**
   * 配置 自己撒点暴露的方法  触发 增加图层和撒点方法
   * @param context vue 中调用的上下文 this
   * @param sceneCode 匹配操作配置的场景名称
   */
  addLayerAndOurPoint(context, sceneCode) {
    // debugger
    const mapOption = this.layerAndOurPointConfig[sceneCode]
    if (Array.isArray(mapOption) && mapOption.length) {
      mapOption.forEach((item) => {
        this.startFn(item, context)
      })
      if (mapOption[0].center) {
        const coordinate = {
          isChangeHeight: true,
          lon: mapOption[0].center.longitude,
          lat: mapOption[0].center.latitude,
          h: mapOption[0].center.height
        }
        console.log(coordinate, 'coordinate')
        // 延迟一会重新定位,确认初始定位动作完成
        const timer = setTimeout(() => {
          window.SJCesiumMethod.viewerChange(coordinate)
          clearTimeout(timer)
        }, 2000)
      }
      return
    }
    this.startFn(mapOption, context)
  }

  /**
   * @Descripttion: 配置 的arcgis撒点 方法
   * @param mapOption 配置参数
   * @param context vue 中调用的上下文 this
   * @return {*}
   */

  addArcgisLayerByOption(mapOption, context) {
    let callBack = null
    callBack = {
      clickCallBack: (data) => {
        if (data.name !== 'biankuang') {
          data.modalTitle = data.name + '信息'
          this.handleCallback(data, context)
        }
      }
    }
    this.CesiumTool.addArcgisLayer(mapOption, callBack)
  }

  /**
   * @Descripttion: 桥梁撒点
   * @param {*} typeCode
   * @return {*}
   */

  async addPointsByType(typeCode, context) {
    if (typeCode) {
      // 所有类型撒点
      const resPoint = await commonUtits.getUrlPrefix({
        configCode: 'allTypePoint'
      })
      if (resPoint) {
        const resPointData = JSON.parse(
          resPoint.data.data.result.configValue || '{}'
        )
        // commonUtits.queryPointByType()
        // console.log(resPointData, 'resPointData')
        const typeDataList = resPointData[typeCode] || []
        for (let i = 0; i < typeDataList.length; i++) {
          // 一类型的配置参数，allTypePoint中某一类
          let typeData = typeDataList[i] || {}
          typeData = this.handleTOFData(typeData)
          const exampleData = {
            label: '高楼消防',
            configCode: 'glxf_point',
            isInterface: true,
            interfaceObject: 'queryPointByType',
            modalType: 'EMIT',
            modalObject: 'openFirePointModal',
            isSelect: 'false',
            pointIcon: 'event/1711196109946高楼绿色.png',
            isSelectIcon: '',
            unSelectIcon: '',
            dataConfig: {
              type: 'config',
              configCode: 'glxf_point',
              // type: 'interface',
              interfaceObject: 'queryPointByType',
              // interfaceObject: 'otherinterface',
              interfaceURL: 'statistics/comprehensiveScreen/queryPointByType'
            },
            modalConfig: {
              modalType: 'EMIT',
              modalObject: 'openFirePointModal'
            },
            option: {
              distance: 20000,
              billboard: {
                width: 64,
                height: 100
              }
            }
          }
          // 顶部文字label
          const ifAddText = typeData?.ifAddText ? typeData.ifAddText : false
          // 点击撒点自动定位
          const ifAutoPosition = typeData?.ifAutoPosition
            ? typeData.ifAutoPosition
            : false

          // 数据相关，获取撒点数据
          let data = []
          // ·····························
          // 数据 系统参数配置  新的  兼容老的
          if (!!typeData.dataConfig) {
            // 配置撒点
            if (typeData.dataConfig.type === 'config') {
              const res = await commonUtits.getUrlPrefix({
                configCode: typeData.configCode
              })
              data = JSON.parse(res.data.data.result.configValue || '{}')
            }

            // 接口撒点
            // 两种：1.统一封装接口，2.单独的撒点接口 方法需要封装返回格式，已经返回的字段
            else if (typeData.dataConfig.type === 'interface') {
              // 统一封装接口
              if (typeData.dataConfig.interfaceObject === 'queryPointByType') {
                const res = await commonUtits.queryPointByType({
                  pointType:
                    typeData.configCode || typeData.dataConfig.configCode
                })
                if (res.serviceSuccess) {
                  data = res.data.pointData
                }
              }
              // 单独的撒点接口
              else {
                // debugger
                const res = await commonUtits.getDataByMethod(
                  {
                    // 兼容老的配置
                    pointType:
                      typeData.configCode || typeData.dataConfig.configCode
                  },
                  typeData.dataConfig.interfaceURL
                )
                // 暂定result
                if (res.serviceSuccess) {
                  data = res.data.pointData
                }
              }
            }
          } else {
            //  旧的
            // 根据取到的configCode 查询撒点数据
            const res = await commonUtits.getUrlPrefix({
              configCode: typeData.configCode
            })
            data = JSON.parse(res.data.data.result.configValue || '{}')
            if (typeData?.isInterface) {
              const res1 = await commonUtits.queryPointByType({
                pointType: typeData.configCode
              })
              data = res1.data.pointData
              // 暂时前端处理， 4.1将删掉这个逻辑，后端将数据删除
              // data.forEach((item, idx) => {
              //   // 去掉一个
              //   if (item.name === '城市印象4') {
              //     console.log(item, 'item')
              //     data.splice(idx, 1)
              //   }
              // })
              // data = []

              // return
              // 高楼消防定制化撒点，节约时间就前端直接修改
              // data.for
            }
          }
          // console.log('typeData.iconUrl', typeData)
          const pointClassInfo = {
            // label: typeData.label,
            ...typeData
          }
          let callBack = null

          // 弹窗相关 兼容老的
          // debugger
          if (
            typeData.modalType === 'EMIT' ||
            typeData.modalConfig.modalType === 'EMIT'
          ) {
            callBack = {
              clickCallBack: (data) => {
                const geometry = data.id.geometry
                const modalData = ['曾家岩', '黄花园', '妙泉入口']
                for (let i = 0; i < modalData.length; i++) {
                  if (data.id.pointData?.name.indexOf(modalData[i]) > -1) {
                    context.$bus.$emit('openRiskDetailModal', {
                      data: data.id.pointData,
                      modalTitle: pointClassInfo.label + '详情'
                    })
                    return
                  }
                }
                console.log(data.id.modalData, 'callBackdata')
                context.$bus.$emit(typeData.modalObject, {
                  data: data.id.modalData,
                  modalTitle: pointClassInfo.label + '详情'
                })
                if (
                  data.id.pointData?.ifAutoPosition &&
                  data.id.pointData?.ifAutoPosition === true
                ) {
                  window.SJCesiumMethod.viewerChange({
                    lon: geometry.x,
                    lat: geometry.y
                  })
                } else if (ifAutoPosition) {
                  window.SJCesiumMethod.viewerChange({
                    lon: geometry.x,
                    lat: geometry.y
                  })
                }
              }
            }
          } else if (
            typeData.modalType === 'IFRAME' ||
            typeData.modalConfig.modalType === 'IFRAME'
          ) {
            callBack = {
              clickCallBack: (data) => {
                const geometry = data.id.geometry
                console.log(data.id.modalData, 'callBackdata')
                // this.$bus.$emit(typeData.modalObject, {
                //   data: data.id.modalData,
                //   modalTitle: pointClassInfo.label + '详情'
                // })
                const coordinate = {
                  lat: geometry.y,
                  lon: geometry.x,
                  h: 3000
                }
                // window.SJCesiumMethod.viewerChange(coordinate)
              }
            }
          } else if (
            typeData.modalType === 'EMIT_FXDW' ||
            typeData.modalConfig.modalType === 'EMIT_FXDW'
          ) {
            callBack = {
              clickCallBack: (data) => {
                const geometry = data.id.geometry
                const modalData = ['洪崖洞', '黄花园', '妙泉']
                for (let i = 0; i < modalData.length; i++) {
                  if (data.id.pointData?.name.indexOf(modalData[i]) > -1) {
                    context.$bus.$emit(typeData.modalObject, {
                      data: data.id.pointData,
                      modalTitle: pointClassInfo.label + '详情'
                    })
                  }
                }
                console.log(data.id.pointData, 'callBackdata')

                if (
                  data.id.pointData?.ifAutoPosition &&
                  data.id.pointData?.ifAutoPosition === true
                ) {
                  window.SJCesiumMethod.viewerChange({
                    lon: geometry.x,
                    lat: geometry.y
                  })
                } else if (ifAutoPosition) {
                  window.SJCesiumMethod.viewerChange({
                    lon: geometry.x,
                    lat: geometry.y
                  })
                }
              }
            }
          }
          console.log(data, '撒点数据')
          this.CesiumTool.addBatchPoints(
            pointClassInfo,
            data,
            callBack,
            ifAddText
          )
        }
      }
    }
  }

  /**
   * @Descripttion: 解决this指向问题
   * @param {*} data
   * @return {*}
   */
  handleCallback(data, context) {
    if (data.name === 'biankuang') return
    // debugger
    if (data.name === '郭家沱街道建筑物') {
      context.$bus.$emit('openOneStandard', {
        buildingId: data.data.ID
      })
    } else if (data.name === '气象服务') {
      // 气象服务弹窗
      context.$bus.$emit('openRainfallModal', data)
    } else {
      // 强降雨大屏 弹窗
      // console.log(context.$refs, data, 'context')
      // context.$refs.modal7.openModal({})
      // 弹窗会打开2次，导致弹窗里的判断摄像头失效，暂时不排查，在这边设定类型
      if (
        ['高空瞭望摄像头', '普通摄像头', '无人机', '摄像头'].includes(
          data.data['设备类型']
        )
      ) {
        data.isCamera = true
      } else {
        data.isCamera = false
      }
      context.$bus.$emit('openArcgisModal', data)
    }
  }

  /**
   * @Descripttion: 字符型 true，false转换成布尔型
   * @param {*} data
   * @return {*}
   */
  handleTOFData(data) {
    // debugger
    Object.keys(data).forEach((item) => {
      if (data[item] === 'true') {
        data[item] = true
      } else if (data[item] === 'false') {
        data[item] = false
      }
    })
    return data
  }

  /**
   * @Descripttion: 图例点击转发站 单个 撒点或者清除  这个也许要改到业务封装中
   * @param {*} select 图例数据
   * @return {*}
   */
  clickMapLegend(select) {
    // debugger
    // 撒点
    if (select.isSelect) {
      console.log(select, '撒点')
      if (!!select.catalogueType && select.catalogueType === 'WMS') {
        this.addWmsLayers(select)
      } else if (!!select.catalogueType && select.catalogueType === 'SINGLE') {
        this.addSingleLayers(select)
      } else if (!!select.catalogueType && select.catalogueType === 'IMG') {
        this.addSingleLayer(select)
      } else if (!!select.catalogueType && select.catalogueType === 'POINT') {
        this.switchPointLayer(select)
      } else {
        this.addArcgisLayer(select)
      }
    }
    // 删除
    else {
      console.log(select, '删除')
      // 自己撒点的删除
      if (!!select.catalogueType && select.catalogueType === 'POINT') {
        // 删除
        if (this.pointsList[select.label].length > 0) {
          this.pointsList[select.label].forEach((item) => {
            // console.log('删除撒点',item)
            window.SJCesiumMethod.deleteEntities(item)
          })
        }
      }
      // arcgis撒点的除
      else {
        // 多个
        if (select.children && select.children.length > 0) {
          select.children.forEach((item) => {
            window.SJCesiumMethod.removeArcgisImageryLayer(item.label)
          })
          // 单个
        } else {
          window.SJCesiumMethod.removeArcgisImageryLayer(select.label)
        }
      }
    }

    // this.getEventWarnPoints(this.mapLegendData[0])
  }
}
export default CesiumToolBusiness
