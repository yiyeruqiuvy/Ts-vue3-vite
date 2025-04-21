/*
 * @Descripttion: cesium基础组件能力
 * @Author: peiqf
 * @Date: 2024-03-18 20:25:05
 * @LastEditors: peiqf
 * @LastEditTime: 2025-03-17 17:43:40
 */

import { merge, debounce } from 'lodash';
import axios from 'axios';
import faceConfig from 'faceConfig';
import { commonUtits } from '@/scopes/project/bigScreenMapbox/common/utils/tool.js';
import API from '@/scopes/project/cesiumMap/modulePart/cesiumMap/api/index.js';
import $ from 'jquery';
import MAP_BUS_EVENTS from '@/scopes/project/wideScreen/modulePart/components/sjMapModule/consts/busEvents';
import Vue from 'vue';
import API2 from '@/scopes/project/bigScreenMapbox/modulePart/situationAwareness/modulePart/components/cityPlateScreenCom/supervisionEvaluation/api/index.js';

class MapboxTool {
  constructor(mapboxMapMethod) {
    this.mapboxMapMethod = mapboxMapMethod; //         window[this.mapboxMapMethod].MapboxMethod.overlays
    console.log(mapboxMapMethod, 'this.mapboxMapMethod');
    // 数据映射
    this.textMappColor = {
      高: 'rgba(199, 84, 84, 0.64)',
      较高: 'rgba(185, 140, 85, 0.8)',
      中: 'rgba(237, 220, 77, 0.6)',
      较低: 'rgba(65, 134, 195, 0.7)',
      低: 'rgba(64, 147, 100, 0.64)',
      其他: 'rgba(69, 207, 129, 0.9)',
      异常: 'rgba(65, 134, 195, 0.7)'
    };
    this.delExceptLayerCode = [
      'areaCenterName',
      '南岸区',
      '大渡口区',
      '江北区',
      '沙坪坝区',
      '高新区'
    ];
    this.fiveColorMapFlag = false;
    this.fiveColorMapData = [];

    // this.pointsList = {} // 自己撒点的数据集合 用作删除，通过label来辨识
    // this.selectedPoints = {} // 撒点的种类结合，包含所有已撒点信息，图标等   window.MapboxTool.selectedPoints  通过这个方法暴露
  }

  /**
   * @Descripttion: 批量撒点
   * @param {*} points 撒点的配置数据 包含撒点图标和图例
   *  {
          longitude: '106.50014042714167',
          latitude: '29.54269255710681',
        },
   * @param {*} layerCode 地图撒点的一类点位，目前用中文label,用来做监听点击打开弹窗的一类判定
         '自定义'
   * @param {*} CallBack  点击点位回调
   * @param {*} isDel  是否删除上一次的
   * @return {*}
   */
  addBatchPoints(layerCode, points, dom, callBack, isDel = true) {
    // 清除
    if (isDel) {
      window[this.mapboxMapMethod].removeMarkers(layerCode); // majorEvent
    }
    // 接受一个数组
    if (points.constructor === Array && points.length > 0) {
      points.forEach(item => {
        // 必填参数
        // item = {
        //   longitude: '',
        //   latitude: ''
        // }
        // debugger
        if (!(item.longitude && item.latitude)) return;
        window[this.mapboxMapMethod].addCustomOverlay(
          layerCode,
          item,
          dom,
          callBack
        );
      });
    }
  }

  /**
   * @Descripttion: 单个撒点
   * @param {*} points 撒点的配置数据 包含撒点图标和图例
   *  {
          longitude: '106.50014042714167',
          latitude: '29.54269255710681',
        },
   * @param {*} layerCode 地图撒点的一类点位，目前用中文label,用来做监听点击打开弹窗的一类判定
         '自定义'
   * @param {*} CallBack  点击点位回调
   * @param {*} isDel  是否删除上一次的
   * @return {*}
   */
  addSinglePoint(layerCode, point, dom, callBack, isDel = true) {
    // 清除
    if (isDel) {
      window[this.mapboxMapMethod].removeMarkers(layerCode); // majorEvent
    }
    // 接受一个数组
    if (!(point.longitude && point.latitude)) return;
    window[this.mapboxMapMethod].addCustomOverlay(
      layerCode,
      point,
      dom,
      callBack
    );
  }
  /**
   * @Descripttion: 移除点位
   * @param {*} layerCode
   * @return {*}
   */

  delPointByCode(layerCode) {
    window[this.mapboxMapMethod].removeMarkers(layerCode);
  }

  /**
   * @Descripttion: 删除全部点位
   * @return {*}
   */
  delPointAll() {
    let _Points = [];
    try {
      _Points =
        Object.keys(window[this.mapboxMapMethod].MapboxMethod.overlays) || [];
    } catch (error) {}
    if (_Points.constructor === Array && _Points.length > 0) {
      Object.keys(window[this.mapboxMapMethod].MapboxMethod.overlays).forEach(
        item => {
          if (!this.delExceptLayerCode.includes(item)) {
            this.delPointByCode(item);
          }
        }
      );
    }
  }

  /**
   * @Descripttion:添加五色图
   * @param {*} dataList
   * 数据{
   * adcode:'500228
   * colorField:'较高
   * }
   * @return {*}
   */
  // returnData = res?.data?.data?.data || []
  //         window.sjMapboxMethod.MapboxTool.addFiveColorMap(returnData)
  addFiveColorMap(dataList) {
    console.log(dataList, this.mapboxMapMethod, 'dataList');
    window[this.mapboxMapMethod].removeLayer('qx_polygon');
    window[this.mapboxMapMethod].removeLayer('qx_line');
    window[this.mapboxMapMethod].removeLayer('jd_polygon');
    window[this.mapboxMapMethod].removeLayer('jd_line');
    window[this.mapboxMapMethod].removeLayer('sq_polygon');
    window[this.mapboxMapMethod].removeLayer('sq_line');
    window[this.mapboxMapMethod].removeLayer('wg_polygon');
    window[this.mapboxMapMethod].removeLayer('wg_line');
    window[this.mapboxMapMethod].removeLayer('counties-highlighted');
    const _arr = [];
    if (dataList.constructor === Array && dataList.length > 0) {
      dataList.forEach(item => {
        // 构造五色图数据
        if (item?.adcode && item?.colorField) {
          const color = this.textMappColor[item?.colorField]
            ? this.textMappColor[item?.colorField]
            : this.textMappColor['异常'];
          _arr.push(item.adcode, color);
        }
      });
      // 插入一个构造偶数数据 没区域编码的区显示
      _arr.push('rgba(65, 134, 195, 0.7)');
    }
    // console.log(_arr, '_arr');
    const paint = {
      'fill-color': ['match', ['get', 'code'], ..._arr],
      'fill-opacity': 1
    };
    let _polygon = 'qx_polygon';
    let _line = 'qx_line';
    let _areaCode = '500';
    let _level = '1';
    const filter = [
      'all',
      ['>', ['get', 'code'], _areaCode + '000'],
      ['<', ['get', 'code'], _areaCode + '999'],
      ['==', ['get', 'level'], _level]
    ];
    const _this = window[this.mapboxMapMethod].$sjMap;
    window[this.mapboxMapMethod].removeLayer(_polygon);
    window[this.mapboxMapMethod].removeLayer(_line);
    window[this.mapboxMapMethod].addPolygon(
      _polygon,
      {},
      {
        paint,
        filter
      },
      {
        mousemoveCallBack: _this.sonAreaMousemoveCallBack,
        mouseoutCallBack: (info, pixel) => {
          setTimeout(() => {
            // 判断当鼠标离开当前区域面但是  悬浮的是当前区域面中心点的时候 则不触发mouseout事件
            if (_this.hoverCenterArea !== _this.hoverGisId) {
              _this.areaMouseoutCallBack(info, pixel);
            }
          }, 100);
        },
        clickCallBack: (info, pixel) => {
          // 读取区域图层中的code属性（所属区域编码）
          info.areaCode = info.code;
          _this.getNextArea(info, pixel);
        }
      }
    );
    window[this.mapboxMapMethod].addPolygonLine(_line, {
      filter
    });
    // 五色图标识
    this.fiveColorMapFlag = true;
    this.fiveColorMapData = dataList
    // 加载选中图层
    // if (this.mapCode !== 'paceAndWar') {
    window[this.mapboxMapMethod].addHoverLayers('counties-highlighted', {
      clickCallBack: (info, pixel) => {
        info.areaCode = info.code;
        _this.getNextArea(info, pixel);
      }
    });
  }

  /**
   * @Descripttion: 地图恢复默认状态，取消五色图
   * @return {*}
   */
  addPublicMap() {
    window[this.mapboxMapMethod].$sjMap.addSonArea('black', '4');
    // window.sjMapboxMethod.$sjMap.mapTopNavList
    // window[this.mapboxMapMethod].$sjMap.mapTopNavList
  }

  /**
   * @Descripttion: 获取五色图接口
   * @param {*} item
   * @return {*}
   */
  async queryFiveColorCountAndRisk() {
    const params = {
      areaCode: '50',
      indexCode: '1823537695659642882',
      // nodeName: item.name,
      plateCode: 'qszhpj',
      dimTypes: 'kpi_five_color_dis'
    };
    // debugger
    // 新增参数
    // if (
    //   item.dimTypes &&
    //   item.dimTypes.constructor === Array &&
    //   item.dimTypes.length > 0 &&
    //   item.dimTypes.some(item => item === 'kpi_five_color_dis')
    // ) {
    //   params.dimTypes = 'kpi_five_color_dis'
    // }
    // this.nodeName = params.nodeName
    // this.indexCode = params.indexCode
    let requestUrl = '';
    // if (item.datasourceType === 'STANDARD') {
    //   requestUrl = 'queryFiveColorCountAndRiskNewInterface'
    // } else {
    //   requestUrl = 'queryFiveColorCountAndRisk'
    // }
    requestUrl = 'queryFiveColorCountAndRiskNewInterface';
    let returnData = [];
    let returnInfro = [];
    const res = await API2[requestUrl](params);
    if (res.serviceSuccess) {
      returnData = res?.data?.data?.data || [];
      console.log(returnData, 'returnData');
      // window.dada(returnData)
      this.addFiveColorMap(returnData);
      returnInfro = res?.data?.data?.info || [];
      // 打开弹窗 右边五色图图例 flag: true
      // this.setLegend(item, res)
    }
    // returnData.forEach(item => {
    //   item.areaName = item.name
    //   item.colorValue = item.indexValue
    //   item.count = item.indexValue
    //   item.value = ''
    //   item.lng = this.getLangLat(item.adcode).lng
    //   item.lat = this.getLangLat(item.adcode).lat
    //   item.riskColor = item.colorField
    //   item.iconField = 'kpi'
    // })
    // // 更新图例信息
    // const data = {
    //   nodeName: this.nodeName,
    //   data: returnInfro, // 图例信息
    //   plateData: this.plateData, // 版块信息
    //   returnData // 五色图数据
    // }
    // console.log('fiveColorData', data)
    // // 地图五色图
    // this.$bus.emit(busEvents.CITY_PEACE_SCREEN_BUS_EVENTS.SET_FIVE_MAP, data)
    // // 清除其他撒点
    // window.clearPoint()
    // // kpi撒点
    // this.$bus.$emit('pointKpiMap', returnData)
    // // 打开左边图例
    // this.$bus.$emit('pointListData', {
    //   data: returnData,
    //   boxType: 'fivecolor',
    //   visible: true,
    //   showTitle: this.item.indexName
    // })
  }
}

export default MapboxTool;
