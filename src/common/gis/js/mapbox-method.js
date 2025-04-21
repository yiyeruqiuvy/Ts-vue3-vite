/*
 * @Author: NIXY
 * @LastEditors: peiqf
 * @Date: 2023-05-12 15:58:30
 * @LastEditTime: 2025-04-21 17:30:27
 * @Description: mapBox 添加二维地图
 * turf 中文网地址：https://turfjs.fenxianglu.cn/category/#cdn%E9%93%BE%E6%8E%A5
 * @FilePath: \cqGit\src\scopes\project\common\utils\gis\uniteApi\mapbox-method.js
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-expressions */
// import * as turf from '@turf/turf'
import sourceAndLayer from './mapBox/sourceAndLayersNewSJ.js';
import vecJson from './mapBox/vector.json';
import vecJson_black from './mapBox/vector_black.json';
import cqLine from './mapBox/cqLine.json';
import axios from 'axios';
import { commonUtits } from '@/scopes/project/common/utils/utils.js';
import icon from '@/scopes/project/common/utils/gis/mapboxMap/js/iconUtil.js';
function MapMethod() {
  this.codeUrl = 'http://23.36.30.51:8201/sensorApi/cqzzDivisions/'; // 通过区域编码获取对应区域的边界范围
  this.centerUrl =
    'http://23.36.250.69/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/01f77642-ca0d-4661-b115-f5edfa99cfe8/4fbce88b-5499-4aa5-95bc-9243fd1e2e8f/MapStatistics'; // 通过区域编码获取对应区域下的区域中心点
  this.map = null; // 地图对象
  this.isDrawDot = false;
  this.overlays = {}; // overlay对象集合
  this.layers = []; // 加载图层
  this.imgs = icon;
  this.dblCkListener = {}; // 双击事件
}

/**
 * 初始化地图（实例化地图对象，渲染地图容器）
 * @param {string,dom} domId 地图容器
 * @param {Object} option 地图相关配置
 * @param {Object} type 地图样式 ，white，black
 */
MapMethod.prototype.loadMap = function (domId, option, type = 'white') {
  // debugger
  const mapboxgl = window.mapboxgl;
  return new Promise((resolve) => {
    this.map = new mapboxgl.Map({
      container: domId || 'map',
      style: type === 'white' ? vecJson : vecJson_black,
      // center: [106.9588619, 30.197776],
      // zoom: 13,
      center: [106.9588619, 30.197776],
      zoom: 13,
      minZoom: 6,
      maxZoom: 18,
      attributionControl: true,
      ...option
    });
    console.log(
      {
        container: domId || 'map',
        style: type === 'white' ? vecJson : vecJson_black,
        center: [106.9588619, 30.197776],
        zoom: 13,
        minZoom: 6,
        maxZoom: 18,
        attributionControl: true,
        ...option
      },
      '8989'
    );
    // this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-left')

    resolve(this.map);
  });
};
// 删除地图
MapMethod.prototype.deleteMap = function () {
  // debugger
  this.map = null;
};
/**
 * @Descripttion: 获取地图实例
 * @return {*}
 */
MapMethod.prototype.getMap = function () {
  // debugger
  return this.map;
};
/**
 * @Descripttion: 设置地图仰角
 * @param {*} pitch
 * @return {*}
 */
MapMethod.prototype.setPitch = function (pitch) {
  // debugger
  this.map.setPitch(pitch);
};
/**
 * 添加点位信息体
 * @param {Object} layerCode 点位类型
 * @param {Object} info 点位信息 (点为基础信息、点位类型)
 * @param {Object} option marker配置信息 （图标、大小等）
 */
MapMethod.prototype.addMarker = function (layerCode, info, callBack, option) {
  if (!layerCode) {
    console.log('addMarker方法需要提供layerMarker');
    return;
  }
  if (!info.longitude || !info.latitude) {
    console.log('添加点位需要提供完整的经纬度数据');
    return;
  }
  info.layerCode = layerCode;
  const el = document.createElement('div');
  const width = option || 32;
  const height = option || 32;
  el.className = `marker-box dom-marker ${layerCode}`;
  el.style.backgroundImage = option.icon;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  el.style.backgroundSize = '100%';

  // Add markers to the map.
  const marker = new mapboxgl.Marker(el)
    .setLngLat([info.longitude, info.latitude])
    .addTo(this.map);
  if (callBack) {
    this.markerListen(el, info, callBack);
  }
  marker.attributes = info;
  // 将点位添加到overlayers中暂存
  if (this.overlays[layerCode]) {
    this.overlays[layerCode].push(marker);
  } else {
    this.overlays[layerCode] = [marker];
  }
};
const validateLatLong = (lat, lng) => {
  // 正则表达式校验格式
  const latPattern = /^-?\d{1,2}\.\d+$/;
  const lngPattern = /^-?\d{1,3}\.\d+$/;

  if (!latPattern.test(lat)) {
    return { isValid: false, message: '纬度格式不正确' };
  }
  if (!lngPattern.test(lng)) {
    return { isValid: false, message: '经度格式不正确' };
  }

  // 范围校验
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (latitude < -90 || latitude > 90) {
    return { isValid: false, message: '纬度值超出范围 (-90 到 90)' };
  }
  if (longitude < -180 || longitude > 180) {
    return { isValid: false, message: '经度值超出范围 (-180 到 180)' };
  }

  return { isValid: true, message: '经纬度有效' };
};
/**
 * 添加自定点位信息体
 */
MapMethod.prototype.addCustomInfo = function (
  layerCode,
  info,
  markerStr,
  callBack,
  option
) {
  if (!layerCode) {
    console.log('addMarker方法需要提供layerMarker');
    return;
  }
  if (!info.longitude || !info.latitude) {
    console.log('添加点位需要提供完整的经纬度数据');
    return;
  }
  info.layerCode = layerCode;

  const dom = document.createElement('div');
  if (!markerStr) {
    markerStr = `<div class="marker-box dom-marker ${layerCode}">
        <div class="img-bg-bot"></div>
        </div>
    </div>`;
  }
  dom.innerHTML = markerStr;
  // 校验经纬度
  const flag = validateLatLong(info.latitude, info.longitude).isValid;
  if (!flag) return;
  const marker = new mapboxgl.Marker(dom)
    .setLngLat([info.longitude, info.latitude])
    .addTo(this.map);
  if (callBack) {
    this.markerListen(dom, info, callBack);
  }
  marker.attributes = info;
  // 将点位添加到overlayers中暂存
  if (this.overlays[layerCode]) {
    this.overlays[layerCode].push(marker);
  } else {
    this.overlays[layerCode] = [marker];
  }
};

/**
 * @Descripttion:
 * @param {*} areaInfo 当前区域数据
 * @param {*} callBack 回调方法
 * @return {*}
 */
MapMethod.prototype.dblclickListenrr = function (
  areaInfo,
  callBack,
  callBack2
) {
  // 添加双击事件的监听器
  // debugger
  if (this.dblCkListener['整体']) return;
  this.dblCkListener['整体'] = this.map.on('dblclick', function (e) {
    // e.lngLat 获取到的是点击位置的经纬度
    // 写死返回重庆即可
    // debugger
    if (areaInfo?.sj && areaInfo.sj === '重庆') {
      console.log(areaInfo, 'areaInfo1111');
      e.preventDefault();
      callBack({ label: '重庆' });
      callBack2();
    }
    console.log('Double clicked at:', e, areaInfo);
    // if (areaInfo?.areaLevel === 2) {
    //   const data = {
    //     areaCode: areaInfo.areaList[1].areaCode || '',
    //     label: areaInfo.areaList[1].label || ''
    //     // label: '重庆'
    //   }
    // }
  });
};
/**
 * 点位鼠标事件监听
 * @param {*} el
 * @param {*} callBack
 */
MapMethod.prototype.markerListen = function (el, info, callBack) {
  if (callBack.clickCallBack) {
    el.addEventListener('click', (e) => {
      const { x, y } = e;
      callBack.clickCallBack(info, { x, y });
      e.preventDefault();
      e.stopPropagation();
    });
  }
  if (callBack.mousemoveCallBack) {
    el.addEventListener('mousemove', (e) => {
      const { x, y } = e;
      // debugger
      callBack.mousemoveCallBack(info, { x, y });
      e.preventDefault();
      e.stopPropagation();
    });
  }
  if (callBack.mouseoutCallBack) {
    el.addEventListener('mouseout', (e) => {
      const { x, y } = e;
      callBack.mouseoutCallBack(info, { x, y });
      e.preventDefault();
      e.stopPropagation();
    });
  }
};
/**
 * 添加线条
 * @param {*} sourceId  数据源id
 * @param {*} layerId   图层id
 * @param {*} Data   JSON数据
 */
MapMethod.prototype.addLine = function (sourceId, layerId, Data, option) {
  this.map.addSource(sourceId, {
    type: 'geojson',
    data: Data
  });
  this.map.addLayer({
    id: layerId,
    type: 'line',
    source: sourceId,
    layout: {},
    paint: {
      'line-color': 'blue',
      'line-width': 5
    }
  });
  // 添加线条图层
};
/**
 * 加载数据源
 */
MapMethod.prototype.addSource = function () {
  const {
    glStyle: { sources }
  } = sourceAndLayer;
  for (const key in sources) {
    this.map.addSource(key, sources[key]);
  }
};
/**
 * 添加layer
 * @param {String} id 图层id
 * @param {String} type 图层类型  qx:区县  jd:街道  sq: 社区
 * @param {Object} callBack  clickCallBack: 点击事件回调
 */
MapMethod.prototype.addHoverLayers = function (id, callBack) {
  this.map.addLayer({
    id,
    type: 'fill',
    source: 'cqzz_division',
    'source-layer': 'division_py_n91065997217239607',
    paint: {
      'fill-color': 'rgba(235, 175, 30, 1)',
      'fill-opacity': 1
    },
    filter: ['==', 'code', '']
  });
  if (callBack) {
    this.mapListen(id, callBack);
  }
};

MapMethod.prototype.setFilter = function (id, option) {
  // console.log(id,option,'90909090');
  this.map.setFilter(id, option);
};
/**
 * 添加区域色块
 * type: 图层检索标识
 * option: 图层相应配置信息
 */
MapMethod.prototype.addPolygon = function (type, option, callBack) {
  const {
    glStyle: { layers }
  } = sourceAndLayer;

  const layer = layers[type];
  // 为图层加载相关配置
  if (option.filter) layer.filter = option.filter;
  if (option.paint) layer.paint = option.paint;
  // layer.maxzoom = 24
  // layer.minzoom = 0
  this.map.addLayer(layer);
  if (callBack) {
    this.mapListen(type, callBack);
  }
};
/**
 * 添加区域边界线
 */
MapMethod.prototype.addPolygonLine = function (type, option) {
  if (type === 'CQ') {
    this.addCQLine();
    return;
  }
  const {
    glStyle: { layers }
  } = sourceAndLayer;
  const layer = JSON.parse(JSON.stringify(layers[type]));
  // 为图层加载相关配置
  if (option.filter) layer.filter = option.filter;
  if (option.paint) layer.paint = option.paint;
  if (option.id) layer.id = option.id;

  layer.maxzoom = 24;
  layer.minzoom = 0;
  this.map.addLayer(layer);
};
/**
 * 添加区域边界线
 */
MapMethod.prototype.addCQLine = function () {
  // debugger
  // 删除Source
  if (this.map && this.map.getSource('cqLine')) {
    // this.map.removeSource('cqLine')
    if (this.map.getLayer('cqLine')) {
      this.map.removeLayer('cqLine');
    }
    // const data = this.map.getSource('cqLine')._data.geometry.coordinates[0]
    // console.log(data, 'datadatadatadata')
    // const link = document.createElement('a')
    // link.download = 'config.json'
    // link.href = 'data:text/plain,' + JSON.stringify(data)
    // link.click()
    this.map.addLayer({
      id: 'cqLine',
      type: 'line',
      alias: '市级-线',
      source: 'cqLine',
      layout: {
        // 'line-join': 'cqLine',
        // 'line-cap': 'cqLine'
        visibility: 'visible'
      },
      paint: {
        // 'line-color': '#f5f9f0 ',

        'line-color': '#e0e4da',
        'line-width': 2
        // 'line-color': '#0a6fb0 ',
        // 'line-width': 4
        // 'line-color': '#dbb1b1',
        // 'line-width': 8,
        // 'line-opacity': 0.8
      }
    });
    // this.map.addLayer({
    //   id: 'cqLine2',
    //   type: 'line',
    //   alias: '市级-线',
    //   source: 'cqLine',
    //   layout: {
    //     // 'line-join': 'cqLine',
    //     // 'line-cap': 'cqLine'
    //     visibility: 'visible'
    //   },
    //   paint: {
    //     'line-color': '#ff0000',
    //     'line-width': 3
    //   }
    // })
    return;
  }
  // console.log(cqLine.features[0].geometry.coordinates,'909999999')
  this.map.addSource('cqLine', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPolygon',
        coordinates: cqLine.features[0].geometry.coordinates
      }
    }
  });
  this.map.addLayer({
    id: 'cqLine',
    type: 'line',
    alias: '市级-线',
    source: 'cqLine',
    layout: {
      // 'line-join': 'cqLine',
      // 'line-cap': 'cqLine'
      visibility: 'visible'
    },
    paint: {
      // 'line-color': '#0a6fb0 ',
      // 'line-width': 4
      // 'line-color': '#f5f9f0 ',
      'line-color': '#e0e4da',
      'line-width': 2
    }
  });
};
/**
 * 添加polygon 监听
 * @param {*} layerId
 * @param {*} callBack
 */
MapMethod.prototype.mapListen = function (layerId, callBack) {
  if (callBack.clickCallBack) {
    this.map.on('click', layerId, (e) => {
      const { x, y } = e.point;
      const feature = e.features[0];
      // console.log(feature,e.point,'点击回调')
      callBack.clickCallBack(feature.properties, { x, y });
    });
  }
  // 添加双击事件的监听器
  if (callBack.dbclickCallBack && !this.dblCkListener[layerId]) {
    this.dblCkListener[layerId] = this.map.on('dblclick', layerId, (e) => {
      // debugger
      e.preventDefault();
      console.log(layerId, e, 'elayerId');
      const { x, y } = e.point;
      const feature = e.features[0];
      callBack.dbclickCallBack(layerId, feature.properties, { x, y });
    });
  }

  if (callBack.mousemoveCallBack) {
    this.map.on('mousemove', layerId, (e) => {
      const { x, y } = e.point;
      const feature = e.features[0];
      // console.log(feature,'悬浮',e);

      callBack.mousemoveCallBack(feature.properties, { x, y });
    });
  }
  if (callBack.mouseoutCallBack) {
    this.map.on('mouseout', layerId, (e) => {
      // const feature = e.features[0]; // 没有features
      // console.log(e,'22222')
      const { x, y } = e.point;
      callBack.mouseoutCallBack({ x, y });
    });
  }
};
/**
 * 删除地图点位
 */
MapMethod.prototype.removeMarkers = function (layerCode) {
  if (this.overlays[layerCode]) {
    this.overlays[layerCode].forEach((item) => {
      item.remove();
    });
  }
  this.overlays[layerCode] = [];
};
/**
 * 删除地图某一个点位
 */
MapMethod.prototype.removeOneMarkers = function (
  layerCode,
  attributeName,
  value
) {
  if (this.overlays[layerCode] && this.overlays[layerCode].length > 0) {
    for (let i = this.overlays[layerCode].length - 1; i > 0; i--) {
      const item = this.overlays[layerCode][i];
      if (item.attributes[attributeName] === value) {
        item.remove();
        this.overlays[layerCode].splice(i, 1);
      }
    }
  }
};
/**
 * 获取图层
 */
MapMethod.prototype.getLayer = function (layerId) {
  return this.map.getLayer(layerId);
};
/**
 * 清除图层
 */
MapMethod.prototype.removeLayer = function (layerId) {
  if (this.map.getLayer(layerId)) {
    this.map.removeLayer(layerId);
  }
};
/**
 * 清除数据源
 */
MapMethod.prototype.removeSource = function (id) {
  if (this.map && this.map.getSource(id)) {
    this.map.removeSource(id);
  }
};

/**
 * 设置底图中心点
 * @param {经度} lon
 * @param {维度} lat
 * @param {缩放} zoom
 */
MapMethod.prototype.setCenter = function (lon, lat, zoom) {
  this.map.setCenter([lon, lat]);
  if (zoom) {
    this.map.setZoom(zoom);
  }
};
/**
 * 将地图定位到bounds
 */
MapMethod.prototype.fitBounds = function (bounds) {
  const _position = {
    // padding: { top: -50, bottom: -50, left: -50, right: -50 }
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  };
  this.map.fitBounds(bounds, _position);
};

/**
 * 通过code将地图定位到bounds t 参数地图放大修正参数
 */
MapMethod.prototype.fitBoundsByCode = function (code, t = 0, isCQ) {
  // debugger
  if (isCQ === 'CQ') {
    this.fitBoundsCQ();
    return;
  }
  if (isCQ === 'CQ2') {
    // debugger
    this.fitBoundsCQ2();
    return;
  }
  if (isCQ === 'CQ3') {
    // debugger
    this.fitBoundsCQ3();
    return;
  }
  if (isCQ === 'diy') {
    this.fitBounds();
    return;
  }
  const creBox = (str) => {
    const res = {
      xmin: 0,
      ymin: 0,
      xmax: 0,
      ymax: 0
    };
    const first = str.split(',');
    for (let i = 0; i < 2; i++) {
      if (i === 0) {
        res.xmin = Number(first[0].split(' ')[0]);
        res.ymin = Number(first[0].split(' ')[1]);
      } else {
        res.xmax = Number(first[1].split(' ')[0]);
        res.ymax = Number(first[1].split(' ')[1]);
      }
    }
    return res;
  };
  // const length = code.split('').length
  // if (length === 15) {
  //   code = code.slice(0,12)
  // }
  // else if (length === 17) {
  //   code = code.slice(0,12)
  // }

  axios.get(this.codeUrl + code).then((res) => {
    if (res.data) {
      const val = creBox(res.data.data.extent);
      // const t = 0.05
      const bbox = [
        [val.xmin + t, val.ymin + t],
        [val.xmax - t, val.ymax - t]
      ];
      this.map.fitBounds(bbox, {
        // padding: { top: -50, bottom: -50, left: -50, right: -50 }
        padding: { top: 0, bottom: 0, left: 0, right: 0 }
      });
      // return true
      // .then(res=>{
      // this.$bus.$emit('opop','111')
      // })
    }
  });
};
/**
 * 将地图定位到重庆市中心
 */
MapMethod.prototype.fitBoundsCQ = function () {
  const bbox = [
    [Number(102.28806360700008), Number(28.163502316000063)],
    [Number(113.19564163000007), Number(32.20416854400003)]
  ];
  this.map.fitBounds(bbox, {
    // padding: { top: -50, bottom: -50, left: -50, right: -50 }
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  });
};
/**
 * 将地图定位到重庆市中心 2.2窄屏使用
 */
MapMethod.prototype.fitBoundsCQ2 = function () {
  // 无底部一库的
  // const bbox = [
  //   [Number(101.30806360700008), Number(28.663502316000063)],
  //   [Number(114.19564163000007), Number(33.20416854400003)]
  // ];
  // 相对定位
  // const bbox = [
  //   [Number(103.698063607), Number(29.46350231600006)],
  //   [Number(111.32564163), Number(30.67416854400003)]
  // ];
  // 绝对的
  const bbox = [
    [Number(104.198063607), Number(29.46350231600006)],
    [Number(111.22564163), Number(30.67416854400003)]
  ];
  this.map.fitBounds(bbox, {
    // padding: { top: -50, bottom: -50, left: -50, right: -50 }
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  });
};
/**
 * 将地图定位到重庆市中心 2.2宽屏使用
 */
MapMethod.prototype.fitBoundsCQ3 = function () {
  // 无底部一库的
  // const bbox = [
  //   [Number(101.30806360700008), Number(28.663502316000063)],
  //   [Number(114.19564163000007), Number(33.20416854400003)]
  // ];
  // 相对定位
  // const bbox = [
  //   [Number(103.698063607), Number(29.46350231600006)],
  //   [Number(111.32564163), Number(30.67416854400003)]
  // ];
  // 绝对的
  const bbox = [
    [Number(103.408063607), Number(28.66350231600006)],
    [Number(112.22564163), Number(30.97416854400003)]
  ];
  this.map.fitBounds(bbox, {
    // padding: { top: -50, bottom: -50, left: -50, right: -50 }
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  });
};
// MapMethod.prototype.fitBounds = function (bbox) {
//   // const bbox = [
//   //   [Number(101.30806360700008), Number(28.663502316000063)],
//   //   [Number(114.19564163000007), Number(33.20416854400003)]
//   // ];
//   this.map.fitBounds(bbox, {
//     padding: { top: -50, bottom: -50, left: -50, right: -50 }
//   });
// };
/**
 * 通过code将地图定位到bounds--两江新区
 */
// MapMethod.prototype.fitBoundsByCodeLjxq = function (code) {
//   const creBox = str => {
//     const res = {
//       xmin: 0,
//       ymin: 0,
//       xmax: 0,
//       ymax: 0
//     }
//     const first = str.split(',')
//     for (let i = 0; i < 2; i++) {
//       if (i === 0) {
//         res.xmin = Number(first[0].split(' ')[0])
//         res.ymin = Number(first[0].split(' ')[1])
//       } else {
//         res.xmax = Number(first[1].split(' ')[0])
//         res.ymax = Number(first[1].split(' ')[1])
//       }
//     }
//     return res
//   }
//   axios.get(this.codeUrl + code).then(res => {
//     if (res.data) {
//       const val = creBox(res.data.data.extent)
//       const bbox = [
//         [Number(val.xmin), Number(val.ymin)],
//         [Number(val.xmax), Number(val.ymax)]
//       ]
//       this.map.fitBounds(bbox, {
//         padding: { top: -50, bottom: -50, left: -50, right: -50 }
//       })
//     }
//   })
// }
/**
 * 根据区域编码查询下属子区域的中心点
 * @param {String} code  区域编码
 */
MapMethod.prototype.getCenterByCode = function (code) {
  // 兼容社区编码
  if (code.split('').length === 12) {
    code = code + '000';
  }
  return axios.get(this.centerUrl, { params: { parentCode: code } });
};
/**
 * 根据区域编码查询下属子区域的中心点--两江新区
 * @param {String} code  区域编码
 */
// MapMethod.prototype.getCenterByCodeLjxq = function (code) {
//   return axios.get(this.centerUrl, { params: { parentCode: code } })
// }

/**
 * 获取geojson并加载图层
 * @param {String} imageUrl  图片url
 */
MapMethod.prototype.createGeojson = function (
  imageUrl,
  bs,
  layerObj,
  callBack
) {
  commonUtits.getImageBlob(imageUrl).then((blob) => {
    window.createImageBitmap(blob).then((image) => {
      if (!this.map.hasImage(bs)) {
        this.map.addImage(bs, image);
      }
      this.map.addLayer(layerObj);
    });
  });
  if (callBack) {
    this.mapListen(layerObj.id, callBack);
  }
};

/**
 * 获取geojson并加载图层
 * @param {String} imageUrl  图片url
 */
MapMethod.prototype.addTheLayer = function (type, callBack) {
  const img = this.imgs[type];
  const {
    glStyle: { layers }
  } = sourceAndLayer;
  const layerConfig = layers[type];

  commonUtits.getImageBlob(img).then((blob) => {
    window.createImageBitmap(blob).then((image) => {
      if (!this.map.hasImage(type)) {
        this.map.addImage(type, image);
      }
      this.map.addLayer(layerConfig);
    });
  });
  if (callBack) {
    this.mapListen(type, callBack);
  }
};

/**
 * 添加自定义元数据
 * @param {String} id 数据源标识
 * @param {String} type 数据源类型
 * @param {*} data 数据源
 */
MapMethod.prototype.addCustomSource = function (id, type, data) {
  // 如果数据源存在需要先删除存在的数据源
  if (this.map && this.map.getSource(id)) {
    this.map.removeSource(id);
  }
  this.map.addSource(id, {
    type,
    data
  });
};
/**
 * 添加自定义图层
 * @param {Object} layerConfig 图层配置项
 */
MapMethod.prototype.addCustomLayer = function (layerConfig, layerId) {
  const layer = this.map.getLayer(layerId);
  if (layer) {
    this.map.removeLayer(layerId);
  }
  if (this.map && this.map.getSource(layerId)) {
    this.map.removeSource(layerId);
  }
  this.map.addLayer(layerConfig);
};
/**
 * 添加热力图图层
 * @param {*} id
 * @param {*} source
 * @param {*} option
 */
MapMethod.prototype.addHeatLayer = function (id, source, option = {}) {
  const customPaint = option.paint || {};
  const config = {
    id,
    type: 'heatmap',
    source,
    maxzoom: option.maxzoom || 22,
    paint: {
      'heatmap-weight': 1,
      'heatmap-intensity': 0.3,
      'heatmap-opacity': 0.7,
      'heatmap-radius': [
        // 以像素为单位设置每个点的半径。半径越大，热图越平滑，细节量越少
        'interpolate',
        ['linear'],
        ['zoom'],
        10,
        10,
        20,
        60
      ],
      'heatmap-color': [
        //热力图颜色
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(255,255,255,0)',
        0.2,
        'rgb(174, 184, 209)',
        0.4,
        'rgb(117,211,248)',
        0.6,
        'rgb(147, 230, 142)',
        0.8,
        'rgb(255, 234, 0)',
        1,
        'rgb(221, 91, 73)'
      ],
      ...customPaint
    }
  };
  this.addCustomLayer(config);
};
/**
 * 地图点位工具---点
 * @param {*} domId
 */
MapMethod.prototype.setPoint = function (domId) {
  this.map.getCanvas().style.cursor = 'crosshair';
  this.map.doubleClickZoom.disable(); // 禁止双击缩放
  this.isDrawDot = true;
  this.map.on('click', (_e) => {
    if (this.isDrawDot) {
      // 删除之前的点
      if (this.map.getLayer(domId)) {
        this.map.removeLayer(domId);
      }
      // 删除Source
      if (this.map && this.map.getSource(domId)) {
        this.map.removeSource(domId);
      }
      // 删除dom
      if (this.overlays[domId]) {
        this.overlays[domId].forEach((item) => {
          item.remove();
        });
      }
      this.overlays[domId] = [];

      let jsonPoint = {
        type: 'FeatureCollection',
        features: []
      };
      let endCoords = [_e.lngLat.lng, _e.lngLat.lat];
      jsonPoint.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: endCoords
        }
      });
      this.map.addSource(domId, {
        type: 'geojson',
        data: jsonPoint
      });
      this.map.addLayer({
        id: domId,
        type: 'circle',
        source: domId,
        paint: {
          'circle-color': '#ffffff',
          'circle-radius': 3,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ff0000'
        }
      });
      const dom = document.createElement('div');
      let _lng = _e.lngLat.lng.toFixed(6);
      let _lat = _e.lngLat.lat.toFixed(6);
      let markerStr = `<div class="marker-dot ${domId}">
        <p>经度：${_lng}</p>
        <p>纬度：${_lat}</p>
      </div>`;
      dom.innerHTML = markerStr;

      const marker = new mapboxgl.Marker(dom)
        .setLngLat([_e.lngLat.lng, _e.lngLat.lat])
        .addTo(this.map);
      // this.map.getSource(domId).setData(jsonPoint)
      // 将点位添加到overlayers中暂存
      if (this.overlays[domId]) {
        this.overlays[domId].push(marker);
      } else {
        this.overlays[domId] = [marker];
      }
    }
  });
};
/**
 * 关闭地图工具-修改鼠标状态
 */
MapMethod.prototype.deleteMouseTool = function (domId) {
  this.map.getCanvas().style.cursor = 'grab';
  this.isDrawDot = false; // 关闭点位工具
  if (domId.length > 0) {
    domId.forEach((item) => {
      // 删除之前的点
      if (this.map.getLayer(item)) {
        this.map.removeLayer(item);
      }
      // 删除Source
      if (this.map && this.map.getSource(item)) {
        this.map.removeSource(item);
      }
    });
  }
};
/**
 * 地图点位工具 --- 线
 * @param {*} domId
 */
MapMethod.prototype.setLine = function (points, lineMove, line) {
  this.map.getCanvas().style.cursor = 'crosshair';
  // 禁止双击缩放
  let isMeasure = true;
  this.map.doubleClickZoom.disable();
  let jsonPoint = {
    type: 'FeatureCollection',
    features: []
  };
  let jsonLine = {
    type: 'FeatureCollection',
    features: []
  };
  let markers = [];
  let source = this.map.getSource(points);
  let lineMoveSource = this.map.getSource(lineMove);
  let lineSource = this.map.getSource(line);
  if (source) {
    this.map.getSource(points).setData(jsonPoint);
    if (lineMoveSource) {
      this.map.getSource(lineMove).setData(jsonLine);
    }
    if (lineSource) {
      this.map.getSource(line).setData(jsonLine);
    }
  } else {
    this.map.addSource(points, {
      type: 'geojson',
      data: jsonPoint
    });
    this.map.addSource(line, {
      type: 'geojson',
      data: jsonLine
    });
    this.map.addSource(lineMove, {
      type: 'geojson',
      data: jsonLine
    });
    this.map.addLayer({
      id: lineMove,
      type: line,
      source: lineMove,
      paint: {
        'line-color': '#ff0000',
        'line-width': 2,
        'line-opacity': 0.65
      }
    });
    this.map.addLayer({
      id: line,
      type: line,
      source: line,
      paint: {
        'line-color': '#ff0000',
        'line-width': 2,
        'line-opacity': 0.65
      }
    });
    this.map.addLayer({
      id: points,
      type: 'circle',
      source: points,
      paint: {
        'circle-color': '#ffffff',
        'circle-radius': 3,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ff0000'
      }
    });
  }
  let that = this;
  function addPoint(coords) {
    if (jsonPoint.features.length > 0) {
      let prev = jsonPoint.features[jsonPoint.features.length - 1];
      jsonLine.features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [prev.geometry.coordinates, coords]
        }
      });
      that.map.getSource(line).setData(jsonLine);
    }
    jsonPoint.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coords
      }
    });
    that.map.getSource(points).setData(jsonPoint);
  }
  this.map.on('click', function (_e) {
    if (isMeasure) {
      let coords = [_e.lngLat.lng, _e.lngLat.lat];
      addPoint(coords);
      //points.push(coords);
    }
  });
  this.map.on('mousemove', function (_e) {
    if (isMeasure) {
      let coords = [_e.lngLat.lng, _e.lngLat.lat];
      if (jsonPoint.features.length > 0) {
        let prev = jsonPoint.features[jsonPoint.features.length - 1];
        let json = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [prev.geometry.coordinates, coords]
          }
        };
        that.map.getSource(lineMove).setData(json);
      }
    }
  });
  this.map.on('dblclick', (_e) => {
    if (isMeasure) {
      let coords = [_e.lngLat.lng, _e.lngLat.lat];
      addPoint(coords);
      isMeasure = false;
      that.map.getCanvas().style.cursor = 'grab';
      jsonPoint.features = [];
      jsonLine.features = [];
    }
  });
};
/**
 * 地图点位工具 --- 面
 * @param {*} domId
 */
MapMethod.prototype.setArea = function (pointsArea, lineArea, lineAreaStroke) {
  this.map.getCanvas().style.cursor = 'crosshair';
  let isMeasure = true;
  // 禁止双击缩放
  this.map.doubleClickZoom.disable();
  let jsonPoint = {
    type: 'FeatureCollection',
    features: []
  };
  let jsonLine = {
    type: 'FeatureCollection',
    features: []
  };
  let points = [];
  let source = this.map.getSource(pointsArea);
  if (source) {
    this.map.getSource(pointsArea).setData(jsonPoint);
    this.map.getSource(lineArea).setData(jsonLine);
  } else {
    this.map.addSource(pointsArea, {
      type: 'geojson',
      data: jsonPoint
    });
    this.map.addSource(lineArea, {
      type: 'geojson',
      data: jsonLine
    });
    this.map.addLayer({
      id: lineArea,
      type: 'fill',
      source: lineArea,
      paint: {
        'fill-color': '#ff0000',
        'fill-opacity': 0.1
      }
    });
    this.map.addLayer({
      id: lineAreaStroke,
      type: 'line',
      source: lineArea,
      paint: {
        'line-color': '#ff0000',
        'line-width': 2,
        'line-opacity': 0.65
      }
    });
    this.map.addLayer({
      id: pointsArea,
      type: 'circle',
      source: pointsArea,
      paint: {
        'circle-color': '#ffffff',
        'circle-radius': 3,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ff0000'
      }
    });
  }
  let that = this;
  function addPoint(coords) {
    jsonPoint.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coords
      }
    });
    that.map.getSource(pointsArea).setData(jsonPoint);
  }

  this.map.on('click', function (_e) {
    if (isMeasure) {
      let coords = [_e.lngLat.lng, _e.lngLat.lat];
      points.push(coords);
      addPoint(coords);
    }
  });

  this.map.on('dblclick', function (_e) {
    if (isMeasure) {
      let coords = [_e.lngLat.lng, _e.lngLat.lat];
      points.push(coords);
      isMeasure = false;
      that.map.getCanvas().style.cursor = 'grab';
    }
  });

  this.map.on('mousemove', function (_e) {
    if (isMeasure) {
      let coords = [_e.lngLat.lng, _e.lngLat.lat];
      let len = jsonPoint.features.length;
      if (len != 0 && len != 1) {
        let pts = points.concat([coords]);
        pts = pts.concat([points[0]]);
        let json = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [pts]
          }
        };
        that.map.getSource(lineArea).setData(json);
      }
    }
  });
};
/**
 * 修改地图缩放级别
 * @param {缩放} zoom
 */
MapMethod.prototype.setZoom = function (zoom) {
  if (zoom) {
    this.map.setZoom(zoom);
  }
};
export default MapMethod;
