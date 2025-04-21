/*
 * @Author: NIXY
 * @LastEditors: peiqf
 * @Date: 2022-03-25 16:52:41
 * @LastEditTime: 2025-04-21 17:32:14
 * @Description: desc
 * @FilePath: \cqGit\src\scopes\project\common\utils\gis\uniteApi\tdt-method.js
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { transform, fromLonLat, toLonLat } from 'ol/proj';
// 点位加载方法
import markerObj from '@/scopes/project/common/utils/gis/olMap/markerObj';
// 线加载方法
import OrbitObj from '@/scopes/project/common/utils/gis/olMap/orbitObj';
// 区域封装方法
import AreaObj from '@/scopes/project/common/utils/gis/olMap/areaObjNew';
// 热力图
import HeatMapObj from '@/scopes/project/common/utils/gis/olMap/heatMapObj';

import { Circle } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { boundingExtent, getCenter } from 'ol/extent';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Fill, Stroke, Icon } from 'ol/style';
import Overlay from 'ol/Overlay';
import Draw from 'ol/interaction/Draw';
// 地图封装方法
import LoadMap from '@/scopes/project/common/utils/gis/olMap/loadMap.js';

const areaApi = new AreaObj();

export default {
  map: null,
  overlays: {}, // overlays 对象集合
  mapLayers: [],
  layers: ['area', 'sonArea'],
  mapApi: null,
  orbitObj: null, // 底图构造轨迹对象
  heatMapObj: null, // 地图热力图对象
  drawTool: null, // 几何图形绘制组件
  /**
   * 添加地图容器
   * @param {String} domId 地图容器id
   * @param {String} baseMapType 地图类型
   * @returns 地图对象
   */
  loadMap(domId, baseMapType = 'tdt') {
    this.mapApi = new LoadMap(domId);
    this.map = this.mapApi.init();
    this.mapApi.load(...baseMapType.split('-'));
    this.orbitObj = new OrbitObj(this.map);
    return this.map;
  },
  /**
   * 添加底图图层
   * @param {Array} layers
   *   图层名称数组
   *   添加图层后将添加的图层保存到 mapLayers 对象中  方便获取
   */
  addLayers(layers) {
    const layersObj = {};
    layers.forEach((item) => {
      layersObj[item] = new VectorLayer({
        source: new VectorSource(),
        className: item + ''
      });
    });

    Object.values(layersObj).forEach((item) => {
      this.map.addLayer(item);
    });
    Object.assign(this.mapLayers, layersObj);
  },
  /**
   * 添加点位
   * @param {String} layerCode 点位类型
   * @param {Object} info 点位信息
   *        longitude: 经度 latitude:纬度
   *        layerCode: 点位类型编码
   * @param {Object} callBack
   *  clickCallBack 点位点击事件回调
   *  mousemoveCallBack 点位鼠标悬浮事件回调
   *  mouseoutCallBack 点位鼠标移出事件回调
   * @param {Object} option 点位样式配置
   *        anchor: 布局方式(默认 bottom-center)
   *        offset: 定位布局偏移（Array） [0,0] 表示不偏移
   */
  addOverlay(layerCode, info, callBack, option = {}) {
    const pos = fromLonLat([info.longitude, info.latitude]);
    const dom = document.createElement('div');
    const markerStr = `<div class="marker-box dom-marker marker-${layerCode} ${layerCode} ${
      info.gisId ? info.gisId : ''
    }">
        <div class="img-bg-bot"></div>
        </div>
    </div>`;
    info.layerCode = layerCode;
    dom.innerHTML = markerStr;
    const marker = new Overlay({
      position: pos,
      positioning: option.anchor || 'bottom-center',
      element: dom,
      offset: option.offset || [0, 0],
      className: 'overlay-' + layerCode,
      stopEvent: false
    });
    marker.attributes = info;

    if (callBack?.clickCallBack) {
      dom.addEventListener('click', (e) => {
        // 获取marker暂存信息
        const info = marker.attributes;
        const { x, y } = e;
        callBack.clickCallBack(info, { x, y }, e.target);
      });
    }
    if (callBack?.mousemoveCallBack) {
      dom.addEventListener('mousemove', (e) => {
        // 获取marker暂存信息
        const info = marker.attributes;
        const { x, y } = e;
        callBack.mousemoveCallBack(info, { x, y }, e.target);
      });
    }
    if (callBack?.mouseoutCallBack) {
      dom.addEventListener('mouseout', (e) => {
        // 获取marker暂存信息
        const info = marker.attributes;
        const { x, y } = e;
        callBack.mouseoutCallBack(info, { x, y }, e.target);
      });
    }
    this.map.addOverlay(marker);
    if (this.overlays[layerCode]) {
      this.overlays[layerCode].push(marker);
    } else {
      this.overlays[layerCode] = [marker];
    }
  },
  /**
   * 添加点位
   * @param {String} layerCode 点位类型
   * @param {Object} info 点位信息
   *        longitude: 经度 latitude:纬度
   *        layerCode: 点位类型编码
   * @param {Object} callBack
   *   clickCallBack 点位点击事件回调
   *   mousemoveCallBack 点位鼠标悬浮事件回调
   *   mouseoutCallBack 点位鼠标移出事件回调
   * @param {Object} option 点位样式配置
   *        anchor: 布局方式(默认 bottom-center)
   *        offset: 定位布局偏移（Array） [0,0] 表示不偏移
   */
  addCustomOverlay(layerCode, info, markerStr, callBack, option = {}) {
    info.layerCode = layerCode;
    const pos = fromLonLat([info.longitude, info.latitude]);
    const dom = document.createElement('div');
    if (!markerStr) {
      markerStr = `<div class="marker-box dom-marker ${layerCode}">
        <div class="img-bg-bot"></div>
        </div>
    </div>`;
    }
    dom.innerHTML = markerStr;
    const marker = new Overlay({
      position: pos,
      positioning: option.anchor || 'bottom-center',
      offset: option.offset || [0, 0],
      element: dom,
      className: 'overlay-' + layerCode,
      stopEvent: false
    });
    marker.attributes = info;

    if (callBack?.clickCallBack) {
      dom.addEventListener('click', (e) => {
        // 获取marker暂存信息
        const info = marker.attributes;
        const { x, y } = e;
        callBack.clickCallBack(info, { x, y }, e.target);
      });
    }
    if (callBack?.mousemoveCallBack) {
      dom.addEventListener('mousemove', (e) => {
        // 获取marker暂存信息
        const info = marker.attributes;
        const { x, y } = e;
        callBack.mousemoveCallBack(info, { x, y }, e.target);
      });
    }
    if (callBack?.mouseoutCallBack) {
      dom.addEventListener('mouseout', (e) => {
        // 获取marker暂存信息
        const info = marker.attributes;
        const { x, y } = e;
        callBack.mouseoutCallBack(info, { x, y }, e.target);
      });
    }
    this.map.addOverlay(marker);
    if (this.overlays[layerCode]) {
      this.overlays[layerCode].push(marker);
    } else {
      this.overlays[layerCode] = [marker];
    }
  },
  /**
   * 添加一几何范围图形
   * @param  {String} layerCode 图层名称
   * @param {Object} areaInfo 区域信息 必须包含参数经纬度 longitude latitude
   * @param {Object} option 区域几何的配置信息
   *  strokeColor: 线条颜色
   *  strokeWidth: 线条宽度
   *      lineDash: 线条虚线程度 lineDash:[5]
   *    fillColor: 区域填充颜色
   *     ifFit 是否将视图聚焦到改区域
   * @param {Object} callBack
   *   clickCallBack 点位点击事件回调
   *   mousemoveCallBack 点位鼠标悬浮事件回调
   *   mouseoutCallBack 点位鼠标移出事件回调
   */
  addPolygon(
    layerCode,
    areaInfo,
    option = { strokeColor: '#f00', lineDash: [1] },
    callBack
  ) {
    if (!this.ifInitLayer(layerCode)) {
      this.addLayers([layerCode]);
    }
    const info = {
      name: areaInfo.areaName,
      id: areaInfo.areaCode,
      code: areaInfo.areaCode,
      level: areaInfo.areaLevel,
      layerCode: layerCode
    };
    let sets = [];
    if (Array.isArray(areaInfo.sets)) {
      sets = areaInfo.sets;
    } else {
      sets = JSON.parse(areaInfo.sets)[0];
    }
    info.sets = sets;
    const feature = areaApi.addArea(
      this.mapLayers[layerCode],
      sets,
      info,
      option
    );
    if (option?.isFit) {
      this.map.getView().fit(feature.getGeometry().getExtent());
    }
    if (callBack) {
      this.mapListen(layerCode, callBack);
    }
  },
  /**
   * 判断是否初始化图层
   * @param {String} layerCode  图层
   * @returns Boolean
   */
  ifInitLayer(layerCode) {
    const layers = this.map.getLayers().array_;
    const index = layers.findIndex((item) => {
      return item.className_ === layerCode;
    });

    if (index > -1) {
      return true;
    }
    return false;
  },
  /**
   * 添加多个子区域
   *  @param {Array} areaList 子区域列表
   *      item: 中需要含有sets 字段（经纬度范围字段）
   *  @param {Object} callBack
   *   clickCallBack 点位点击事件回调
   *   mousemoveCallBack 点位鼠标悬浮事件回调
   *   mouseoutCallBack 点位鼠标移出事件回调
   */
  addSonArea(areaList, callBack) {
    if (areaList?.length > 0) {
      areaList.forEach((item, index) => {
        const info = {
          name: item.areaName,
          level: item.areaLevel,
          id: item.areaCode,
          code: item.areaCode,
          type: 'sonArea',
          layerCode: 'sonArea',
          ...item
        };
        const option = {};
        if (item.fillColor) {
          option.fillColor = item.fillColor;
        }
        if (item.strokeColor) {
          option.strokeColor = item.strokeColor;
        }
        if (item.strokeWidth) {
          option.strokeWidth = item.strokeWidth;
        }
        if (item.lineDash) {
          option.lineDash = item.lineDash;
        }
        let sets = [];
        if (Array.isArray(item.sets)) {
          sets = item.sets;
        } else {
          sets = JSON.parse(item.sets)[0];
        }
        areaApi.addArea(this.mapLayers.sonArea, sets, info, option);
      });
    }
    if (callBack) {
      this.mapListen('sonArea', callBack);
    }
  },
  /**
   * 地图鼠标事件监听
   * @param {String} layerCode
   * @param {Object} callBack
   *    clickCallBack 鼠标点击事件回调
   *    mousemoveCallBack 鼠标悬浮事件回调
   *    mouseoutCallBack 鼠标移除事件回调
   */
  mapListen(layerCode, callBack = {}) {
    const that = this;
    that.map.on('pointermove', function (evt) {
      const pixel = that.map.getEventPixel(evt.originalEvent);
      const feature = that.map.forEachFeatureAtPixel(
        pixel,
        function (feature, layer) {
          return feature;
        }
      );
      let attributes = {};
      let newPixel = {};

      if (feature && feature.attributes) {
        attributes = feature.attributes;
        newPixel = { x: pixel[0], y: pixel[1] };
        if (callBack.mousemoveCallBack && attributes.layerCode === layerCode)
          callBack.mousemoveCallBack(attributes, newPixel, feature);
      } else {
        if (callBack.mouseoutCallBack)
          callBack.mouseoutCallBack(attributes, newPixel, feature);
      }
    });
    that.map.on('singleclick', function (evt) {
      const pixel = that.map.getEventPixel(evt.originalEvent);
      const feature = that.map.forEachFeatureAtPixel(
        pixel,
        function (feature, layer) {
          return feature;
        }
      );
      let attributes = {};
      let newPixel = {};

      if (feature && feature.attributes) {
        attributes = feature.attributes;
        newPixel = { x: pixel[0], y: pixel[1] };
      }
      if (callBack.clickCallBack && attributes.layerCode === layerCode)
        callBack.clickCallBack(attributes, newPixel, feature);
    });
  },
  /**
   * 添加线段
   * @param {String} layerCode 图层
   * @param {Array} list 线段集合
   *      longitude: 经度
   *      latitude: 纬度
   *       eg: [{longitude:104,latitude:30},]
   * @param {Object} option
   *      color: 线段颜色
   *      width: 线段宽度
   *      patrolLength: 动画调用 移动动画调用时间间隔
   *     ifMove: 是否开启移动动画
   *     ifFixed: 是否将视图聚焦到当前线段
   */
  addLine(layerCode, list, option = { color: '#7B9EF7', width: 4 }) {
    if (!this.ifInitLayer(layerCode)) {
      this.addLayers([layerCode]);
    }
    if (list.length > 0) {
      const arr = [];
      list.forEach((item) => {
        const lonlat = transform(
          [item.longitude - 0, item.latitude - 0],
          'EPSG:4326',
          'EPSG:3857'
        );
        arr.push(lonlat);
      });
      this.orbitObj.addLine(
        this.mapLayers[layerCode],
        arr,
        'line',
        {
          color: option.color || '#7B9EF7',
          width: option.width || 4,
          lineDash: option.lineDash || [1]
        },
        {}
      );
      // 是否开启移动动画
      if (option.ifMove) {
        const patrolLength = option.patrolLength;
        const step = patrolLength
          ? patrolLength * 5 < 10
            ? patrolLength * 5
            : 10
          : 10;
        setTimeout(() => {
          this.orbitObj.startMove(step);
        }, 500);
      }
      // 是否要将线段放到视图中央
      if (option.ifFixed) {
        this.map
          .getView()
          .fit(this.orbitObj.lineString.getGeometry().getExtent());
      }
      return this.orbitObj.lineString;
    }
  },
  /**
   *
   * @param {Array} list
   *   eg: [{longitude：经度,latitude： 纬度}]
   *   item：
   *      longitude：经度
   *      latitude： 纬度
   * @param {Object} option
   *      radius：热力图半径
   *       blur：热力图blur
   */
  addHeatMap(list, option = {}) {
    if (list.length > 0) {
      const markers = [];
      list.forEach((item) => {
        if (item.latitude && item.longitude) {
          const lonlat = transform(
            [item.longitude - 0, item.latitude - 0],
            'EPSG:4326',
            'EPSG:3857'
          );
          const marker = new Feature(new Point(lonlat));
          markers.push(marker);
        }
      });
      if (!this.heatMapObj) {
        this.heatMapObj = new HeatMapObj(this.map);
      }

      this.heatMapObj.addHeatMap(
        markers,
        option.radius || 15,
        option.blur || 8
      );
    }
  },
  /**
   * 绘制地图元素功能
   * @param {String} type 需要绘制的地图元素类型
   *  Circle :圆形
   *  LineString：线
   *  Polygon ： 几何
   * @param {Object} option 地图元素的绘制样式
   *    fillColor: 填充颜色
   *     strokeColor: 边线颜色
   *      strokeWidth： 边线宽度
   * @param {Function} callBack
   *  回调函数
   */
  drawElementsCustom(type, option = {}, callBack) {
    const _this = this;
    if (!type) {
      console.log('无法绘制该类型的元素');
    }

    if (!this.ifInitLayer('draw')) {
      this.addLayers(['draw']);
    }
    if (!this.drawTool) {
      this.drawTool = new Draw({
        source: this.mapLayers.draw.getSource(),
        type: type,
        freehand: true
      });
      this.map.addInteraction(this.drawTool);
    }
    this.drawTool.on('drawstart', function (data) {
      _this.mapLayers.draw.getSource().clear();
    });
    this.drawTool.on('drawend', function (data) {
      const feature = data.feature;
      feature.setStyle(
        new Style({
          fill: new Fill({
            color: option.fillColor || 'rgba(255, 0, 0, 0.2)'
          }),
          stroke: new Stroke({
            color: option.strokeColor || 'rgba(255,0,0,0.1)',
            width: option.strokeWidth || 1
          })
        })
      );
      if (callBack) {
        if (type === 'Circle') {
          const position = feature.getGeometry().getCenter();
          const radius = feature.getGeometry().getRadius();
          const lonlat = transform(position, 'EPSG:3857', 'EPSG:4326');
          callBack(feature, {
            center: { longitude: lonlat[0], latitude: lonlat[1] },
            radius
          });
        } else {
          callBack(feature);
        }
      }
    });
  },
  /**
   * 清除鼠标绘制工具
   */
  drawElementsClose(type) {
    this.map.removeInteraction(this.drawTool);
  },
  /**
   * @param {String} layerCode 椭圆图层
   * @param {Object} info 基本信息
   *    longitude: 经度（必填）
   *    latitude: 纬度（必填）
   *       radius: 半径（必填  数字）
   * @param {Object} option 椭圆配置样式
   * strokeColor:  线颜色
   *   strokeWidth:  线粗细度
   *  fillColor: 填充颜色
   * @param {Object} callBack 回调
   *      clickCallBack 地图元素点击事件回调
   *      mousemoveCallBack 地图元素鼠标悬浮事件回调
   *      mouseoutCallBack 地图元素鼠标移除事件回调
   */
  addCircle(layerCode, info, option, callBack) {
    const _this = this;
    if (!info.radius) {
      console.log('请填写绘制圆的半径');
      return;
    }
    if (!info.longitude || !info.latitude) {
      console.log('请填写绘制圆的中心点');
      return;
    }
    if (!this.ifInitLayer(layerCode)) {
      this.addLayers([layerCode]);
    }

    let outRadiusRate = 0;
    let lonlat = [info.longitude, info.latitude];
    lonlat = transform(lonlat, 'EPSG:4326', 'EPSG:3857');
    const circleFeature = new Feature({
      geometry: new Circle(lonlat, info.radius * outRadiusRate)
    });

    circleFeature.setStyle(
      new Style({
        renderer(coordinates, state) {
          const [[x, y], [x1, y1]] = coordinates;
          const ctx = state.context;
          const dx = x1 - x;
          const dy = y1 - y;
          const radius = Math.sqrt(dx * dx + dy * dy);
          const innerRadius = 0;
          const outerRadius = radius * 1.4;
          const gradient = ctx.createRadialGradient(
            x,
            y,
            innerRadius,
            x,
            y,
            outerRadius
          );
          gradient.addColorStop(0, 'rgba(255,0,0,0)');
          gradient.addColorStop(0.6, 'rgba(255,0,0,0.2)');
          gradient.addColorStop(1, 'rgba(255,0,0,0.8)');
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      })
    );

    function animate() {
      outRadiusRate += info.radius / 100000;

      circleFeature.setGeometry(
        new Circle(lonlat, info.radius * outRadiusRate)
      );
      if (outRadiusRate <= 1.1) {
        requestAnimationFrame(animate);
      }
    }
    animate();

    this.mapLayers[layerCode].getSource().addFeature(circleFeature);
  },
  /**
   * 去除热力点位
   */
  removeHeatMap() {
    this.heatMapObj && this.heatMapObj.removeHeatMap();
  },
  /**
   * 清除一类overlayer
   * @param {String} layerCode 地图overlay类型
   */
  removeOverlays(layerCode) {
    if (this.overlays[layerCode]) {
      this.overlays[layerCode].forEach((item) => {
        this.map.removeOverlay(item);
      });
    }
    this.overlays[layerCode] = [];
  },
  /**
   * 清除一个overlayer
   * @param {String} layerCode 地图overlay类型
   * @param {String} attributeName 点位属性
   * @param {String} value 点位属性对应的值
   */
  removeOneOverlays(layerCode, attributeName, value) {
    if (this.overlays[layerCode] && this.overlays[layerCode].length > 0) {
      for (let i = this.overlays[layerCode].length - 1; i > 0; i--) {
        const item = this.overlays[layerCode][i];
        if (item.attributes[attributeName] === value) {
          this.map.removeOverlay(item);
          this.overlays[layerCode].splice(i, 1);
        }
      }
    }
  },
  /**
   * 清除地图上 layer图层的所有元素
   * @param {String} layer
   */
  removeLayer(layer) {
    if (this.mapLayers[layer]) this.mapLayers[layer].getSource().clear();
  },
  /**
   * 设置地图中心点
   * @param {String/Num} lon
   * @param {String/Num} lat
   * @param {String/Num} zoom
   */
  setCenter(lon, lat, zoom) {
    let lonlat = [lon, lat];
    lonlat = transform(lonlat, 'EPSG:4326', 'EPSG:3857');
    this.map.getView().setCenter(lonlat);
    this.map.getView().setZoom(zoom || 18);
  },
  /**
   * 获取所有的地图上的元素类型
   */
  getAllLayerCode() {
    const result = {
      elements: Object.keys(this.overlays),
      layers: Object.keys(this.mapLayers)
    };
    return result;
  },
  /**
   * 获取区域中心
   * @param {*} feature
   * @returns center
   */
  getCenterOfArea(feature) {
    const center = getCenter(
      boundingExtent(feature.getGeometry().getCoordinates())
    );
    const lonlat = transform(center, 'EPSG:3857', 'EPSG:4326');
    return lonlat;
  }
};
