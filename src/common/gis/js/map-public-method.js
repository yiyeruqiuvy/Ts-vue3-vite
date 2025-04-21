/*
 * @Author: NIXY
 * @LastEditors: peiqf
 * @Date: 2022-03-25 16:52:41
 * @LastEditTime: 2025-04-21 17:25:23
 * @Description: 地图方法统一入口
 * @FilePath: \cqGit\src\scopes\project\common\utils\gis\uniteApi\map-public-method.js
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import tdtMethod from './tdt-method';
import gdMethod from './gd-method';
import MapboxMethod from './mapbox-method';
import CesiumMethod from './cesium-method.js';
import MapboxTool from '@/common/gis/js/busEvents.js';

export default {
  map: null, // 地图对象
  mapType: 'gd', // 地图种类 tdt: 天地图  gd: 高德地图  bd：百度地图 mapbox:mapbox地图 cesium cesium的三维地图
  MapboxMethod: null,
  defaultLayers: ['area', 'sonArea'], // 天地图默认layers
  attributes: {
    // 地图自有属性 记录地图初始化属性 （天地图： 图层等。缩放级别，中心点 等）
    layers: {} // 地图图层索引
  },
  /**
   * 添加地图
   * @param {String} mapType 地图类型
   *    tdt: 天地图类型
   *    gd: 高德地图类型
   *    bd: 百度地图类型
   *    mapbox: mapbox地图类型
   * @param {String} domId： 地图容器id
   * @param {String} baseMapType：地图加载底图类型,
   * cesium地图中这个参数用来当做window挂载对象
   *   天地图字段格式为：
   *           底图提供商加横线连接地图类型（矢量，影像） eg: tdt-yx :标识天地图影像  tdt-sl:标识天地图矢量
   *   高德底图字段格式为：
   *           矢量地图： 不需要传参
   *           影像底图： yx
   *           道路底图： lw
   *           影像叠路网： yxlw
   * @param {Object} option: 地图初始化相关配置  具体配置内容参考具体地图api  主要用于高德等地图的个性化配置
   */
  loadMap(mapType, domId, baseMapType, option = {}, isTrans, mapMathod) {
    this.MapboxMethod = new MapboxMethod();
    // debugger
    this.mapType = mapType; // 设置地图种类
    // if (this.mapType === 'cesium') {
    //   let CesiumMap = null
    // }
    switch (this.mapType) {
      case 'tdt':
        this.map = tdtMethod.loadMap(domId, baseMapType);
        break;
      case 'gd':
        this.map = gdMethod.loadMap(domId, baseMapType, option);
        break;
      case 'bd':
        break;
      case 'mapbox':
        this.map = this.MapboxMethod.loadMap(domId, option, baseMapType);
        // window[baseMapType] = this.map
        if (mapMathod) {
          window[mapMathod].MapboxTool = new MapboxTool(mapMathod);
        }

        break;
      case 'cesium':
        // 三维地图实例不能存在data中,不然灰常卡
        window[baseMapType] = new CesiumMethod();
        // cesiumMap.initMap(domId)
        this.map = window[baseMapType].initMap(domId, isTrans);
        // this.map = cesiumMethod.initMap(domId)
        break;
    }
    return this.map;
  },
  /**
   * 添加掩模地图
   * @param {String} mapType 地图类型
   *    tdt: 天地图类型
   *    gd: 高德地图类型
   * @param {String} domId： 地图容器id
   * @param {String} baseMapType：地图加载底图类型
   *   高德底图字段格式为：
   *           矢量地图： 不需要传参
   *           影像底图： yx
   *           道路底图： lw
   *           影像叠路网： yxlw
   * @param {Object} option: 地图初始化相关配置  具体配置内容参考具体地图api  主要用于高德等地图的个性化配置
   * @param {Array} sets 地图掩模型 经纬度范围 eg[[[经度，纬度],[经度，纬度]]]
   */
  loadMeshMap(mapType, domId, baseMapType, option = {}, sets) {
    this.mapType = mapType; // 设置地图种类
    switch (this.mapType) {
      case 'tdt':
        break;
      case 'gd':
        this.map = gdMethod.loadMeshMap(domId, baseMapType, option, sets);
        break;
      case 'bd':
        break;
      case 'mapbox':
        break;
    }
    return this.map;
  },

  /**
   * 地图属性初始化
   * @param {array} layers 地图图层数组
   * 天地图初始化的时候需要 声明图层
   */
  initLayers(layers) {
    switch (this.mapType) {
      case 'tdt': // 天地图初始化图层信息等
        tdtMethod.addLayers([...this.defaultLayers, ...(layers || [])]); // 添加图层 返回图层键值对
        break;
      case 'gd': // 高德地图初始化（暂无）
        break;
      case 'bd': // 百度地图初始化（暂无）
        break;
      case 'mapbox': // mapbox地图初始化（暂无）
        break;
    }
  },

  /**
   * @Descripttion: 添加3D地图包含模型，影像，地形
   * @param {*} option url地址
   * 三维模型TilesLayer，
   * 影像ImageryLayer，
   * 地形terrainLayer
   * @return {*}
   */
  Add3DScene(option) {
    switch (this.mapType) {
      case 'mapbox': // 暂无
        break;
      case 'cesium':
        this.map.Add3DScene(option);
        break;
    }
  },

  /**
   * 添加点位
   * @param {String} layerCode 点位类型
   * @param {Object} info
   *        longitude: 经度 latitude:纬度
   *        layerCode: 点位类型编码
   *        tdt: layerCode: 必传
   * @param {Object} callBack
   *    clickCallBack 鼠标点击事件回调
   *    mousemoveCallBack 鼠标悬浮事件回调
   *    mouseoutCallBack 鼠标移除事件回调
   *  @param {Object} option 点位样式配置
   *        anchor: 布局方式(默认 bottom-center)
   *        offset: 定位布局偏移（Array） [0,0] 表示不偏移
   *        clickable： 点位是否可以点击(高德专有)
   */
  addOverlay(layerCode, info, callBack, option) {
    switch (this.mapType) {
      case 'tdt':
        tdtMethod.addOverlay(layerCode, info, callBack, option);
        break;
      case 'gd':
        gdMethod.addMarker(layerCode, info, callBack, option);
        break;
      case 'bd':
        break;
      case 'mapbox':
        this.MapboxMethod.addMarker(layerCode, info, callBack, option);
        break;
    }
  },
  /**
   * 添加自定义传入html的信息体
   * @param {String}
   * @param {Object} info
   *        longitude: 经度 latitude:纬度
   *        layerCode: 点位类型编码 必传
   * @param {String} domStr 自定传入的dom string
   * @param {Object} callBack
   *   clickCallBack 点位点击事件回调
   *   mousemoveCallBack 点位鼠标悬浮事件回调
   *   mouseoutCallBack 点位鼠标移出事件回调
   @param {Object} option 点位样式配置
   *        anchor: 布局方式(默认 bottom-center)
   *        offset: 定位布局偏移（Array） [0,0] 表示不偏移
   *        clickable： 点位是否可以点击(高德专有)
   */
  addCustomOverlay(layerCode, info, domStr, callBack, option) {
    switch (this.mapType) {
      case 'tdt':
        tdtMethod.addCustomOverlay(layerCode, info, domStr, callBack, option);
        break;
      case 'gd':
        gdMethod.addCustomInfo(layerCode, info, domStr, callBack, option);
        break;
      case 'bd':
        break;
      case 'mapbox':
        this.MapboxMethod.addCustomInfo(layerCode, info, domStr, callBack);
        break;
    }
  },
  /**
   *
   * @param {String} layerCode 图层类型
   * @param {Array} pointArr 点位集合
   *       eg: [{longitude:104,latitude:30},]
   * @param {Object} option 线对象配置
   *        ifMove: 是否自动动画回放(--天地图专用)
   *        ifFixed: 是否将线条置于视图中央
   *        showDir: 是否显示箭头(--高德图专用)
   *        dirColor: 箭头颜色(--高德图专用)
   *        strokeColor: 线条颜色
   *        strokeWidth: 线宽
   *        ifFixed: 是否将视图聚焦到当前线段
   * @param {String} sourceId 数据源id--mapbox专用
   * @param {String} Data JSON数据--mapbox专用
   */
  addLine(layerCode, pointArr, option, sourceId, Data) {
    switch (this.mapType) {
      case 'tdt':
        return tdtMethod.addLine(layerCode, pointArr, option);
        break;
      case 'gd':
        return gdMethod.addLine(layerCode, pointArr, option);
        break;
      case 'bd':
        return null;
        break;
      case 'mapbox':
        return this.MapboxMethod.addLine(sourceId, layerCode, Data);
        break;
    }
  },
  /**
   * 添加热力图
   * @param {Array} data 热力图数据集合
   *   item:
   *      longitude: '经度'
   *      lattitude: '纬度'
   *      count：权重 --非必传(高德专用  建议不传)
   * @param {Object} option 热力图配置选项
   *  天地图：
   *     radius：热力图半径
   *       blur：热力图blur
   *  高德：
   *      radius: 热力图半径
   *     opacity: 热力图透明度范围（高德专用）
   * @param {*} id mapbox 专用
   */
  addHeatMap(data, option, id) {
    switch (this.mapType) {
      case 'tdt':
        tdtMethod.addHeatMap(data, option);
        break;
      case 'gd':
        gdMethod.addHeatMap(data, option);
        break;
      case 'bd':
        break;
      case 'mapbox':
        this.MapboxMethod.addHeatLayer(id, data, option);
        break;
    }
  },
  /**
   * 清除点位热力图
   */
  removeHeatMap() {
    switch (this.mapType) {
      case 'tdt':
        tdtMethod.removeHeatMap();
        break;
      case 'gd':
        gdMethod.hideHeatMap();
        break;
      case 'bd':
        break;
      case 'mapbox':
        break;
    }
  },
  /**
   * 添加当前区域范围
   * @param {Object} areaInfo: 外层区域信息  包含区域的名称  编码  经纬度数据
   *   sets: {Array} 经纬度数据   eg：[[经度，纬度],[经度，纬度]]
   * @param {Object} option: 几何图形样式配置
   *  strokeColor: 线条颜色
   *  strokeWidth: 线条宽度
   *      lineDash: 线条虚线程度 eg lineDash:[5]
   *    fillColor: 区域填充颜色
   *     ifFit 是否将视图聚焦到改区域
   *        strokeOpacity： 线透明度 (--高德专有)
   *        fillColor：填充色
   *        fillOpacity：填充透明度 （高德专有）
   *        zIndex: 所处层级 （高德专有 默认10）
   *    ifGcj02: 点位坐标是否是火星坐标
   * @param {Object} callBack
   *   clickCallBack 点位点击事件回调
   *   mousemoveCallBack 点位鼠标悬浮事件回调
   *   mouseoutCallBack 点位鼠标移出事件回调
   * @param {Object} type 图层检索标识
   */
  addPolygon(layerCode, areaInfo, option = {}, callBack) {
    switch (this.mapType) {
      case 'tdt':
        tdtMethod.addPolygon(layerCode, areaInfo, option, callBack);
        break;
      case 'gd':
        gdMethod.addPolygon(layerCode, areaInfo, option, callBack);
        break;
      case 'bd':
        break;
      case 'mapbox':
        this.MapboxMethod.addPolygon(layerCode, option, callBack);
        break;
    }
  },
  /**
   * @name:addPolygonLine
   * 添加区域线
   * @msg:
   * @param {*} type 类型
   * @param {*} option 数据级
   * @return {*}
   */
  addPolygonLine(type, option) {
    switch (this.mapType) {
      case 'tdt':
        break;
      case 'gd':
        break;
      case 'bd':
        break;
      case 'mapbox':
        this.MapboxMethod.addPolygonLine(type, option);
        break;
    }
  },
  /**
   * 添加区域色块
   * @param {Object} areaList: 区域信息数组
   * @param {Object} 区域绘制属性配置
   * 天地图：
   *    strokeColor: 线条颜色
   *    fillColor: 填充颜色
   *    strokeWidth： 线宽
   *  @param {Object} callBack
   *   clickCallBack 点位点击事件回调
   *   mousemoveCallBack 点位鼠标悬浮事件回调
   *   mouseoutCallBack 点位鼠标移出事件回调
   */
  addSmallArea(areaList, callBack) {
    switch (this.mapType) {
      case 'tdt':
        tdtMethod.addSonArea(areaList, callBack);
        break;
      case 'gd':
        gdMethod.addSonArea(areaList, callBack);
        break;
      case 'bd':
        break;
      case 'mapbox':
        break;
    }
  },
  /**
   * 删除地图点位
   * @param {*} layerCode
   */
  async removeMarkers(layerCode) {
    switch (this.mapType) {
      case 'tdt':
        tdtMethod.removeOverlays(layerCode);
        break;
      case 'gd':
        await gdMethod.removeElements(layerCode);
        break;
      case 'bd':
        break;
      case 'mapbox':
        await this.MapboxMethod.removeMarkers(layerCode);
        break;
    }
  },
  /**
   * 删除地图某一个点位
   * @param {String} layerCode 图层
   * @param {String} attributeName 点位属性名称
   * @param {String} value 点位属性值
   */
  async removeOneMarkers(layerCode, attributeName, value) {
    switch (this.mapType) {
      case 'tdt':
        tdtMethod.removeOneOverlays(layerCode, attributeName, value);
        break;
      case 'gd':
        await gdMethod.removeOneElements(layerCode, attributeName, value);
        break;
      case 'bd':
        break;
      case 'mapbox':
        await this.MapboxMethod.removeOneElements(
          layerCode,
          attributeName,
          value
        );
        break;
    }
  },
  // getLayer
  /**
   * 底图清除一类地图元素(区域、结合图层等、等等)
   * @param {String} layer:  指代一种图层类型   bd&gd： 指代待清除对象的索引 mapbox: layerId
   */
  async removeLayer(layer) {
    switch (this.mapType) {
      case 'tdt':
        tdtMethod.removeLayer(layer); // 清空整个图层
        break;
      case 'gd':
        await gdMethod.removeLayer(layer);
        break;
      case 'bd':
        break;
      case 'mapbox':
        await this.MapboxMethod.removeLayer(layer);
        break;
    }
  },
  getLayer(layer) {
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.getLayer(layer);
        break;
    }
  },
  /**
   * 设置地图中心点
   * @param {String/Number} lon 经度
   * @param {String/Number} lat  纬度
   * @param {String/Number} zoom 缩放比例
   */
  setCenter(lon, lat, zoom) {
    switch (this.mapType) {
      case 'tdt':
        tdtMethod.setCenter(lon, lat, zoom);
        break;
      case 'gd':
        gdMethod.setCenter(lon, lat, zoom);
        break;
      case 'bd':
        break;
      case 'mapbox':
        this.MapboxMethod.setCenter(lon, lat, zoom);
        break;
    }
  },
  /**
   * 添加一个椭圆
   * @param {String} layerCode 椭圆图层
   * @param {Object} info 基本信息
   *    longitude: 经度（必填）
   *    latitude: 纬度（必填）
   *       radius: 半径（必填  数字）
   * @param {Object} option 椭圆配置样式
   * strokeColor:  线颜色
   *    strokeOpacity: 线透明度
   *   strokeWeight:  线粗细度
   *  fillColor: 填充颜色
   * fillOpacity: 填充透明度
   *  zIndex: 元素层级（默认10  现在默认20）
   * @param {Object} callBack 回调
   *      clickCallBack 地图元素点击事件回调
   *      mousemoveCallBack 地图元素鼠标悬浮事件回调
   *      mouseoutCallBack 地图元素鼠标移除事件回调
   */
  addCircle(layerCode, info, option, callBack) {
    switch (this.mapType) {
      case 'tdt':
        tdtMethod.addCircle(layerCode, info, option, callBack);
        break;
      case 'gd':
        gdMethod.addCircle(layerCode, info, option, callBack);
        break;
      case 'bd':
        break;
      case 'mapbox':
        break;
    }
  },
  /**
   *
   * @param {String} type 绘制类型
   * @param {Object} option 绘制配置 具体看各个地图的api
   * @param {Object} once 是否一次只绘制一个点（仅针对高德画点
   */
  drawElements(type = 'circle', option, once, callBack) {
    if (option.strokeWeight) {
      option.strokeWidth = option.strokeWeight;
    }
    switch (this.mapType) {
      case 'tdt':
        tdtMethod.drawElementsCustom(type, option, callBack);
        break;
      case 'gd':
        gdMethod.drawElementsCustom(type, option, once, callBack);
        break;
      case 'bd':
        break;
      case 'mapbox':
        break;
    }
  },
  /**
   * 绘制地图圆形对象
   * @param {Object} option 对象样式配置
   * fillColor: 填充颜色
   * strokeColor: 边线颜色
   * fillOpacity: 填充色透明度
   * strokeWidth: 边线宽度
   */
  drawCircle(
    option = {
      fillColor: 'rgba(255,0,0,0.2)',
      strokeColor: 'rgba(255,0,0,0.1)'
    },
    callBack
  ) {
    switch (this.mapType) {
      case 'tdt':
        this.drawElements('Circle', option, callBack);
        break;
      case 'gd':
        this.drawElements('circle', option, callBack);
        break;
      case 'bd':
        break;
      case 'mapbox':
        break;
    }
  },
  /**
   * 关闭圆形区域绘制功能
   */
  closeDrawCircle() {
    switch (this.mapType) {
      case 'tdt':
        tdtMethod.drawElementsClose();
        break;
      case 'gd':
        gdMethod.drawElementsClose();
        break;
      case 'bd':
        break;
      case 'mapbox':
        break;
    }
  },
  /**
   * 删除绘制的圆形
   */
  removeDrawCircleElement() {
    switch (this.mapType) {
      case 'tdt':
        tdtMethod.removeLayer('draw');
        break;
      case 'gd':
        gdMethod.removeElements('drawcircle');
        break;
      case 'bd':
        break;
      case 'mapbox':
        break;
    }
  },
  /**
   * 获取所有的地图上的元素类型
   */
  getAllLayerCode() {
    let obj = {};
    switch (this.mapType) {
      case 'tdt':
        obj = tdtMethod.getAllLayerCode();
        break;
      case 'gd':
        obj = gdMethod.getAllLayerCode();
        break;
      case 'bd':
        break;
      case 'mapbox':
        break;
    }
    return obj;
  },
  /**
   * 获取区域中心
   * points： 区域线点位集合
   */
  getCenterOfArea(points) {
    let center = null;
    switch (this.mapType) {
      case 'tdt':
        center = tdtMethod.getCenterOfArea(points);
        break;
      case 'gd':
        center = gdMethod.getCenterOfArea(points);
        break;
      case 'bd':
        break;
      case 'mapbox':
        break;
    }
    return center;
  },
  /**
   * @name:
   * @msg:获取区域中心
   * @param {*} areaCode 区域编码
   * @return {*} 区域外接矩形范围
   */
  getCenterByCode(areaCode) {
    let center = null;
    switch (this.mapType) {
      case 'mapbox':
        center = this.MapboxMethod.getCenterByCode(areaCode);
        break;
    }
    return center;
  },
  /**
   * @name: fitBoundsByCode
   * @test:通过areaCode 将地图视角定位到某个区域
   * @param {*} areaCode 区域编码
   * @param {*} t 参数地图放大修正参数 number，实际是修改经纬度坐标
   * @param {*} isCq 是否是定位到重庆,接口不支持查询重庆的外接坐标数据
   */
  fitBoundsByCode(areaCode, t, isCq) {
    // debugger
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.fitBoundsByCode(areaCode, t, isCq);
        break;
      default:
        break;
    }
  },
  /**
   * @msg:加载地图默认数据源 -- mapbox专有
   * @return {*}
   */
  addSource() {
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.addSource();
        break;

      default:
        break;
    }
  },
  /**
   * @name: addHoverLayers
   * 添加高亮图层（黄色）步骤1
   * @param {*} id :图层id
   * @param {*} callBack : 点击事件回调
   * @return {*}
   */
  addHoverLayers(id, callBack) {
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.addHoverLayers(id, callBack);
        break;

      default:
        break;
    }
  },
  /**
   * @name: setFilter
   * 添加高亮图层（黄色）移入选中 步骤2
   * @param {*} id 图层id
   * @param {*} option :参数
   * @return {*}
   */
  setFilter(id, option) {
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.setFilter(id, option);
        break;

      default:
        break;
    }
  },
  /**
   * @name: removeSource
   * @msg: 删除资源 --mapbox专用
   * @param {*} id
   * @return {*}
   */
  removeSource(id) {
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.removeSource(id);
        break;
      default:
        break;
    }
  },
  /**
   * @name: deleteMouseTool
   * @msg:  关闭地图工具-修改鼠标状态
   * @param {*} domId
   * @return {*}
   */
  deleteMouseTool(domId) {
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.deleteMouseTool(domId);
        break;
      default:
        break;
    }
  },
  /**
   * @name: setPoint
   * @msg: 添加点
   * @param {*} domId
   * @return {*}
   */
  setPoint(domId) {
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.setPoint(domId);
        break;
      default:
        break;
    }
  },
  /**
   * @name: setLine
   * @test: test font
   * @msg:
   * @param {*} points
   * @param {*} lineMove
   * @param {*} line
   * @return {*}
   */
  setLine(points, lineMove, line) {
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.setLine(points, lineMove, line);
        break;
      default:
        break;
    }
  },
  /**
   * @name: setArea
   * @test: test font
   * @msg:
   * @param {*} pointsArea
   * @param {*} lineArea
   * @param {*} lineAreaStroke
   * @return {*}
   */
  setArea(pointsArea, lineArea, lineAreaStroke) {
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.setArea(pointsArea, lineArea, lineAreaStroke);
        break;
      default:
        break;
    }
  },
  /**
   * @name: addTheLayer
   * @msg: 添加一个带图片的图层
   * @param {*} type 类型
   * @param {*} callBack 回调方法
   * @return {*}
   */
  addTheLayer(type, callBack) {
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.addTheLayer(type, callBack);
        break;
      default:
        break;
    }
  },
  /**
   * @name: setZoom
   * @msg:  缩放地图
   * @param {*} zoom
   * @return {*}
   */
  setZoom(zoom) {
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.setZoom(zoom);
        break;
      default:
        break;
    }
  },
  /**
   * @Descripttion: 修改地图定位
   * @param {*} bounds
   * @return {*}
   */
  fitBounds(bounds) {
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.fitBounds(bounds);
        break;
      default:
        break;
    }
  },

  /**
   * @Descripttion: 双击监听
   * @param {*} areaInfo
   * @param {*} callBack
   * @return {*}
   */
  dblclickListenrr(areaInfo, callBack, callBack2) {
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.dblclickListenrr(areaInfo, callBack, callBack2);
        break;
      default:
        break;
    }
  },
  /**
   * @Descripttion: 获取地图实例
   * @return {*}
   */
  getMap() {
    switch (this.mapType) {
      case 'mapbox':
        return this.MapboxMethod.getMap();
        break;
      default:
        break;
    }
  },
  /**
   * @Descripttion: 设置地图仰角
   * @return {*}
   */
  setPitch(pitch) {
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.setPitch(pitch);
        break;
      default:
        break;
    }
  },
  /**
   * @Descripttion: 设置自定义图层
   * @return {*}
   */
  addCustomLayer(layerConfig, layerId) {
    switch (this.mapType) {
      case 'mapbox':
        this.MapboxMethod.addCustomLayer(layerConfig, layerId);
        break;
      default:
        break;
    }
  }
};
