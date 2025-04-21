/*
 * @Author: NIXY
 * @LastEditors: peiqf
 * @Date: 2022-04-15 13:33:30
 * @LastEditTime: 2025-04-21 17:33:26
 * @Description: 高德地图方法组件
 * @FilePath: \cqGit\src\scopes\project\common\utils\gis\uniteApi\gd-method.js
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import gpsObj from './gpsObj';
export default {
  map: null, // 地图对象
  satelliteLayer: null, // 卫星图层
  roadNetLayer: null, // 路网图层
  heatmap: null, // 热力图对象
  mouseMoveElement: null, // 地图元素鼠标悬浮的对象
  clickElement: null, // 地图元素鼠标点击的对象
  // trafficLayer: null ,// 实时交通
  /**
   * 地图点位存储
   * 数据构成
   * mapElements: {key:array}  key：一类地图元素的索引（比如点位 几何图形  线条等等）。 array: 地图元素对象的合计
   */
  mapElements: {},
  /**
   * 地图非点位存储
   */
  mapLayerElements: {
    // （比如点位 几何图形  线条等等）
  },
  /**
   * 加载地图
   * @param {String} domId 地图容器id
   * @param {String} baseMapType 高德地图类型
   * @param {Object} option 高德地图类型
   *    viewMode:   (2D,3D)  地图视图模式, 默认为‘2D’，可选’3D’，选择‘3D’会显示 3D 地图效果。
   *    pitch:      俯仰角度，默认 0，最大值根据地图当前 zoom 级别不断增大，2D地图下无效 。
   *    rotation:   地图顺时针旋转角度，取值范围 [0-360] ，默认值：0
   *    features :  设置地图上显示的元素种类, 支持'bg'（地图背景）、'point'（POI点）、'road'（道路）、'building'（建筑物）
   *    mapStyle :  设置地图的显示样式，目前支持两种地图样式： 第一种：自定义地图样式，如 "amap://styles/d6bf8c1d69cea9f5c696185ad4ac4c86" 可前往地图自定义平台定制自己的个性地图样式； 第二种：官方样式模版,如"amap://styles/grey"。 其他模版样式及自定义地图的使用说明见开发指南
   *    showBuildingBlock :是否展示地图 3D 楼块，默认 true
   *    skyColor :  天空颜色，3D 模式下带有俯仰角时会显示
   *    center:     初始中心经纬度
   *    zoom :      地图显示的缩放级别，可以设置为浮点数；
   *    opacity 路网图层的透明度
   */
  loadMap(
    domId,
    baseMapType,
    option = { features: ['bg', 'road'], viewMode: '2D', opacity: 1 }
  ) {
    let layers = [];
    this.satelliteLayer = new AMap.TileLayer.Satellite({
      rejectMapMask: false
    });
    this.roadNetLayer = new AMap.TileLayer.RoadNet({ opacity: option.opacity });
    // // 实时路况图层
    // this.trafficLayer = new AMap.TileLayer.Traffic({
    //   zIndex: 10,
    //   zooms: [7, 22],
    //   opacity: option.opacity
    // })
    if (baseMapType === 'yx') {
      // 加载影像图层
      layers = [this.satelliteLayer];
    } else if (baseMapType === 'lw') {
      // 记载路网图层
      layers = [this.roadNetLayer];
    } else if (baseMapType === 'yxlw') {
      // 加载影像和路网图层
      layers = [this.satelliteLayer, this.roadNetLayer];
    }
    this.map = new AMap.Map(domId, {
      ...option,
      layers
    });
    // this.trafficLayer.setMap(this.map);
    // 批量添加图层
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
  async loadMeshMap(domId, baseMapType, option, sets) {
    const disCountry = new AMap.TileLayer({ zIndex: 0, rejectMapMask: true });
    let layers = [];
    this.satelliteLayer = new AMap.TileLayer.Satellite();
    this.roadNetLayer = new AMap.TileLayer.RoadNet();
    if (baseMapType === 'yx') {
      // 加载影像图层
      layers = [disCountry, this.satelliteLayer];
    } else if (baseMapType === 'lw') {
      // 记载路网图层
      layers = [this.roadNetLayer];
    } else if (baseMapType === 'yxlw') {
      // 加载影像和路网图层
      layers = [this.satelliteLayer, this.roadNetLayer];
    }

    let mask = [];
    sets[0].forEach((item) => {
      const newLonlat = gpsObj.gcj_encrypt(item[1] - 0, item[0] - 0);
      mask.push([newLonlat.lon, newLonlat.lat]);
    });
    mask = [mask];
    this.map = new AMap.Map(domId, {
      mask: mask,
      viewMode: '3D',
      pitch: 35, // 地图俯仰角度，有效范围 0 度- 83 度
      ...option,
      layers
    });

    const object3Dlayer = new AMap.Object3DLayer({ zIndex: 1 });
    this.map.add(object3Dlayer);

    const meshObj = new AMap.Object3D.Mesh();
    const geometry = meshObj.geometry; // 创建之后获取geometry
    for (let i = 1; i < mask[0].length; i++) {
      if (i === 1) {
        const lnglat1 = new AMap.LngLat(mask[0][i - 1][0], mask[0][i - 1][1]);
        const lnglat2 = new AMap.LngLat(mask[0][i][0], mask[0][i][1]);
        const v0xy = this.map.lngLatToGeodeticCoord(lnglat1);
        const v1xy = this.map.lngLatToGeodeticCoord(lnglat2);

        const z = option.zNumber || 10000; // 3D地图Z方
        geometry.vertices.push(v0xy.x, v0xy.y, 0); // V0
        geometry.vertices.push(v1xy.x, v1xy.y, 0); // V1
        geometry.vertices.push(v0xy.x, v0xy.y, z); // V3
        geometry.vertices.push(v1xy.x, v1xy.y, z); // V2
      } else {
        const lnglat2 = new AMap.LngLat(mask[0][i][0], mask[0][i][1]);
        const v1xy = this.map.lngLatToGeodeticCoord(lnglat2);

        const z = option.zNumber || 10000; // 3D地图Z方
        geometry.vertices.push(v1xy.x, v1xy.y, 0); // V1
        geometry.vertices.push(v1xy.x, v1xy.y, z); // V2
      }

      if (i === 1) {
        geometry.faces.push(0, 1, 3);
        geometry.faces.push(1, 2, 3);
      } else if (i === 2) {
        geometry.faces.push(1, 4, 2);
        geometry.faces.push(4, 5, 2);
      } else if (i === mask[0].length) {
        geometry.faces.push(2 * i - 2, 0, 2 * i - 1);
        geometry.faces.push(0, 3, 2 * i - 1);
      } else {
        geometry.faces.push(2 * i - 2, 2 * i, 2 * i - 1);
        geometry.faces.push(2 * i, 2 * i + 1, 2 * i - 1);
      }
      const topColor = option.topColor || [0, 1, 1, 0.7];
      const bottomColor = option.topColor || [0, 0, 1, 0.3];
      geometry.vertexColors.push(...topColor); // 顶部
      geometry.vertexColors.push(...bottomColor); // 底部颜色
      geometry.vertexColors.push(...topColor); // 顶部颜色
      geometry.vertexColors.push(...bottomColor); // 底部颜色
    }
    meshObj.backOrFront = 'both'; // 'back'、'front'、'both'
    meshObj.transparent = true;

    object3Dlayer.add(meshObj);
  },
  /**
   * 添加点位
   * @param {String} layerCode 点位类型
   * @param {Object} info 点位信息
   *        longitude: 经度 latitude:纬度
   *        layerCode: 点位类型编码
   * @param {Object} callBack
   *    clickCallBack 点位点击事件回调
   *    mousemoveCallBack 点位鼠标悬浮事件回调
   *    movseoutCallBack 点位鼠标移出事件回调
   * @param {Object} option 点位样式配置
   *        anchor: 布局方式(默认 bottom-center)
   *        offset: 定位布局偏移（Array） [0,0] 表示不偏移
   *        clickable： 点位是否可以点击
   */
  async addMarker(layerCode, info, callBack, option = { offset: [0, 0] }) {
    const markerStr = `<div class="marker-box dom-marker ${layerCode} ${
      info.gisId ? info.gisId : ''
    }" >
        <div class="img-bg-bot"></div>
        </div>
    </div>`;
    const lonlat = await this.changeW84([
      [info.longitude - 0, info.latitude - 0]
    ]);
    const marker = new AMap.Marker({
      position: lonlat[0],
      content: markerStr,
      /*  animation: info.animation || 'AMAP_ANIMATION_BOUNCE', */
      clickable: option.clickable || true,
      cursor: 'pointer',
      anchor: option.anchor || 'bottom-center',
      offset: new AMap.Pixel(...option.offset),
      topWhenClick: true,
      raiseOnDrag: true,
      extData: info
    });
    if (this.mapElements[layerCode]) {
      this.mapElements[layerCode].push(marker);
    } else {
      this.mapElements[layerCode] = [marker];
    }
    this.map.add(marker);
    if (callBack) {
      this.elementsListen(marker, callBack);
    }
  },
  /**
   * 添加点位
   * @param {String} layerCode 点位类型
   * @param {Object} info 点位信息
   *        longitude: 经度 latitude:纬度
   *        layerCode: 点位类型编码
   *        name: 点位名称
   *        animation： 点位点击动画类型
   *
   * @param {String} domStr
   *   自定义添加marker
   * @param {Object} callBack
   *    clickCallBack 点位点击事件回调
   *    mousemoveCallBack 点位鼠标悬浮事件回调
   *    movseoutCallBack 点位鼠标移出事件回调
   * @param {Object} option
   *   anchor：图片布局方式
   * clickable： 点位是否可以点击
   */
  async addCustomInfo(layerCode, info, domStr, callBack, option = {}) {
    const lonlat = await this.changeW84([
      [info.longitude - 0, info.latitude - 0]
    ]);
    const marker = new AMap.Marker({
      position: lonlat[0],
      content: domStr,
      /*  animation: info.animation || 'AMAP_ANIMATION_BOUNCE', */
      clickable: option.clickable || true,
      cursor: 'pointer',
      anchor: option.anchor || 'bottom-center',
      offset: new AMap.Pixel(0, 0),
      topWhenClick: true,
      raiseOnDrag: true,
      extData: info
    });
    if (this.mapElements[layerCode]) {
      this.mapElements[layerCode].push(marker);
    } else {
      this.mapElements[layerCode] = [marker];
    }
    this.map.add(marker);
    if (callBack) {
      this.elementsListen(marker, callBack);
    }
  },
  /**
   *
   * @param {String} layerCode 线段对象获取索引值
   * @param {Array} list 线段数据集合
   *       item:   longitude: 经度  latitude: 纬度
   *       eg: [{longitude:104,latitude:30},]
   * @param {Object} option 线段相关配置
   *      showDir: 是否显示箭头
   *     dirColor: 箭头颜色
   *  strokeColor: 线条颜色
   * strokeWidth: 线宽
   *   ifFixed: 是否将视图聚焦到当前线段
   */
  async addLine(layerCode, list, option = {}) {
    if (list.length > 0) {
      const path = [];
      list.forEach((item) => {
        if (item.longitude || item.latitude) {
          path.push([item.longitude, item.latitude]);
        }
      });
      const newPath = await this.changeW84(path);
      const polyline = new AMap.Polyline({
        path: newPath, // 设置线覆盖物路径
        showDir: option.showDir || true, // 是否显示箭头
        dirColor: option.dirColor || 'red', // 箭头颜色
        strokeColor: option.strokeColor || '#fff', // 线颜色
        strokeWeight: option.strokeWidth || 4 // 线宽
      });
      this.map.add(polyline);
      if (option.ifFixed) {
        this.map.setFitView(polyline);
      }
      if (this.mapLayerElements[layerCode]) {
        this.mapLayerElements[layerCode].push(polyline);
      } else {
        this.mapLayerElements[layerCode] = [polyline];
      }
    }
  },
  /**
   *
   * @param {Array} data 热力图数据
   *   item:
   *      longitude: '经度'
   *      latitude: '纬度'
   *      count：权重
   * @param {Object} option 热力图配置选项
   *     radius: 热力图半径
   *     opacity: 热力图透明度范围
   */
  addHeatMap(data, option = {}) {
    const heatData = [];
    if (data.length > 0) {
      data.forEach((item) => {
        if (item.longitude && item.latitude) {
          heatData.push({
            lng: item.longitude,
            lat: item.latitude,
            count: item.count || 10
          });
        }
      });
    }
    const isSupportCanvas = () => {
      const elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    };
    if (!isSupportCanvas()) {
      console.log(
        '热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~'
      );
      return false;
    }
    if (!this.headmap) {
      this.map.plugin(['AMap.Heatmap'], () => {
        // 初始化heatmap对象
        this.heatmap = new AMap.Heatmap(this.map, {
          radius: option.radius || 25, // 给定半径
          opacity: option.opacity || [0, 1]
          /*,
            gradient:{
                0.5: 'blue',
                0.65: 'rgb(117,211,248)',
                0.7: 'rgb(0, 255, 0)',
                0.9: '#ffea00',
                1.0: 'red'
            }
             */
        });
      });
    }
    this.heatmap.setDataSet({
      data: heatData,
      max: 100
    });
    this.heatmap.show();
  },
  /**
   * 清除heatmap
   */
  hideHeatMap() {
    if (this.heatmap) {
      this.heatmap.hide();
    }
  },
  /**
   * @param {Object} elements 地图元素
   * @param {Object} callBack 回调函数
   *      clickCallBack 地图元素点击事件回调
   *      mousemoveCallBack 地图元素鼠标悬浮事件回调
   *      mouseoutCallBack 地图元素鼠标移除事件回调
   */
  elementsListen(elements, callBack = {}) {
    elements.off('click').on('click', (e) => {
      // 获取elements暂存信息
      const info = e.target.getExtData();
      const pixel = e.pixel;
      const text =
        '您在 [ ' +
        e.lnglat.getLng() +
        ',' +
        e.lnglat.getLat() +
        ' ] 的位置双击了地图！';
      console.log(text);
      if (callBack.clickCallBack) callBack.clickCallBack(info, pixel, elements);
    });
    elements.off('mousemove').on('mousemove', (e) => {
      // 获取elements暂存信息
      const info = e.target.getExtData();
      const pixel = e.pixel;
      if (callBack.mousemoveCallBack)
        callBack.mousemoveCallBack(info, pixel, elements);
    });
    elements.off('mouseover').on('mouseover', (e) => {
      // 获取elements暂存信息
      const info = e.target.getExtData();
      const pixel = e.pixel;
      if (callBack.mouseoverCallBack)
        callBack.mouseoverCallBack(info, pixel, elements);
    });
    elements.off('mouseout').on('mouseout', (e) => {
      // 获取elements暂存信息
      const info = e.target.getExtData();
      const pixel = e.pixel;
      if (callBack.mouseoutCallBack)
        callBack.mouseoutCallBack(info, pixel, elements);
    });
  },
  /**
   * 删除某一类型d地图元素
   * @param {String} type 地图点位索引
   */
  async removeElements(type) {
    if (this.mapElements[type]) {
      this.mapElements[type].forEach((item) => {
        this.map.remove(item);
      });
      this.mapElements[type] = [];
    } else {
      console.log('该地图元素并未正确存储在mapElements');
    }
  },
  /**
   * 删除某一个d地图元素
   * @param {String} type 地图点位索引
   * @param {String} attributeName 地图点位属性名称
   * @param {String} value 地图点位属性值
   */
  async removeOneElements(type, attributeName, value) {
    if (this.mapElements[type]) {
      this.mapElements[type].forEach((item, index) => {
        if (item[attributeName] === value) {
          this.map.remove(item);
          this.mapElements[type].splice(index, 1);
        }
      });
    } else {
      console.log('该地图元素并未正确存储在mapElements');
    }
  },
  /**
   * 删除某一类型d地图元素  线段、几何图形等
   * @param {String} type 地图点位索引
   */
  async removeLayer(type) {
    if (this.mapLayerElements[type]) {
      this.mapLayerElements[type].forEach((item) => {
        this.map.remove(item);
      });
      this.mapLayerElements[type] = [];
    } else {
      console.log('该地图元素并未正确存储在mapLayerElements');
    }
  },
  /**
   * @param {String} type 地图元素暂存数组的索引
   * @param {String} filterAttr 删除地图元素的标识属性
   * @param {String} attrValue 删除地图元素的标识属性
   */
  removeOneElement(type, filterAttr, filterValue) {
    if (this.mapElements[type]) {
      const index = this.mapElements[type].findIndex((item) => {
        return item.getExtData()[filterAttr] === filterValue;
      });
      this.map.remove(this.mapElements[type][index]);
      this.mapElements[type].splice(index, 1);
    } else {
      console.log('该地图元素并未正确存储在mapElements');
    }
  },
  /**
   * @param {String} type 地图元素暂存数组的索引
   * @param {String} filterAttr 删除地图元素的标识属性
   * @param {String} attrValue 删除地图元素的标识属性
   */
  removeOneLayerElement(type, filterAttr, filterValue) {
    if (this.mapLayerElements[type]) {
      const index = this.mapLayerElements[type].findIndex((item) => {
        return item.getExtData()[filterAttr] === filterValue;
      });
      this.map.remove(this.mapLayerElements[type][index]);
      this.mapLayerElements[type].splice(index, 1);
    } else {
      console.log('该地图元素并未正确存储在mapLayerElements');
    }
  },
  /**
   * 添加几何图形
   * @param {String} layerCode
   * @param {Object} info
   *        polygonArr ：线条数据二维数组
   *        eg[[经度，纬度]]
   * @param {Object} option:  几何图形样式配置
   * strokeColor: 线条颜色
   *        strokeOpacity： 线透明度
   *        strokeWidth
   *        fillColor：填充色
   *        fillOpacity：填充透明度
   *         isFit: 是否将几何图形置于视图中央
   *        zIndex: 几何对象处于的层级  默认10  数值越大越靠上层
   *        ifGcj02: 点位坐标是否是火星坐标
   * @param {Object} callBack: 回调函数
   *      clickCallBack 地图元素点击事件回调
   *      mousemoveCallBack 地图元素鼠标悬浮事件回调
   *      mouseoutCallBack 地图元素鼠标移除事件回调
   */
  async addPolygon(layerCode, info, option = {}, callBack) {
    let lonlatArr = info.sets;
    if (!option.ifGcj02) {
      lonlatArr = await this.changeW84(info.sets);
    }
    const polygon = new AMap.Polygon({
      path: lonlatArr, // 设置多边形边界路径
      strokeColor: option.strokeColor || '#f00', // 线颜色
      strokeOpacity: option.strokeOpacity || 1, // 线透明度
      strokeWeight: option.strokeWidth || 3, // 线宽
      strokeStyle:
        option.lineDash && option.lineDash[0] - 0 > 1 ? 'dashed' : 'solid',
      fillColor: option.fillColor || 'rgba(0,0,0,0)', // 填充色
      fillOpacity: option.fillOpacity || 1, // 填充透明度
      extData: info,
      zIndex: option.zIndex || 10
    });

    if (this.mapLayerElements[layerCode]) {
      this.mapLayerElements[layerCode].push(polygon);
    } else {
      this.mapLayerElements[layerCode] = [polygon];
    }
    if (callBack) {
      this.elementsListen(polygon, callBack);
    }
    this.map.add(polygon);
    if (option.isFit) {
      this.map.setFitView(polygon);
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
   *   strokeWidth:  线粗细度
   *  fillColor: 填充颜色
   * fillOpacity: 填充透明度
   * zIndex: 元素层级（默认10  现在默认20）
   * @param {Object} callBack 回调
   *      clickCallBack 地图元素点击事件回调
   *      mousemoveCallBack 地图元素鼠标悬浮事件回调
   *      mouseoutCallBack 地图元素鼠标移除事件回调
   */
  async addCircle(layerCode, info, option, callBack) {
    if (!info || !info.longitude || !info.latitude) {
      console.log('经纬度不存在');
      return false;
    }
    if (!info.radius || typeof info.radius !== 'number') {
      console.log('请输入半径');
      return false;
    }
    // 构造矢量圆形
    const lonlatArr = await this.changeW84([
      [info.longitude - 0, info.latitude - 0]
    ]);
    const circle = new AMap.Circle({
      center: lonlatArr[0], // 圆心位置
      radius: info.radius || 1000, // 半径
      strokeColor: option.strokeColor || '#F33', // 线颜色
      strokeOpacity: option.strokeOpacity || 1, // 线透明度
      strokeWeight: option.strokeWidth || 1, // 线粗细度
      fillColor: option.fillColor || '#ee2200', // 填充颜色
      fillOpacity: option.fillOpacity || 1, // 填充透明度
      zIndex: 20,
      extData: info
    });
    if (this.mapLayerElements[layerCode]) {
      this.mapLayerElements[layerCode].push(circle);
    } else {
      this.mapLayerElements[layerCode] = [circle];
    }
    this.map.add(circle);
    this.map.setFitView(circle);
    if (callBack) {
      this.elementsListen(circle, callBack);
    }
  },
  /**
   *
   * @param {Array} areaList 区域信息数组
   * @param {Object} callBack 回调函数
   *   clickCallBack 鼠标事件点击回调
   *   mousemoveCallBack 鼠标事件悬浮回调
   *   movseoutCallBack 鼠标事件移除回调
   */
  async addSonArea(areaList, callBack) {
    const layerCode = 'sonArea';
    const colorSon = [
      '#66a0ff',
      '#30c2ff',
      '#5357ff',
      '#e153ff',
      '#43de52',
      '#48f4e2',
      '#ff4071',
      '#3ef48b',
      '#8a44ff',
      '#ffca29',
      '#f5f365',
      '#ff58be',
      '#ffae44',
      '#ff8e57'
    ];
    if (areaList?.length > 0) {
      areaList.forEach((item, index) => {
        const info = {
          name: item.areaName,
          level: item.areaLevel,
          code: item.areaCode,
          parentWidth: 2,
          lineDash: [5],
          type: 'sonArea',
          ...item
        };

        let arraySet = [];
        if (Array.isArray(item.sets)) {
          arraySet = item.sets;
        } else {
          arraySet = JSON.parse(item.sets)[0];
        }
        info.sets = arraySet;
        const option = {
          fillOpacity: 0.6,
          strokeColor: item.strokeColor || item.fillColor || colorSon[index],
          fillColor: item.fillColor || colorSon[index],
          strokeWidth: item.strokeWidth || 2,
          lineDash: item.lineDash || [1]
        };
        this.addPolygon(layerCode, info, option, callBack);
      });
    }
  },
  /**
   *
   * @param {String} type 鼠标绘制类型
   * marker( options：MarkerOptions) 开启鼠标画点标注模式。鼠标在地图上单击绘制点标注，标注样式参考MarkerOptions设置
   * polyline( options：PolylineOptions) 开启鼠标画折线模式。鼠标在地图上点击绘制折线，鼠标左键双击或右键单击结束绘制，折线样式参考PolylineOptions设置
   * polygon( options：PolygonOptions) 开启鼠标画多边形模式。鼠标在地图上单击开始绘制多边形，鼠标左键双击或右键单击结束当前多边形的绘制，多边形样式参考PolygonOptions设置
   * rectangle( options：PolygonOptions) 开启鼠标画矩形模式。鼠标在地图上拉框即可绘制相应的矩形。矩形样式参考PolygonOptions设置
   * circle( options：CircleOptions) 开启鼠标画圆模式。鼠标在地图上拖动绘制相应的圆形。圆形样式参考CircleOptions设置
   * rule( options：PolylineOptions) 开启距离量测模式。鼠标在地图上单击绘制量测节点，并计算显示两两节点之间的距离，鼠标左键双击或右键单击结束当前量测操作。量测线样式参考 PolylineOptions 设置
   * 注：不能同时使用rule方法和RangTool插件进行距离量测
   * measureArea( options：PolygonOptions) 开启面积量测模式。鼠标在地图上单击绘制量测区域，鼠标左键双击或右键单击结束当前量测操作，并显示本次量测结果。量测面样式参考PolygonOptions设置
   * rectZoomIn( options：PolygonOptions) 开启鼠标拉框放大模式。鼠标可在地图上拉框放大地图。矩形框样式参考PolygonOptions设置
   * rectZoomOut( options：PolygonOptions) 开启鼠标拉框缩小模式。鼠标可在地图上拉框缩小地图。矩形框样式参考PolygonOptions设置
   * @param {String} once 每次绘制是否清空（目前只针对点位
   * @returns
   */
  drawElementsCustom(type, option = {}, once, callBack) {
    const _this = this;
    let elementsType = type === 'marker' ? 'mapElements' : 'mapLayerElements';
    let removeElementsFunc =
      type === 'marker' ? 'removeElements' : 'removeLayer';
    if (!this.mousetool) {
      this.map.plugin(['AMap.MouseTool'], function () {
        _this.mousetool = new AMap.MouseTool(_this.map);
      });
    }
    this.mousetool[type](option);
    if (this[elementsType]['draw' + type]) {
      this[removeElementsFunc]('draw' + type);
    }
    _this.mousetool.on('draw', function (e) {
      // 添加事件
      if (once) {
        _this[removeElementsFunc]('draw' + type);
      }
      if (_this[elementsType]['draw' + type]) {
        _this[elementsType]['draw' + type].push(e.obj);
      } else {
        _this[elementsType]['draw' + type] = [e.obj];
      }
      if (callBack) {
        if (type === 'circle') {
          const center = e.obj.getCenter();
          const radius = e.obj.getRadius();
          const location = gpsObj.gcj_decrypt_exact(center.lat, center.lng);
          callBack(e.obj, {
            center: { longitude: location.lon, latitude: location.lat },
            radius
          });
        } else if (type === 'marker') {
          const position = e.obj.getPosition();
          const location = gpsObj.gcj_decrypt_exact(position.lat, position.lng);
          const list = _this.mapElements;
          callBack(location, list);
        } else if (type === 'polyline') {
          const pathgd = e.obj.getPath();
          let path = pathgd.map((v) => {
            return gpsObj.gcj_decrypt_exact(v.lat, v.lng);
          });
          callBack(path);
        } else if (type === 'polygon') {
          const pathgd = e.obj.getPath();
          let path = pathgd.map((v) => {
            return gpsObj.gcj_decrypt_exact(v.lat, v.lng);
          });
          callBack(path);
        }
      }
    });
  },
  /**
   * 清除鼠标绘制工具
   */
  drawElementsClose(type) {
    if (this.mousetool) {
      this.mousetool.close();
      this.mousetool = null;
    }
  },

  /**
   * 设置地图中心点
   * @param {str/num} lon 经度
   * @param {str/num} lat 纬度
   * @param {str/num} zoom 缩放比例
   */
  async setCenter(lon, lat, zoom) {
    if (lon && lat) {
      if (zoom) {
        this.map.setZoomAndCenter(zoom, [lon, lat]); // 同时设置地图层级与中心点
      } else {
        this.map.setCenter([lon, lat]); // 设置地图中心点
      }
    } else {
      console.log('经纬度不存在请传入经纬度');
    }
  },
  /**
   * 将84坐标 转换成高德坐标
   * @param {Array} lonlatArr [[longitude,latitude],[longitude,latitude]]
   */
  async changeW84(lonlatArr) {
    const mask = [];
    lonlatArr.forEach((item) => {
      const newLonlat = gpsObj.gcj_encrypt(item[1] - 0, item[0] - 0);
      mask.push([newLonlat.lon, newLonlat.lat]);
    });
    return mask;

    /*  return new Promise((resolve, reject) => {
      if (lonlatArr) {
        AMap.convertFrom(lonlatArr, 'gps', (status, result) => {
          if (result.info === 'ok') {
            const lnglats = result.locations // Array.<LngLat>
            resolve(lnglats)
          }
        })
      }
    }) */
  },
  /**
   * 获取所有的地图上的元素类型
   */
  getAllLayerCode() {
    const result = {
      elements: Object.keys(this.mapElements),
      layers: Object.keys(this.mapLayerElements)
    };
    return result;
  }
};
