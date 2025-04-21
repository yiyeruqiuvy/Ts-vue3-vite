/*
 * @Author: NIXY
 * @LastEditors: peiqf
 * @Date: 2023-04-15 11:35:41
 * @LastEditTime: 2024-03-22 19:44:44
 * @Description: desc
 * @FilePath: \cqGit\src\scopes\project\bigScreen\modulePart\situationAwareness\api\index.js
 */

const SCREENPATH = window.faceConfig.basePath
const taskUrl = window.faceConfig.taskUrl
const disPath = window.faceConfig.disPath

export default {
  /**
   * 直接获取完整的URL
   * @
   */
  queryCoverageCount (param) {
    return Base.submit(
      null,
      {
        data: param,
        url: SCREENPATH + '/statistics/coverage/queryCoverageCount',
        withCredentials: false,
      },
      {},
      true
    )
  },
  /**
   * 直接获取完整的URL
   * @
   */
  getSystemJumpUrl (param) {
    return Base.submit(
      null,
      {
        data: param,
        url: SCREENPATH + '/statistics/externalSystemConfig/getSystemJumpUrl',
        withCredentials: false,
      },
      {},
      true
    )
  },
  /**
   * 行政区域撒点
   */
  queryGisAreaInfo(param) {
    return Base.submit(
      null,
      {
        data: param,
        url: SCREENPATH + '/areaCodeRefactor/queryGisAreaInfo',
        withCredentials: false
      },
      {},
      true
    )
  },
  /**
   * 热力图
   */
  queryApiRs(param) {
    return Base.submit(
      null,
      {
        data: param,
        url: SCREENPATH + '/statistics/situationAwareness/queryApiRs',
        withCredentials: false
      },
      {},
      true
    )
  },
  // 第三方链接
  queryExternalApplicationLinkNew(param) {
    return Base.submit(
      null,
      {
        data: param,
        url:
          SCREENPATH +
          '/statistics/externalSystemConfig/queryExternalApplicationLinkNew',
        withCredentials: false,
        autoQs: false
      },
      {},
      true
    )
  },
  /**
   * 页面动态加载大屏的配置化管理功能
   * @param {*} param   countyBigScreen
   * @returns
   */
  queryModuleConfig(param) {
    return Base.submit(
      null,
      {
        data: param,
        url: SCREENPATH + '/statistics/externalSystemConfig/queryModuleConfig',
        withCredentials: false
      },
      {},
      true
    )
  },
  /**
   * 驾驶仓整体接入配置功能
   * @param {*} param   areaCode   screenCode
   */
  queryExternalCockpit(param) {
    return Base.submit(
      null,
      {
        data: param,
        url:
          SCREENPATH + '/statistics/externalSystemConfig/queryExternalCockpit',
        withCredentials: false
      },
      {},
      true
    )
  },

  // 修改数据

  /**
   * 事件任务大屏撒点  区县事件统计
   * @param {*} param   areaCode   screenCode
   */
  getDTCountyEventNum(param) {
    return Base.submit(
      null,
      {
        data: param,
        url: 'statistics/eventTask/getDTCountyEventNum',
        withCredentials: false
      },
      {},
      true
    )
  },
  /**
   * 事件任务大屏撒点 镇街事件位置点位
   * @param {*} param   areaCode   screenCode
   */
  queryStreetEventLocation(param) {
    return Base.submit(
      null,
      {
        data: param,
        url: 'statistics/eventTask/queryStreetEventLocation',
        withCredentials: false
      },
      {},
      true
    )
  },
  // 任务单 第一层级
  countyMap(params) {
    return Base.submit(
      null,
      {
        url: taskUrl + '/OD/taskScreen/countyMap',
        withCredentials: false,
        data: params,
        showPageLoading: false
      },
      {},
      true
    )
  },
  // 任务单 第二层级
  townMap(params) {
    return Base.submit(
      null,
      {
        url: taskUrl + '/OD/taskScreen/townMap',
        withCredentials: false,
        data: params,
        showPageLoading: false
      },
      {},
      true
    )
  },
  /**
   * 地图事件列表
   * @param {*} param   areaCode areaLevel
   */
  queryMapEventList(param) {
    return Base.submit(
      null,
      {
        data: param,
        url: '/statistics/jiulongpoeventtask/queryMapEventList',
        withCredentials: false
      },
      {},
      true
    )
  },
  /**
   * 地图地址列表
   * @param {*} param   areaCode areaLevel
   */
  getAreaCascadeList(param) {
    return Base.submit(
      null,
      {
        data: param,
        url: '/areaCode/getAreaCascadeList',
        withCredentials: false
      },
      {},
      true
    )
  },
  /**
   * 重大事件单撒点
   * @param {*} param   areaCode areaLevel
   */
  queryMajorEvent(param) {
    return Base.submit(
      null,
      {
        data: param,
        url: '/statistics/eventTask/queryMajorEvent',
        withCredentials: false,
        showPageLoading: false
      },
      {},
      true
    )
  },
  /**
   * 重大事件单聚合
   * @param {*} param   areaCode areaLevel
   */
  queryAreaMajorEvent(param) {
    return Base.submit(
      null,
      {
        data: param,
        url: '/statistics/eventTask/queryAreaMajorEvent ',
        withCredentials: false,
        showPageLoading: false
      },
      {},
      true
    )
  },
  // 驾驶舱指标管理 --- 新接口
  queryNewIndexsysIndexList(params) {
    return Base.submit(
      null,
      {
        url: 'statistics/newIndex/queryNewIndexsysIndexList',
        withCredentials: false,
        data: params,
        showPageLoading: false
      },
      {},
      true
    )
  },

  // 水管事件列表接口
  queryEventListByEventType(params) {
    return Base.submit(
      null,
      {
        url: 'statistics/situationAwareness/queryEventListByEventType',
        withCredentials: false,
        data: params,
        showPageLoading: false
      },
      {},
      true
    )
  },
  // 水管事件最新接口
  queryEventByNew(params) {
    return Base.submit(
      null,
      {
        url: 'statistics/situationAwareness/queryEventByNew',
        withCredentials: false,
        data: params,
        showPageLoading: false
      },
      {},
      true
    )
  },
  /**
   * 查询感知的图例树形 新
   */
  queryLotDeviceLayerTree(data) {
    return Base.submit(null, {
      url: disPath + '/dispatch/dailyScreen/queryLotDeviceLayerTree',
      data
    })
  },
  /**
   * 查询感知的图例树形 旧的
   */
  queryResourcePicTree(data) {
    return Base.submit(null, {
      url: disPath + '/dispatch/dailyScreen/queryResourcePicTree',
      data
    })
  },
  /**
   * @Descripttion: 获取感知设备接口
   * @param {*} params
   * @return {*}
   */
  querySginScreenData(params) {
    return Base.submit(
      null,
      {
        url: '/statistics/sginscreen/querySginScreenData',
        withCredentials: false,
        data: params,
        showPageLoading: false
      },
      {},
      true
    )
  },
  /**
   * @Descripttion:  渝中告警的接口，包含监测指标
   * @param {*} params
   * @return {*}
   */
  queryWarnList(params) {
    return Base.submit(
      null,
      {
        url: '/statistics/sginscreen/queryWarnList',
        withCredentials: false,
        data: params,
        showPageLoading: false
      },
      {},
      true
    )
  },
  /**
   * @Descripttion:  渝中告警的接口，包含监测指标
   * @param {*} params
   * @return {*}
   */
  getHourRainImgNew(params) {
    return Base.submit(
      null,
      {
        url: '/cityOneChart/warnInfo/getHourRainImgNew',
        withCredentials: false,
        data: params,
        showPageLoading: false
      },
      {},
      true
    )
  },
  /**
   * @Descripttion: 查询图层
   * @param {*} params
   * @return {*}
   */
  queryAllCoverageByType(params) {
    return Base.submit(
      null,
      {
        url: '/statistics/coverage/queryAllCoverageByType',
        withCredentials: false,
        data: params,
        showPageLoading: false
      },
      {},
      true
    )
  },

  /**
   * @Descripttion: 跟据父级id查询
   * @param {*} params
   * @return {*}
   */
  queryCoverageByParentId(params) {
    return Base.submit(
      null,
      {
        url: '/statistics/coverage/queryCoverageByParentId',
        withCredentials: false,
        data: params,
        showPageLoading: false
      },
      {},
      true
    )
  },
  /**
   * @Descripttion: 消防站撒点
   * @param {*} params
   * @return {*}
   */
  queryTollStationInfo(params) {
    return Base.submit(
      null,
      {
        url: '/statistics/comprehensiveScreen/queryTollStationInfo',
        withCredentials: false,
        data: params,
        showPageLoading: false
      },
      {},
      true
    )
  },
  /**
   * 查询实时路况撒点信息
   * @param {*} params
   * @returns
   */
  queryWideScreenIndex(params) {
    return Base.submit(
      null,
      {
        url: '/statistics/newIndex/queryWideScreenIndex',
        withCredentials: false,
        data: params
      },
      {},
      true
    )
  },
  /**
   * 查询实时路况指标撒点详情
   * @param {*} params
   * @returns
   */
  queryIndexDims(params) {
    return Base.submit(
      null,
      {
        url: '/statistics/newIndex/queryIndexDims',
        withCredentials: false,
        data: params
      },
      {},
      true
    )
  },
  /**
   * 根据指标名查询撒点数据
   * @param {*} params
   * @returns
   */
  queryCountyMapIndex(params) {
    return Base.submit(
      null,
      {
        url: '/statistics/comprehensiveScreen/queryCountyMapIndex',
        withCredentials: false,
        data: params
      },
      {},
      true
    )
  }
}
