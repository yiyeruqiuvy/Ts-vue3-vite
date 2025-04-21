/*
 * @Descripttion: cesium封装方法 基于规自局的包开发的，他们有修改，所以包内容是固定的，无需引入
 * @Author: peiqf
 * @Date: 2023-12-06 09:53:35
 * @LastEditors: peiqf
 * @LastEditTime: 2025-04-21 17:46:40
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { merge } from 'lodash';
// import turf from '@turf/boolean-point-in-polygon';
import axios from 'axios';
// import faceConfig from 'faceConfig';
import CesiumTool from '@/common/gis/js/cesium-tool/cesium-tool.js';
// import hcJson from '../cesiumMap/l3/hc_cfgc_l3_room.json';
// import PolylineTrailMaterialProperty from './PolylineTrailMaterialProperty.js'
import { commonUtits } from '@/utils/tool.js';

class CesiumMethod {
  constructor() {
    this.viewer = null; // 地图对象
    // this.filePath = faceConfig.filePath;
    this.access_server = '';
    this.access_token = '';
    this.hasFirstEye = false;
    this.layers = {}; // 用于存储图层对象的字典
    this.terrainProviders = {}; // 用于存储地形提供者对象的字典
    this.sceneFirstReadyCallback = null; //三维模型加载完后的回调

    this.listenHandler = null; // cesium监听对象实例
    this.handler = []; // 监听的对象组
    this.handler2 = []; // 监听的对象组,argis数据
    this.currentListener = {}; // 鼠标移入的当前的监听对象
    this.htmlElesList = {}; // 自定义的html元素集
    this.tilesets = []; // 3d地图模型
    this.imageryLayers = []; // 市级体征水电气的撒点数据
    this.imageryLayersIndex = 2;
    this.wallEntityId = null; // 立体墙entities列表
    this.curAreaName = ''; // 当前树立了立体墙的区县
    this.isDynamic = true; // 市级感知撒点移动请求
    this.isNoData = false; // 在上一次接口没数据时，微小移动也请求接口
    this.currentPosition = {
      lng: '',
      lat: '',
      height: '',
      radius: ''
    }; // 当前可视区域的经纬度
    this.timer1 = null; // 定时器
    // cesium地图服务地址
    this.cesium_url = {
      public: '23.99.222.51',
      cityCenter: '23.39.1.49'
    };
    this.closeDistanceLimit = null; // 关闭距离限制，规自局修改城运中心部署服务，则我们不用修改
    this.centerUrl =
      'http://23.36.250.69/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/01f77642-ca0d-4661-b115-f5edfa99cfe8/4fbce88b-5499-4aa5-95bc-9243fd1e2e8f/MapStatistics'; // 通过区域编码获取子集的区域中心点
    // 三级平台编码=>地图编码
    this.areaCodeMapping = {
      // 渝北区
      500112011: '500112003', // 龙溪街道
      500112012: '500112005', //龙山街道
      500112013: '500112006', // 龙塔街道
      500112015: '500112007', //悦来街道
      500112016: '500112008', //两路街道
      500112017: '500112001', //双凤桥街道
      500112018: '500112009', //王家街道
      500112020: '500112010', //宝圣湖街道
      500112023: '500112011', //仙桃街道
      500112129: '500112130', //玉峰山镇
      500112131: '500112119', //龙兴镇
      500112133: '500112121', //统景镇
      500112135: '500112117', //大湾镇
      500112138: '500112113', //兴隆镇
      500112139: '500112111', //木耳镇
      500112140: '500112115', //茨竹镇
      500112141: '500112126', //古路镇
      500112142: '500112120', //石船镇
      500112143: '500112123', //大盛镇
      500112144: '500112125', //洛碛镇
      // 江北区
      500105002: '500105010',
      // 万盛
      500110: '500192',
      500110004: '500192001',
      500110005: '500192002',
      500110100: '500192100',
      500110101: '500192101',
      500110102: '500192102',
      500110103: '500192103',
      500110104: '500192104',
      500110105: '500192105',
      500110106: '500192106',
      500110107: '500192107',
      // 高新区
      500195: '500193',
      500195016: '500193001',
      500195017: '500193002',
      500195020: '500193003',
      500195103: '500193101',
      500195104: '500193102',
      500195105: '500193103',
      500195106: '500193104',
      500195107: '500193105',
      500195108: '500193106',
      500195118: '500193100',
      // 两江新区
      500199: '500191',
      500199007: '500191006',
      500199008: '500191007',
      500199009: '500191003',
      500199010: '500191005',
      500199014: '500191004',
      500199019: '500191008',
      500199021: '500191009',
      500199022: '500191010',
      //綦江区
      500222: '500110',
      500222001: '500110003',
      500222002: '500110004',
      500222003: '500110005',
      500222006: '500110006',
      500222007: '500110007',
      500222108: '500110108',
      500222109: '500110109',
      500222110: '500110110',
      500222111: '500110111',
      500222112: '500110112',
      500222113: '500110113',
      500222114: '500110114',
      500222115: '500110115',
      500222116: '500110116',
      500222117: '500110117',
      500222118: '500110118',
      500222119: '500110119',
      500222120: '500110120',
      500222121: '500110121',
      500222123: '500110123',
      500222124: '500110124',
      // 梁平区
      500228: '500155',
      500228001: '500155001',
      500228002: '500155002',
      500228003: '500155004',
      500228004: '500155005',
      500228005: '500155003',
      500228102: '500155102',
      500228103: '500155103',
      500228104: '500155104',
      500228106: '500155106',
      500228107: '500155107',
      500228108: '500155108',
      500228110: '500155110',
      500228111: '500155111',
      500228112: '500155112',
      500228113: '500155113',
      500228114: '500155114',
      500228115: '500155115',
      500228116: '500155116',
      500228117: '500155117',
      500228118: '500155118',
      500228119: '500155119',
      500228121: '500155121',
      500228122: '500155122',
      500228123: '500155123',
      500228124: '500155124',
      500228125: '500155125',
      500228126: '500155126',
      500228127: '500155127',
      500228128: '500155128',
      500228129: '500155129',
      500228130: '500155130',
      500228201: '500155201',
      500228202: '500155202'
    };
    // 合川需要的l3数据
    // 添加L3模型
    this.clippingStoreInfors = {};
    //生成临时的存储多个信息树
    this.choselayers = {};
    // 生成信息树,临时记录信息树
    this.bimTreeInfors = {};
    // 记录已经被隐藏的部件
    this.hideElement = {};
    // 记录隐藏的图层
    this.hideLayers = [];
    // 场景事件
    this.l3LayerLeftClickHandle = undefined;
    // 存储l3数据
    this.l3Data = {};
    //记录label
    this.l3DataLabel = undefined;
    //  配置参数
    this.getUrlPrefix();
  }

  /**
   * @Descripttion: 加载模型
   * @param {*} l3Data  加载的l3模型数据
   * {
   * label:xxx,
   * json:xxx.json,网上的地址
   * }
   * @return {*}
   */
  async addL3Layer(l3Data) {
    // const scene1Json = '../cesiumMap/l3/hc_cfgc_l3_room.json'
    const scene1Json = 'hc_cfgc_l3_room.json';
    // const inputData = hcJson
    // const inputData = l3Data?.json || []
    const _this = this;
    this.l3DataLabel = l3Data.label;
    await $.getJSON(l3Data?.json, function (inputData) {
      //设置一个全局的图层信息树
      _this.bimTreeInfors = {};
      console.log(inputData, 'inputData');
      for (let i = 0; i < inputData.length; i++) {
        const l3LayerInfor = inputData[i];

        //第一步：先在三维模型和地形上挖洞
        const clippingPolygonInfor = l3LayerInfor.clippingPolygon; //挖洞信息
        const clippingLayers = clippingPolygonInfor.layers; //需要挖洞的图层
        const clippingPositions = clippingPolygonInfor.position; //挖洞的范围
        const needClippingTerrain = Cesium.defined(
          clippingPolygonInfor.needClippingTerrain
        )
          ? clippingPolygonInfor.needClippingTerrain
          : false; //地形是否也需要挖洞

        //挖三维模型
        let clippingLayerNames = [];
        for (let j = 0; j < clippingLayers.length; j++) {
          const clippingLayer = clippingLayers[i];
          const clippingLayerName = clippingLayer.layername;
          clippingLayerNames.push(clippingLayerName);
          _this.addTilesetClippingPolygon(clippingLayerName, clippingPositions);
        }
        //记录挖的图层
        _this.clippingStoreInfors['clippingLayerNames'] = clippingLayerNames;
        //如果需要挖地形
        if (needClippingTerrain) {
          _this.addTerrainClippingPolygon(clippingPositions);
          //记录挖的图层
          _this.clippingStoreInfors['needClippingTerrain'] =
            needClippingTerrain;
        }

        //第二步：加载三级图
        const l3Urls = l3LayerInfor.l3Url; //3级图地址
        axios
          .all(l3Urls.map((url) => axios.get(url)))
          .then(
            axios.spread((...responses) => {
              const results = responses.map((response) => response.data.result);
              let items = [];

              results.map((result) => {
                for (let i = 0; i < result?.svcItem.length; i++) {
                  result.svcItem[i].checked = true;
                  items.push(result?.svcItem[i]);
                }
              });
              // debugger
              const access_server = l3Urls[0].substring(
                0,
                l3Urls[0].indexOf('/', 10)
              );
              _this.LoadScene(
                items,
                access_server,
                false,
                _this.SceneReadyHandleCallback
              );

              //第三步：设置生成信息树
              const l3LayerTreeInfors = l3LayerInfor.bim;
              _this.GenerateL3LayerTreeInfor(l3LayerTreeInfors, l3Data.label);
              //第四步：开启要素点击事件 //点击事件
              _this.addPickEvent();
            })
          )
          .catch((error) => {
            console.error(
              'There has been a problem with your axios operation:',
              error
            );
          });
      }
    });
  }

  /**
   * @Descripttion: 三级图加载完后回调
   * @param {*} tileset
   * @return {*}
   */

  SceneReadyHandleCallback2(tileset) {
    tileset & this.viewer.zoomTo(tileset);
  }

  OrginazationTreeInfor(l3TreeInfors) {
    let bimTreeInforsTemp = {};
    for (let i = 0; i < l3TreeInfors.length; i++) {
      const l3Infor = l3TreeInfors[i];
      const layerName = l3Infor.layername;
      const levelsInfors = l3Infor.levels;
      if (Cesium.defined(l3Infor.type)) {
        if (l3Infor.type === 'layer') {
          //图层级控制
          let copyLevelInfor = JSON.parse(JSON.stringify(l3Infor));
          copyLevelInfor.layername = layerName;
          const id = layerName + '_Layer';
          bimTreeInforsTemp[id] = copyLevelInfor;
        }
      } else {
        for (let j = 0; j < levelsInfors.length; j++) {
          const levelInfor = levelsInfors[j];
          let copyLevelInfor = JSON.parse(JSON.stringify(levelInfor));
          copyLevelInfor.layername = layerName;
          const id = layerName + '_' + levelInfor.level;
          bimTreeInforsTemp[id] = copyLevelInfor;
        }
      }
    }
    return bimTreeInforsTemp;
  }

  /**
   * @Descripttion: 生成信息树
   * @param {*} l3Infors
   * @return {*}
   */

  GenerateL3LayerTreeInfor(l3Infors, label) {
    window.l3Infors = l3Infors;
    console.log(l3Infors, 'l3Infors');
    // const layerElement = document.getElementById('levelGroup')
    // let levelGroupDivHt = 0
    // let levelDivContent = ''
    //生成全局信息树
    this.bimTreeInfors = {};
    const _list = [];
    let l3LayerNames = [];
    for (let i = 0; i < l3Infors.length; i++) {
      const l3Infor = l3Infors[i];
      const layerName = l3Infor.layername;
      l3LayerNames.push(layerName);
      const levelsInfors = l3Infor.levels;
      if (Cesium.defined(l3Infor.type)) {
        if (l3Infor.type === 'layer') {
          //图层级控制
          let copyLevelInfor = JSON.parse(JSON.stringify(l3Infor));
          copyLevelInfor.layername = layerName;
          const id = layerName + '_Layer';
          _list.push({
            label: l3Infor.level,
            id
          });
          this.bimTreeInfors[id] = copyLevelInfor;
          //生成div
          // levelDivContent +=
          //   "<div id='" +
          //   id +
          //   `' class = 'floor' \@click="${this.ShowOrHideLayer}('` +
          //   id +
          //   '\')">' +
          //   l3Infor.level +
          //   '</div>'
          // levelGroupDivHt += 25
        } else if (l3Infor.type === 'choselayers') {
          //多个信息树，存储保存
          const choseLayerInforTemp = this.OrginazationTreeInfor(
            l3Infor.layerinfors
          );
          if (Cesium.defined(choseLayerInforTemp) && !!this.choselayers) {
            this.choselayers[layerName] = choseLayerInforTemp;
          }
        }
      } else {
        for (let j = 0; j < levelsInfors.length; j++) {
          const levelInfor = levelsInfors[j];
          let copyLevelInfor = JSON.parse(JSON.stringify(levelInfor));
          copyLevelInfor.layername = layerName;
          const id = layerName + '_' + levelInfor.level;
          _list.push({
            label: levelInfor.level,
            id
          });
          this.bimTreeInfors[id] = copyLevelInfor;
          //生成div
          // levelDivContent +=
          //   "<div id='" +
          //   id +
          //   `' class = 'floor' \@click="${this.ShowOrHideLayer}('` +
          //   id +
          //   '\')">' +
          //   levelInfor.level +
          //   '</div>'
          // levelGroupDivHt += 25
        }
      }
    }
    //this.l3Data[label] = {
    // dataList: _list,
    //  label
    // }
    //  console.log(_list, '_list')
    this.clippingStoreInfors['l3LayerNames'] = l3LayerNames;
    // layerElement.style.height = levelGroupDivHt + 'px'
    // layerElement.innerHTML = levelDivContent
    if (
      Cesium.defined(this.bimTreeInfors) &&
      Object.keys(this.bimTreeInfors).length > 0
    ) {
      console.log('initree1');
      this.IniTreeInfor(this.bimTreeInfors, label);
    }
  }

  ResetTreeInfor() {
    //先将已隐藏的设置可见
    if (Cesium.defined(this.hideElement)) {
      for (const layer in this.hideElement) {
        const tilesetLayer = this.viewer.scene.primitives.get3DTileLayer(layer);
        if (Cesium.defined(tilesetLayer)) {
          const ids = this.hideElement[layer];
          tilesetLayer.setIdShow(ids, true);
        }
      }
    }
    //将隐藏的图层设置可见
    for (let i = 0; i < this.hideLayers.length; i++) {
      const tilesetLayer = this.viewer.scene.primitives.get3DTileLayer(
        this.hideLayers[i]
      );
      if (Cesium.defined(tilesetLayer)) {
        tilesetLayer.show = true;
      }
    }
    //生成信息树,临时记录信息树
    this.bimTreeInfors = {};
    //记录已经被隐藏的部件
    this.hideElement = {};
    //图层
    this.hideLayers = [];
    //把信息树清空
    //const layerElement = document.getElementById("levelGroup");
    //layerElement.style.height = "0px";
    //layerElement.innerHTML = "";
  }
  //信息树生成
  IniTreeInfor(bldLevelInfor, label) {
    console.log('input initree');
    let _list = [];
    for (const prop in bldLevelInfor) {
      const l3Infor = bldLevelInfor[prop];
      //生成div
      if (Cesium.defined(l3Infor.show) && l3Infor.show === false) {
        continue;
      }
      _list.push({
        label: l3Infor.level,
        prop,
        id: prop
      });
    }
    console.log(_list, '_list');
    this.l3Data[label] = {
      dataList: _list,
      label
    };
    let _event = new Event('mapTreeDataChange');
    window.dispatchEvent(_event);
  }

  /**
   * @Descripttion: 显隐图层
   * @param {*} id
   * @return {*}
   */

  ShowOrHideLayer(id) {
    console.log(id, 'ididid');
    // debugger
    //先将已隐藏的设置可见

    {
      for (const layer in this.hideElement) {
        const tilesetLayer = this.viewer.scene.primitives.get3DTileLayer(layer);
        if (Cesium.defined(tilesetLayer)) {
          const ids = this.hideElement[layer];
          tilesetLayer.setIdShow(ids, true);
        }
      }
      this.hideElement = {};
      for (let i = 0; i < this.hideLayers.length; i++) {
        const tilesetLayer = this.viewer.scene.primitives.get3DTileLayer(
          this.hideLayers[i]
        );
        if (Cesium.defined(tilesetLayer)) {
          tilesetLayer.show = true;
        }
      }
    }
    const bimLevelInfors = this.bimTreeInfors[id];
    if (Cesium.defined(bimLevelInfors)) {
      const index = bimLevelInfors.index;
      for (const levelId in this.bimTreeInfors) {
        const levelInforTemp = this.bimTreeInfors[levelId];
        if (levelInforTemp.index > index) {
          if (Cesium.defined(levelInforTemp.type)) {
            if (levelInforTemp.type === 'layer') {
              //图层级控制
              const tilesetLayer = this.viewer.scene.primitives.get3DTileLayer(
                levelInforTemp.layername
              );
              if (Cesium.defined(tilesetLayer)) {
                tilesetLayer.show = false;
                this.hideLayers.push(levelInforTemp.layername);
              }
            }
          } else {
            const layerName = levelInforTemp.layername;
            const ids = levelInforTemp.ids;
            if (Cesium.defined(this.hideElement[layerName])) {
              const idsCopy = JSON.parse(JSON.stringify(ids));
              this.hideElement[layerName] = [
                ...this.hideElement[layerName],
                ...idsCopy
              ];
            } else {
              const idsCopy = JSON.parse(JSON.stringify(ids));
              this.hideElement[layerName] = idsCopy;
            }
          }
        }
      }
      //逐个图层设置隐藏
      for (const layer in this.hideElement) {
        const tilesetLayer = this.viewer.scene.primitives.get3DTileLayer(layer);
        if (Cesium.defined(tilesetLayer)) {
          const ids = this.hideElement[layer];
          tilesetLayer.setIdShow(ids, false);
        }
      }
    }
  }

  /**
   * @Descripttion: 移除三级图
   * @return {*}
   */

  RemoveL3layer() {
    if (Cesium.defined(this.clippingStoreInfors)) {
      //移除三级图
      if (Cesium.defined(this.clippingStoreInfors['l3LayerNames'])) {
        const l3LayerNames = this.clippingStoreInfors['l3LayerNames'];
        for (let i = 0; i < l3LayerNames.length; i++) {
          this.removeTilesetLayer(l3LayerNames[i]); //移除并销毁三级图
        }
      }
      //移除挖洞
      if (Cesium.defined(this.clippingStoreInfors['clippingLayerNames'])) {
        const clippingLayerNames =
          this.clippingStoreInfors['clippingLayerNames'];
        for (let i = 0; i < clippingLayerNames.length; i++) {
          this.removeTilesetClippingPolygon(clippingLayerNames[i]); //移除挖洞
        }
      }
      //移除地形挖洞
      if (
        Cesium.defined(this.clippingStoreInfors['needClippingTerrain']) &&
        this.clippingStoreInfors['needClippingTerrain'] === true
      ) {
        this.removeTerrainClippingPolygon();
      }
    }
    //先将已隐藏的设置可见
    if (Cesium.defined(this.hideElement)) {
      for (const layer in this.hideElement) {
        const tilesetLayer = this.viewer.scene.primitives.get3DTileLayer(layer);
        if (Cesium.defined(tilesetLayer)) {
          const ids = this.hideElement[layer];
          tilesetLayer.setIdShow(ids, true);
        }
      }
    }
    //添加L3模型
    this.clippingStoreInfors = {};
    //生成信息树,临时记录信息树
    this.bimTreeInfors = {};
    //记录已经被隐藏的部件
    this.hideElement = {};
    //图层
    this.hideLayers = [];
    this.choselayers = {};
    //把信息树清空
    // const layerElement = document.getElementById('levelGroup')
    // layerElement.style.height = '0px'
    // layerElement.innerHTML = ''

    //把三级图事件清空
    if (Cesium.defined(this.l3LayerLeftClickHandle)) {
      this.l3LayerLeftClickHandle.destroy();
    }
    this.l3LayerLeftClickHandle = undefined;
    this.l3Data[this.l3DataLabel] = {
      dataList: [],
      label: this.l3DataLabel
    };
    let _event = new Event('mapTreeDataChange');
    window.dispatchEvent(_event);
  }

  /**
   * @Descripttion: 场景点击获取范围
   * @return {*}
   */
  addPickEvent() {
    if (!Cesium.defined(this.l3LayerLeftClickHandle)) {
      const scene = this.viewer.scene;
      const globe = scene.globe;
      this.l3LayerLeftClickHandle = new Cesium.ScreenSpaceEventHandler(
        scene.canvas
      );
      const that = this;
      this.l3LayerLeftClickHandle.setInputAction(function (click) {
        const feature = scene.pick(click.position);
        if (Cesium.defined(feature)) {
          if (feature instanceof Cesium.Cesium3DTileFeature) {
            if (
              Cesium.defined(feature._content) &&
              Cesium.defined(feature._content._tileset)
            ) {
              const layerName = feature._content._tileset._layerName;
              console.log('layertree:' + layerName);
              //切换信息树
              const choseLayerInforTemp = that.choselayers[layerName];
              if (Cesium.defined(choseLayerInforTemp)) {
                that.ResetTreeInfor();
                that.bimTreeInfors = choseLayerInforTemp;
                that.IniTreeInfor(choseLayerInforTemp, that.l3DataLabel);
              }
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
  }

  //注意，这里挖洞是个二维数组，表示多个洞,不支持带洞的多边形挖洞
  addTilesetClippingPolygon(layername, position) {
    for (let prop in this.layers) {
      if (Cesium.defined(layername)) {
        if (prop !== layername) {
          continue;
        }
      }
      const layer = this.layers[prop];
      if (layer instanceof Cesium.Cesium3DTileset) {
        if (!Cesium.defined(layer.clippingPolygons)) {
          layer.clippingPolygons = new Cesium.ClippingPolygonCollection({
            maxPixelSize: 512
          });
        }
        layer.clippingPolygons.enabled = true;
        for (let i = 0; i < position.length; i++) {
          layer.clippingPolygons.add(
            new Cesium.ClippingPolygon({
              positions: Cesium.Cartesian3.fromDegreesArray(position[i])
            })
          );
        }
      }
    }
  }

  /**
   * @Descripttion: 地形上挖洞
   * @param {*} position
   * @return {*}
   */
  addTerrainClippingPolygon(position) {
    const globe = this.viewer.scene.globe;
    if (!Cesium.defined(globe.clippingPolygons)) {
      globe.clippingPolygons = new Cesium.ClippingPolygonCollection({
        maxPixelSize: 512
      });
    }
    globe.clippingPolygons.enabled = true;
    for (let i = 0; i < position.length; i++) {
      globe.clippingPolygons.add(
        new Cesium.ClippingPolygon({
          positions: Cesium.Cartesian3.fromDegreesArray(position[i])
        })
      );
    }
  }

  /**
   * @Descripttion: 移除挖洞
   * @param {*} layername
   * @return {*}
   */
  removeTilesetClippingPolygon(layername) {
    for (let prop in this.layers) {
      if (Cesium.defined(layername)) {
        if (prop !== layername) {
          continue;
        }
      }
      const layer = this.layers[prop];
      if (layer instanceof Cesium.Cesium3DTileset) {
        if (Cesium.defined(layer.clippingPolygons)) {
          layer.clippingPolygons.removeAll();
          layer.clippingPolygons.enabled = false;
        }
      }
    }
  }

  removeTerrainClippingPolygon() {
    const globe = this.viewer.scene.globe;
    if (Cesium.defined(globe.clippingPolygons)) {
      globe.clippingPolygons.removeAll();
      globe.clippingPolygons.enabled = false;
    }
  }

  removeTilesetLayer(layername) {
    const layer = this.layers[layername];
    if (Cesium.defined(layer) && layer instanceof Cesium.Cesium3DTileset) {
      this.viewer.scene.primitives.removeAndDestroy(layer);
    }
  }

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  /**
   * @Descripttion: 通过配置来获取映射
   * @return {*}
   */
  async getUrlPrefix() {
    // debugger
    const res = await commonUtits.getUrlPrefix({
      configCode: 'AREACODEMAPPING'
    });
    if (res.serviceSuccess) {
      try {
        const OBJ = JSON.parse(res.data.result.configValue || '{}');
        console.log(OBJ, 'OBJ');
        if (OBJ) {
          this.areaCodeMapping = OBJ || {};
        }
      } catch (error) {}
    }
  }

  /** 新版本-在线引入方式
   * @Descripttion: 根据区域编码加载地图包含地形影像以及三维模型-调用了系统接口 /areaCode/getAreaCascadeList
   * @param {*} areaCode 区域编码
   * @param {*} isAddMap 是否加载对应区的地形影像地图
   * @param {*} serverUrl 服务地址，cesium_url,默认 public
   * @return {*}
   */

  async initCesiumMap(areaCode, isAddMap = true, serverUrl = 'public') {
    console.log(this.areaCodeMapping, '映射编码');
    const useId = '32697850912581';
    const api =
      `http://${this.cesium_url[serverUrl]}:12308/api/honeyscene/` +
      useId +
      '/';
    const checkApi =
      `http://${this.cesium_url[serverUrl]}:12308/api/honeyscene/check/` +
      useId +
      '/';
    const params = {
      level: '5',
      value: areaCode
    };
    const res = await Base.submit(
      null,
      {
        data: params,
        url: '/areaCode/getAreaCascadeList',
        withCredentials: false
      },
      {},
      true
    );
    if (res.serviceSuccess) {
      console.log(res);
      const areaCodeList = res.data.areaCodeList;
      // 是否补充区县编码
      if (isAddMap) {
        // 转换编码
        if (!!this.areaCodeMapping[areaCode]) {
          areaCodeList.push({
            value: this.areaCodeMapping[areaCode] + '000'
          });
        } else {
          areaCodeList.push({
            value: areaCode + '000'
          });
        }
      }
      const effectiveAreaCodeList = [];
      console.log(areaCodeList, 'areaCodeList');
      areaCodeList.forEach((areaCode) => {
        // console.log(areaCode.value,this.areaCodeMapping[areaCode.value],'111')
        let url = '';
        if (!!this.areaCodeMapping[areaCode.value]) {
          url = checkApi + this.areaCodeMapping[areaCode.value] + '000';
        } else {
          url = checkApi + areaCode.value + '000';
        }
        // 检测镇街是否有三维模型服务
        axios.get(url).then((res) => {
          if (res && res.status === 200 && res.data) {
            if (
              res.data.type === 'success' &&
              res.data.code === 200 &&
              res.data.result
            ) {
              if (
                res.data.result.has3D === true ||
                res.data.result.name.includes('地形') ||
                res.data.result.name.includes('影像')
              ) {
                // console.log(
                //   '有三维模型',
                //   res.data.result.name,
                //   res.data.result.name.includes('地形影像')
                // )
                let _url = api + areaCode.value + '000';
                // 兼容民政的编码
                if (!!this.areaCodeMapping[areaCode.value]) {
                  _url = api + this.areaCodeMapping[areaCode.value] + '000';
                }
                effectiveAreaCodeList.push(_url);
                const addr = [_url];
                axios
                  .all([_url].map((url) => axios.get(url)))
                  .then(
                    axios.spread((...responses) => {
                      const results = responses.map(
                        (response) => response.data.result
                      );
                      const items = [];
                      // debugger
                      results.map((result) => {
                        for (let i = 0; i < result?.svcItem.length; i++) {
                          result.svcItem[i].checked = true;
                          items.push(result?.svcItem[i]);
                        }
                      });
                      // 地形必须在最开始加，将结果放到一个列表中，排序后加载
                      const access_server = addr[0].substring(
                        0,
                        addr[0].indexOf('/', 10)
                      );
                      // 加载数据：地形、影像、实景,
                      this.LoadScene(items, access_server, false);
                    })
                  )
                  .catch((error) => {
                    console.error(
                      'There has been a problem with your axios operation:',
                      error
                    );
                  });
              } else {
                console.log('不存在三维模型', url);
              }
            }
          }
        });
      });
      // this.topAreaList = res.data.areaCodeList
      // this.topAreaListCopy = res.data.areaCodeList
    }
  }
  /** 新版本-在线引入方式-加载区县采用区县编码
   * @Descripttion: 根据区域编码加载地图包含地形影像以及三维模型-调用了系统接口 /areaCode/getAreaCascadeList
   * @param {*} areaCode 区域编码
   * @param {*} isAddMap 是否加载对应区的地形影像地图
   * @param {*} serverUrl 服务地址，cesium_url,默认 public
   * @return {*}
   */

  async initCesiumMapByQx(areaCode, isAddMap = true, serverUrl = 'public') {
    console.log(this.areaCodeMapping, '映射编码');
    const useId = '32697850912581';
    const api =
      `http://${this.cesium_url[serverUrl]}:12308/api/honeyscene/` +
      useId +
      '/';
    const checkApi =
      `http://${this.cesium_url[serverUrl]}:12308/api/honeyscene/check/` +
      useId +
      '/';
    // const params = {
    //   level: '5',
    //   value: areaCode
    // };
    // const res = await Base.submit(
    //   null,
    //   {
    //     data: params,
    //     url: '/areaCode/getAreaCascadeList',
    //     withCredentials: false
    //   },
    //   {},
    //   true
    // );
    // if (res.serviceSuccess) {
    // console.log(res);
    // const areaCodeList = res.data.areaCodeList;
    // 映射区县编码
    // if (isAddMap) {
    //   // 转换编码
    //   if (!!this.areaCodeMapping[areaCode]) {
    //     areaCodeList.push({
    //       value: this.areaCodeMapping[areaCode] + '000'
    //     });
    //   } else {
    //     areaCodeList.push({
    //       value: areaCode + '000'
    //     });
    //   }
    // }
    const effectiveAreaCodeList = [];
    // console.log(areaCodeList, 'areaCodeList');
    // areaCodeList.forEach(areaCode => {
    // console.log(areaCode.value,this.areaCodeMapping[areaCode.value],'111')
    let url = '';
    // 20250412 渝中区需要在地址后面再拼接一个'000/v_light'
    // if (!!this.areaCodeMapping[areaCode] && this.areaCodeMapping[areaCode] === '500103') {
    //   url = checkApi + this.areaCodeMapping[areaCode] + '000000/v_light';
    if (!!this.areaCodeMapping[areaCode]) {
      url = checkApi + this.areaCodeMapping[areaCode] + '000000/v_light';
    }
    // else if (areaCode === '500103') {
    //   url = checkApi + areaCode + '000000/v_light';
    // }
    else {
      url = checkApi + areaCode + '000000/v_light';
    }

    // 检测镇街是否有三维模型服务
    axios.get(url).then((res) => {
      if (res && res.status === 200 && res.data) {
        if (
          res.data.type === 'success' &&
          res.data.code === 200 &&
          res.data.result
        ) {
          if (
            res.data.result.has3D === true ||
            res.data.result.name.includes('地形') ||
            res.data.result.name.includes('影像')
          ) {
            // console.log(
            //   '有三维模型',
            //   res.data.result.name,
            //   res.data.result.name.includes('地形影像')
            // )
            // 20250412 渝中区需要在地址后面再拼接一个'000/v_light'
            let _url = api + areaCode + '000000/v_light';
            // if (areaCode === '500103') {
            //   _url = api + areaCode + '000000/v_light';
            // }
            // 兼容民政的编码
            if (!!this.areaCodeMapping[areaCode]) {
              _url = api + this.areaCodeMapping[areaCode] + '000000/v_light';
            }
            // if (!!this.areaCodeMapping[areaCode] && this.areaCodeMapping[areaCode] === '500103') {
            //   _url = api + this.areaCodeMapping[areaCode] + '000000/v_light';
            // }
            effectiveAreaCodeList.push(_url);
            const addr = [_url];
            axios
              .all([_url].map((url) => axios.get(url)))
              .then(
                axios.spread((...responses) => {
                  const results = responses.map(
                    (response) => response.data.result
                  );
                  const items = [];
                  // debugger
                  results.map((result) => {
                    for (let i = 0; i < result?.svcItem.length; i++) {
                      result.svcItem[i].checked = true;
                      items.push(result?.svcItem[i]);
                    }
                  });
                  // 地形必须在最开始加，将结果放到一个列表中，排序后加载
                  const access_server = addr[0].substring(
                    0,
                    addr[0].indexOf('/', 10)
                  );
                  // 加载数据：地形、影像、实景,
                  this.LoadScene(items, access_server, false);
                })
              )
              .catch((error) => {
                console.error(
                  'There has been a problem with your axios operation:',
                  error
                );
              });
          } else {
            console.log('不存在三维模型', url);
          }
        }
      }
    });
    // });
    // this.topAreaList = res.data.areaCodeList
    // this.topAreaListCopy = res.data.areaCodeList
    // }
  }
  /**
   * @Descripttion: 添加服务
   * @param {*} server_url '34554403916101'
   * @param {*} serverUrl 服务方式
   * @return {*}
   */

  async addWaterAndBridge(server_url = '34554403916101', serverUrl = 'public') {
    // debugger
    const useId = '32697850912581';
    const api =
      `http://${this.cesium_url[serverUrl]}:12308/api/honeyscene/` +
      useId +
      '/';
    const checkApi =
      `http://${this.cesium_url[serverUrl]}:12308/api/honeyscene/check/` +
      useId +
      '/';
    const effectiveAreaCodeList = [];
    const url = checkApi + server_url;
    // 检测镇街是否有三维模型服务
    axios.get(url).then((res) => {
      if (res && res.status === 200 && res.data) {
        if (
          res.data.type === 'success' &&
          res.data.code === 200 &&
          res.data.result
        ) {
          if (
            res.data.result.has3D === true ||
            res.data.result.name.includes('地形') ||
            res.data.result.name.includes('影像')
          ) {
            // console.log(
            //   '有三维模型',
            //   res.data.result.name,
            //   res.data.result.name.includes('地形影像')
            // )
            effectiveAreaCodeList.push(api + server_url);
            const addr = [api + server_url];
            axios
              .all([api + server_url].map((url) => axios.get(url)))
              .then(
                axios.spread((...responses) => {
                  const results = responses.map(
                    (response) => response.data.result
                  );
                  const items = [];
                  // debugger
                  results.map((result) => {
                    for (let i = 0; i < result?.svcItem.length; i++) {
                      result.svcItem[i].checked = true;
                      items.push(result?.svcItem[i]);
                    }
                  });
                  // 地形必须在最开始加，将结果放到一个列表中，排序后加载
                  const access_server = addr[0].substring(
                    0,
                    addr[0].indexOf('/', 10)
                  );
                  // 加载数据：地形、影像、实景,
                  this.LoadScene(items, access_server, false);
                })
              )
              .catch((error) => {
                console.error(
                  'There has been a problem with your axios operation:',
                  error
                );
              });
          } else {
            console.log('不存在三维模型', url);
          }
        }
      }
    });
  }

  /**
   * @Descripttion: 对地址数据排序 使影像高程在前创建
   * @param {*} svcItem  地址数据列表
   * @return {*}
   */

  SortItem(svcItem) {
    //同步加载的时候影像高程在后会造成错误，这里排序，使影像高程在前创建
    const imgValue = 2,
      terrValue = 4,
      _3dValue = 8;
    // debugger
    for (let i = 0, sLen = svcItem.length; i < sLen; i++) {
      const item = svcItem[i];
      const lowSpa = item.spare.toLowerCase();
      if (
        item.class === 'gkfcesium1' ||
        item.class === 'gkfcesium2' ||
        item.class === 'gkfcvs'
      ) {
        item.ittype = _3dValue;
      } else if (item.class === 'gkfarctpk') {
        if (lowSpa.indexOf('/mapserver') >= 0) {
          item.ittype = terrValue;
        } else if (lowSpa.indexOf('/imageserver') >= 0) {
          item.ittype = imgValue;
        }
      } else if (item.class === 'gkproxyshare') {
        if (lowSpa.indexOf('/mapserver') >= 0) {
          item.ittype = terrValue;
        } else if (lowSpa.indexOf('/imageserver') >= 0) {
          item.ittype = imgValue;
        }
      } else if (item.class === 'gkfwmts') {
        if (lowSpa.indexOf('/meta.json') >= 0) {
          item.ittype = terrValue;
        } else if (lowSpa.indexOf('/layer.json') >= 0) {
          item.ittype = imgValue;
        }
      }
    }
    const compare = function (obj1, obj2) {
      const val1 = obj1.ittype;
      const val2 = obj2.ittype;
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    };
    svcItem.sort(compare);
    return svcItem;
  }
  /**
   * @Descripttion: 加载三维模型
   * @param {*} item
   * @param {*} isSync
   * @return {*}
   */

  async Load3DTiles1(item, isSync) {
    this.hasFirstEye = false;
    // 同步方法外层注意要 try... catch...
    if (isSync === true) {
      const resource = await Cesium.IonResource.fromAssetId(item.id, {
        server: this.access_server,
        accessToken: this.access_token
      });
      const tileset = await Cesium.Cesium3DTileset.fromUrl(resource);
      tileset.id = item.name; // 使用节点的 name 作为 Tileset 的 id
      // 手动修改显示可见距离属性
      // layer._distanceDisplayCondition = new Cesium.DistanceDisplayCondition(
      //   0,
      //   20000000
      // )
      this.layers[item.name] = tileset; // 存储 Tileset 对象
      this.viewer.scene.primitives.add(tileset);
      if (!this.hasFirstEye) {
        // 第一个三维模型初始化完成后操作
        if (Cesium.defined(this.sceneFirstReadyCallback)) {
          this.sceneFirstReadyCallback(tileset);
        }
        this.hasFirstEye = true;
      }
    } else {
      // 异步
      // debugger
      Cesium.IonResource.fromAssetId(item.id, {
        server: this.access_server,
        accessToken: this.access_token
      })
        .then((resource) => {
          const tilesetPromise = Cesium.Cesium3DTileset.fromUrl(resource);
          tilesetPromise
            .then((layer) => {
              // console.log(layer,layer.distanceDisplayCondition,'tileset1')
              // 手动修改显示可见距离属性
              // layer._distanceDisplayCondition = new Cesium.DistanceDisplayCondition(
              //   0,
              //   20000000
              // )
              // console.log(layer,layer.distanceDisplayCondition,'tileset2')
              this.viewer.scene.primitives.add(layer);
              layer.id = item.name; // 使用节点的 name 作为 Tileset 的 id
              this.layers[item.name] = layer; // 存储 Tileset 对象
              if (!this.hasFirstEye) {
                // 第一个三维模型初始化完成后操作
                if (Cesium.defined(this.sceneFirstReadyCallback)) {
                  // debugger
                  this.sceneFirstReadyCallback(layer);
                }
                this.hasFirstEye = true;
                // tileset.readyPromise.then(tileset2 => {
                // this.viewer.zoomTo(tileset)
                // })
              }
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  async Load3DTiles(item, isSync) {
    //同步方法外层注意要 try... catch...
    if (isSync === true) {
      const resource = await Cesium.IonResource.fromAssetId(item.id, {
        server: this.access_server,
        accessToken: this.access_token
      });
      const tileset = await Cesium.Cesium3DTileset.fromUrl(resource, {
        name: item.sname
      }); //distanceDisplayCondition:new Cesium.DistanceDisplayCondition(0.0, 300000.0),
      tileset.id = item.sname; // 使用节点的 name 作为 Tileset 的 id
      this.layers[item.sname] = tileset; // 存储 Tileset 对象
      this.viewer.scene.primitives.add(tileset);
      if (!this.hasFirstEye) {
        //第一个三维模型初始化完成后操作
        if (Cesium.defined(this.sceneFirstReadyCallback)) {
          this.sceneFirstReadyCallback(tileset);
        }
        this.hasFirstEye = true;
      }
    }
    //异步
    else {
      Cesium.IonResource.fromAssetId(item.id, {
        server: this.access_server,
        accessToken: this.access_token
      })
        .then((resource) => {
          const tilesetPromise = Cesium.Cesium3DTileset.fromUrl(resource, {
            name: item.sname
          }); //distanceDisplayCondition:new Cesium.DistanceDisplayCondition(0.0, 300000.0),
          tilesetPromise
            .then((layer) => {
              this.viewer.scene.primitives.add(layer);
              layer.id = item.sname; // 使用节点的 name 作为 Tileset 的 id
              this.layers[item.sname] = layer; // 存储 Tileset 对象
              if (!this.hasFirstEye) {
                //第一个三维模型初始化完成后操作
                if (Cesium.defined(this.sceneFirstReadyCallback)) {
                  this.sceneFirstReadyCallback(layer);
                }
                this.hasFirstEye = true;
              }
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  /**
   * @Descripttion: 加载arcgis服务
   * @param {*} item
   * @param {*} isSync
   * @return {*}
   */
  async LoadArcGisMapServerImagery(item, isSync = false) {
    // 同步方法外层注意要 try... catch...
    if (isSync === true) {
      const resource = await Cesium.IonResource.fromAssetId(item.id, {
        server: item.url,
        accessToken: this.access_token
      });
      const imageryProvider =
        await Cesium.ArcGisMapServerImageryProvider.fromUrl(resource);
      const layer = new Cesium.ImageryLayer(imageryProvider);
      layer.id = item.label; // 设置图层的 id 为节点的 label
      this.viewer.imageryLayers.add(layer);
      this.layers[item.label] = layer; // 存储图层对象
    } else {
      // 异步
      // debugger
      Cesium.IonResource.fromAssetId(item.id, {
        server: item.url,
        accessToken: this.access_token
      })
        .then((resource) => {
          Cesium.ArcGisMapServerImageryProvider.fromUrl(resource)
            .then((imageryProvider) => {
              const layer = new Cesium.ImageryLayer(imageryProvider);
              layer.id = item.label; // 设置图层的 id 为节点的 label
              this.viewer.imageryLayers.add(layer);
              this.layers[item.label] = layer; // 存储图层对象
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  /**
   * @Descripttion:加载gis数据
   * @param {*} item
   * @param {*} isSync
   * @return {*}
   */
  async LoadArcGISTiledElevationTerrain(item, isSync) {
    // 同步方法外层注意要 try... catch...
    if (isSync === true) {
      const resource = await Cesium.IonResource.fromAssetId(item.id, {
        server: this.access_server,
        accessToken: this.access_token
      });
      this.viewer.scene.terrainProvider =
        await Cesium.ArcGISTiledElevationTerrainProvider.fromUrl(resource);
      this.terrainProviders[item.name] = terrainProvider; // 存储地形
    }
    // 异步
    else {
      Cesium.IonResource.fromAssetId(item.id, {
        server: this.access_server,
        accessToken: this.access_token
      })
        .then((resource) => {
          Cesium.ArcGISTiledElevationTerrainProvider.fromUrl(resource)
            .then((terrainProvider) => {
              this.viewer.scene.terrainProvider = terrainProvider;
              this.terrainProviders[item.name] = terrainProvider; // 存储地形
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  /**
   * @Descripttion: 加载wmts图像
   * @param {*} item
   * @param {*} isSync
   * @return {*}
   */
  async LoadWmtsImagery(item, isSync) {
    // 同步方法外层注意要 try... catch...
    if (isSync === true) {
      const resource = await Cesium.IonResource.fromAssetId(item.id, {
        server: this.access_server,
        accessToken: this.access_token
      });
      if (resource.url.indexOf('/meta.json') > 0)
        resource.url = resource.url.substring(
          0,
          resource.url.indexOf('/meta.json')
        );
      resource.url = resource.url + '/{z}/{x}/{y}';
      const layer = new Cesium.ImageryLayer(
        await Cesium.UrlTemplateImageryProvider.fromUrl(resource)
      );
      this.viewer.imageryLayers.add(layer);
      layer.id = item.name;
      this.layers[item.name] = layer; // 存储图层对象
    }
    //异步
    else {
      Cesium.IonResource.fromAssetId(item.id, {
        server: this.access_server,
        accessToken: this.access_token
      })
        .then((resource) => {
          if (resource.url.indexOf('/meta.json') > 0)
            resource.url = resource.url.substring(
              0,
              resource.url.indexOf('/meta.json')
            );
          resource.url = resource.url + '/{z}/{x}/{y}';
          Cesium.UrlTemplateImageryProvider.fromUrl(resource)
            .then((imageryProvider) => {
              const layer = new Cesium.ImageryLayer(imageryProvider);
              this.viewer.imageryLayers.add(layer);
              layer.id = item.name;
              this.layers[item.name] = layer; // 存储图层对象
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  /**
   * @Descripttion: 加载wmts地形
   * @param {*} item
   * @param {*} isSync
   * @return {*}
   */
  async LoadWmtsTerrain(item, isSync) {
    // 同步方法外层注意要 try... catch...
    if (isSync === true) {
      const resource = await Cesium.IonResource.fromAssetId(item.id, {
        server: this.access_server,
        accessToken: this.access_token
      });
      if (resource.url.indexOf('/layer.json') > 0)
        resource.url = resource.url.substring(
          0,
          resource.url.indexOf('/layer.json')
        );
      this.viewer.terrainProvider =
        await Cesium.CesiumTerrainProvider.fromUrl(resource);
      this.terrainProviders[item.name] = this.viewer.terrainProvider; // 存储地形提供者对象
    }
    //异步
    else {
      Cesium.IonResource.fromAssetId(item.id, {
        server: this.access_server,
        accessToken: this.access_token
      })
        .then((resource) => {
          if (resource.url.indexOf('/layer.json') > 0)
            resource.url = resource.url.substring(
              0,
              resource.url.indexOf('/layer.json')
            );
          Cesium.CesiumTerrainProvider.fromUrl(resource)
            .then((terrainProvider) => {
              this.viewer.scene.terrainProvider = terrainProvider;
              this.terrainProviders[item.name] = terrainProvider; // 存储地形提供者对象
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  /**
   * 请求集景三维场景信息并创建图层对象
   */
  LoadScene(
    items,
    access_server,
    sync = false,
    sceneReadyCallback = this.SceneReadyHandleCallback
  ) {
    this.access_token = arguments.length === 3 ? arguments[2] : '';
    this.access_server = access_server;
    const isSync = sync;
    this.sceneFirstReadyCallback = sceneReadyCallback;
    const svcItem = this.SortItem(items);
    console.log(svcItem, 'svcItem');
    // 加载
    for (let i = 0, sLen = svcItem.length; i < sLen; i++) {
      const item = svcItem[i];
      const lowSpa = item.spare.toLowerCase();
      // 根据类型创建不同的图层
      try {
        if (
          item.class === 'gkfcesium1' ||
          item.class === 'gkfcesium2' ||
          item.class === 'gkfcvs'
        ) {
          this.Load3DTiles(item, isSync);
        } else if (item.class === 'gkfarctpk') {
          if (lowSpa.indexOf('/mapserver') >= 0) {
            this.LoadArcGisMapServerImagery(item, isSync);
          } else if (lowSpa.indexOf('/imageserver') >= 0) {
            this.LoadArcGISTiledElevationTerrain(item, isSync);
          }
        } else if (item.class === 'gkfwmts') {
          if (lowSpa.indexOf('/meta.json') >= 0) {
            this.LoadWmtsImagery(item, isSync);
          } else if (lowSpa.indexOf('/layer.json') >= 0) {
            this.LoadWmtsTerrain(item, isSync);
          }
        } else if (item.class === 'gkproxyshare') {
          if (lowSpa.indexOf('/mapserver') >= 0) {
            this.LoadArcGisMapServerImagery(item, isSync);
          } else if (lowSpa.indexOf('/imageserver') >= 0) {
            this.LoadArcGISTiledElevationTerrain(item, isSync);
          } else if (lowSpa.indexOf('/meta.json') >= 0) {
            this.LoadWmtsImagery(item, isSync);
          } else if (lowSpa.indexOf('/layer.json') >= 0) {
            this.LoadWmtsTerrain(item, isSync);
          }
        } else {
          console.warn(item);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  /**
   * @Descripttion: 第一个三维模型加载后回调事件
   * @param {*} tileset
   * @return {*}
   */
  SceneReadyHandleCallback(tileset) {
    // console.log(tileset, '测试1111')
    tileset && this.viewer.zoomTo(tileset);
  }

  /**
   * @Descripttion: 初始化地图-老版本
   * @param {*} domId 节点id
   * @return {*}
   */
  initMap(domId, isTrans = false) {
    this.viewer = new Cesium.Viewer(domId, {
      // terrain: Cesium.Terrain.fromWorldTerrain(),
      // terrainProvider:Cesium.createWorldTerrain(),
      selectionIndicator: false,
      animation: false, // 是否显示动画控件
      homeButton: false, // 是否显示home键
      geocoder: false, // 是否显示地名查找控件
      baseLayerPicker: false, // 是否显示图层选择控件
      timeline: false, // 是否显示时间线控件
      fullscreenButton: false, // 是否全屏显示
      scene3DOnly: false, // 如果设置为true，
      shouldAnimate: true,
      resolutionScale: 2,
      infoBox: false, // 是否显示点击要素之后显示的信息
      sceneModePicker: false, // 是否显示投影方式控件三维/二维
      navigationInstructionsInitiallyVisible: false,
      navigationHelpButton: false, // 是否显示帮助信息控件
      imageryProvider: new Cesium.SingleTileImageryProvider({
        url: isTrans
          ? require('../cesiumMap/img/bg-trans.jpg')
          : require('../cesiumMap/img/GlobalBkLayer1.jpg')
      }),
      // imageryProvider: new Cesium.SingleTileImageryProvider({
      //   url: require('../cesiumMap/img/bg-trans.jpg')
      // }),
      orderIndependentTranslucency: false
    });
    if (!this.viewer.scene.pickPositionSupported) {
      window.alert('This browser does not support pickPosition.');
    }

    this.viewer._cesiumWidget._creditContainer.style.display = 'none'; // 去除版权信息
    // const scene = this.viewer.scene
    // const globe = this.viewer.scene.globe
    // const canvas = this.viewer.scene.canvas

    // 开启罗盘 支持的话
    if (Cesium.defined(Cesium.viewerCesiumNavigationMixin)) {
      this.viewer.extend(Cesium.viewerCesiumNavigationMixin);
    }
  }

  /**
   * @Descripttion: 加载3D地理空间集数据
   * @param {*} url 链接
   * @param {*} name Type
   * @param {*} flyTo 是否切换视角
   * @return {*}
   */
  Add3dTilesLayer(url, name, flyTo = false, distanceDisplayCondition = 20000) {
    const Tiles = new Cesium.Cesium3DTileset({
      url: url,
      name: name,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        0,
        distanceDisplayCondition
      ),
      geometricErrorRatio: 2.0
    });
    // Tiles.show = false
    // console.log(Tiles, 'Tiles')
    const tileset = this.viewer.scene.primitives.add(Tiles);
    this.tilesets.push(tileset);
    // console.log(this.tilesets.length, '康康数量')
    // 修改样式
    // const properties = tileset.properties
    // debugger
    // if (Cesium.defined(properties) && Cesium.defined(properties.Height)) {
    //   tileset.style = new Cesium.Cesium3DTileStyle({
    //     color: {
    //       conditions: [
    //         ['${Height} >= 83', "color('red')"],
    //         ['${Height} >= 80', "color('red')"],
    //         ['${Height} >= 70', "color('red')"],
    //         ['${Height} >= 12', "color('red')"],
    //         ['${Height} >= 7', "color('red')"],
    //         ['${Height} >= 1', "color('red')"],
    //         ['true', "color('blue')"]
    //       ]
    //     }
    //   })
    // }
    // const xx =  Cesium3DTileFeature.getPropertyNames()
    // console.log(xx,'xx')
    // tileset.style = new Cesium.Cesium3DTileStyle({
    //   color: {
    //     conditions: [
    //       ['${height} >= 300', 'rgba(45, 0, 75, 0.5)'],
    //       ['${height} >= 200', 'rgb(102, 71, 151)'],
    //       ['${height} >= 100', 'rgb(170, 162, 204)'],
    //       ['${height} >= 50', 'rgb(224, 226, 238)'],
    //       ['${height} >= 25', 'rgb(252, 230, 200)'],
    //       ['${height} >= 10', 'rgb(248, 176, 87)'],
    //       ['${height} >= 5', 'rgb(198, 106, 11)'],
    //       ['true', 'rgb(127, 59, 8)']
    //     ]
    //   }
    // })
    if (flyTo) {
      tileset.readyPromise.then((tileset2) => {
        this.viewer.zoomTo(tileset2);
      });
    }
  }

  /**
   * @Descripttion: 删除  this.tilesets  中的3d模型
   * @return {*}
   */
  remove3dTilesLayer() {
    // debugger
    // const keys = Object.keys(this.layers)
    for (let i in this.layers) {
      console.log(i, this.layers[i], '删除');
      this.viewer.scene.primitives.remove(this.layers[i]);
    }
    // this.tilesets.forEach(item => {
    //   // if()
    //   this.viewer.scene.primitives.remove(item)
    // })
  }

  /**
   * @Descripttion: 添加3D地图包含模型，影像，地形
   * @param {*} option url地址 三维模型TilesLayer，影像ImageryLayer，地形terrainLayer
   * @return {*}
   */
  Add3DScene(option) {
    // 三维模型
    // this.Add3dTilesLayer(
    //   'http://23.134.134.19:12306/honeycomb/gkfcesium1/cesium1_ct2023sj_02_20231109/data/tileset.json',
    //   'block',
    //   true
    // )
    // this.Add3dTilesLayer(
    //   'http://23.134.134.19:12306/honeycomb/gkfcesium1/cesium1_ct2023sj_02_20231109/data/tileset.json',
    //   'block',
    //   true
    // )
    option.TilesLayer.length > 0 &&
      option.TilesLayer.forEach((item) => {
        this.Add3dTilesLayer(
          item,
          'block',
          true,
          option.distanceDisplayCondition
        );
      });
    // console.log(this.tilesets.length, '康康数量')
    // 添加影像
    if (option.ImageryLayer) {
      const ImageryLayer = new Cesium.ImageryLayer(
        new Cesium.UrlTemplateImageryProvider({
          url: option.ImageryLayer,
          // url: 'http://23.134.134.19:12306/honeycomb/gkfwmts/wmts_zxcqsjyxgx_20230420/data/{z}/{x}/{y}',
          // rectangle:Cesium.Rectangle.fromDegrees(106.185704140924,29.1139281823305,107.072339192916,30.162943289879),
          maximumLevel: 17
        }),
        {
          name: 'imagery'
        }
      );
      this.viewer.imageryLayers.add(ImageryLayer);
    }

    // const imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
    //   url: option.ImageryLayer
    // })
    // this.viewer.imageryLayers.addImageryProvider(imageryProvider)

    // 添加Arcgis服务
    if (option.ArcGisLayer) {
      const ArcGisLayer = new Cesium.ImageryLayer(
        new Cesium.ArcGisMapServerImageryProvider({
          url: option.ArcGisLayer,
          layers: '0'
          // parameters:{
          //   format:"image/png",
          //   transparent:true
          // }
        })
      );
      this.viewer.imageryLayers.add(ArcGisLayer);
    }
    if (option.WmtsLayer) {
      // 创建WMTS服务的URL
      // const wmtsUrl =
      //   'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/353fbc47-7676-4d15-be08-dfec2f405424/75eea981-9413-4f7a-b783-3fc33daa2287/wmts'

      const wmtsImageryProvider = new Cesium.ImageryLayer(
        new Cesium.WebMapTileServiceImageryProvider({
          // url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/353fbc47-7676-4d15-be08-dfec2f405424/75eea981-9413-4f7a-b783-3fc33daa2287/wmts/fwgl-4c5698f7-e6a7-65f1-7371-1ec02009/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
          url: option.WmtsLayer,
          layer: 'fwgl-4c5698f7-e6a7-65f1-7371-1ec02009',
          style: 'default',
          format: 'image/png',
          tileMatrixSetID: 'webmercator',
          //tilingScheme: new Cesium.GeographicTilingScheme(),
          tileMatrixLabels: [
            '00',
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19'
          ],
          maximumLevel: 19
          //credit : new Cesium.Credit('U. S. Geological Survey')
        })
      );
      this.viewer.imageryLayers.add(wmtsImageryProvider);
    }

    // 添加地形
    const terrainLayer = new Cesium.CesiumTerrainProvider({
      // url: 'http://23.134.134.19:12306/honeycomb/gkfwmts/wmts_jbdem1109_20231109/data'
      url: option.terrainLayer
    });
    this.viewer.terrainProvider = terrainLayer;
    this.viewer.scene.globe.depthTestAgainstTerrain = false; // 深度检测
  }

  addWMTS() {
    const wmtsUrl =
      'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/353fbc47-7676-4d15-be08-dfec2f405424/75eea981-9413-4f7a-b783-3fc33daa2287/wmts';

    // 创建Cesium.WebMapTileServiceImageryProvider实例
    const wmtsImageryProvider = new Cesium.ImageryLayer(
      new Cesium.WebMapTileServiceImageryProvider({
        url: wmtsUrl,
        layer: 'exampleLayer',
        style: 'default',
        tileMatrixSetID: 'EPSG:3857',
        format: 'image/png',
        maximumLevel: 18 // 根据实际情况设置最大级别
      })
    );

    this.viewer.imageryLayers.add(wmtsImageryProvider);
  }
  /**
   * 移除全部图层
   */

  removeAll3DScene() {
    this.viewer.imageryLayers.removeAll(true);
  }

  /**
   * @Descripttion: 加载argis图层- 5.31号 升级了
   * @param {*} option
   * @param {*} callBack
   * @return {*}
   */
  async loadArcgisImageryLayer(option, callBack) {
    const isRepeated = this.imageryLayers.some(
      (ite) => ite.label === option.label
    );
    if (isRepeated) return;
    // console.log(option, 'option')
    if (typeof option.ArcGisLayer === 'object') {
      // 多个
      const list = [];
      option.ArcGisLayer.forEach(async (item, idx) => {
        const imageryProvider =
          await Cesium.ArcGisMapServerImageryProvider.fromUrl(item, {
            layers: [
              {
                id: option.layers[idx],
                minScale: 0,
                maxScale: 0
              }
            ],
            enablePickFeatures: true
          });
        const ArcGisLayer = new Cesium.ImageryLayer(imageryProvider);
        this.viewer.imageryLayers.add(ArcGisLayer);
        list.push(ArcGisLayer);
        console.log(this.viewer.imageryLayers, 'this.viewer.imageryLayers');
      });
      this.imageryLayers.push({
        label: option.label,
        url: option.ArcGisLayer,
        layer: option.layer,
        ArcGisLayer: list
      });
    } else {
      // 单个
      // debugger
      const resource = new Cesium.Resource({
        url: option.ArcGisLayer
      });
      const imageryProvider =
        await Cesium.ArcGisMapServerImageryProvider.fromUrl(
          option.ArcGisLayer,
          {
            layers: [
              {
                id: option.layers,
                // "name": "水厂",
                // "parentLayerId": 111,
                // "defaultVisibility": true,
                // "subLayerIds": null,
                minScale: 0,
                maxScale: 0
              }
            ],
            enablePickFeatures: true
          }
        );
      const ArcGisLayer = new Cesium.ImageryLayer(imageryProvider);
      this.viewer.imageryLayers.add(ArcGisLayer);
      // console.log(this.viewer.imageryLayers, 'this.viewer.imageryLayers')
      this.imageryLayers.push({
        label: option.label,
        ArcGisLayer,
        index: this.imageryLayersIndex,
        url: option.ArcGisLayer,
        layer: option.layer
      });
      // this.imageryLayersIndex++
      // console.log()
    }
    // 回调监听
    this.handler2.push(callBack);
  }
  // 备份老版本的

  loadArcgisImageryLayer1(option, callBack) {
    const isRepeated = this.imageryLayers.some(
      (ite) => ite.label === option.label
    );
    if (isRepeated) return;
    // console.log(option, 'option')
    if (typeof option.ArcGisLayer === 'object') {
      const list = [];
      option.ArcGisLayer.forEach((item, idx) => {
        const ArcGisLayer = new Cesium.ImageryLayer(
          new Cesium.ArcGisMapServerImageryProvider({
            url: item,
            layers: option.layers[idx],
            enablePickFeatures: true
          })
        );
        this.viewer.imageryLayers.add(ArcGisLayer);
        list.push(ArcGisLayer);
        console.log(this.viewer.imageryLayers, 'this.viewer.imageryLayers');
      });
      this.imageryLayers.push({
        label: option.label,
        url: option.ArcGisLayer,
        layer: option.layer,
        ArcGisLayer: list
      });
    } else {
      const ArcGisLayer = new Cesium.ImageryLayer(
        new Cesium.ArcGisMapServerImageryProvider({
          // name: 'shuichang',
          url: option.ArcGisLayer,
          // url:'http://23.210.52.80:18081/cockpit/api/drs/api/callUrl?url=http://drs.dsjfzj.cq.cegn.cn/restapi/prod/IC50000020240208000026/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/c2a5fade-1a55-4bf3-9655-edb49b778129/fce35059-5c37-41e4-97c1-372d658311ec/MapServer&jsonParamStr=%7B%22abc%22%3A%22dfd343%22%7D&TA-JTOKEN=eyJ0eXAiOiJqd3QiLCJjbGFnIjoiSFM1MTIiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiIxNzIuMjIuMi4xMDQiLCJpYXQiOjE3MDk2MDgyMjQsInN1YiI6Ijg4NjlENjUyRDdGMzFEOEQwNkM3MjA5NDE2NjVCRkY1NjM1MDgzMEQ1NTA0Rjk3ODRCMDI1RjM3NTdBMjhEMkVFOTJCNzExNTJDNTk3REExOTdGRkZGMkM5NDREQjFERCIsImp0aSI6IjEwYWY1ZTI1ODM1NzQ4ZmI5ODVmZmFhYzdmODRjNjVmIn0.H-xudJ3IWtVgQ2_26LEkpVzcav4xoJ3SSvFkcORpCX3DS5EEKWV_CIcEMY5XIZU0h41BIcwj17kNrYgB4PrD-A',
          layers: option.layers,
          enablePickFeatures: true
          // tileHeight: 300,
          // tileWidth: 200

          // parameters:{
          //   format:"image/png",
          //   transparent:true
          // }
        })
      );

      this.viewer.imageryLayers.add(ArcGisLayer);
      // console.log(this.viewer.imageryLayers, 'this.viewer.imageryLayers')
      this.imageryLayers.push({
        label: option.label,
        ArcGisLayer,
        index: this.imageryLayersIndex,
        url: option.ArcGisLayer,
        layer: option.layer
      });
      // this.imageryLayersIndex++
      // console.log()
    }

    this.handler2.push(callBack);
  }

  refreshTokenRetryCallback(resource, error) {
    if (error.statusCode === 403) {
      // 403 status code means a new token should be generated
      return getNewAccessToken()
        .then(function (token) {
          resource.queryParameters.access_token = token;
          return true;
        })
        .catch(function () {
          return false;
        });
    }

    return false;
  }

  /**
   * @Descripttion: 测试arcgis的另一种带头部的方式
   * @return {*}
   */

  async addArcgis3DTitle() {
    // const id = 'A50000000007568202308005028'
    const id = 'A500000000220756820230800502228';

    const arcgisResource = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
      new Cesium.Resource({
        url: 'http://23.36.250.69/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/96f25181-de9a-4591-845b-c86079b3e0c1/e2b5c05a-b3b3-405d-b715-de7d043ea6f7/MapServer',
        headers: {
          X_Business_CatalogCode: id
        },
        enablePickFeatures: true
      })
    );
    const ImageryLayer = new Cesium.ImageryLayer(arcgisResource);
    // this.viewer.imageryLayers.addImageryProvider(irsLayer)
    this.viewer.imageryLayers.add(ImageryLayer);

    // const ArcGisLayer = new Cesium.ImageryLayer(
    //   new Cesium.ArcGisMapServerImageryProvider({
    //     url: 'http://23.36.250.69/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/96f25181-de9a-4591-845b-c86079b3e0c1/e2b5c05a-b3b3-405d-b715-de7d043ea6f7/MapServer',
    //     headers: {
    //       X_Business_CatalogCode: id
    //     },
    //     // layers: '0'
    //     // parameters:{
    //     //   format:"image/png",
    //     //   transparent:true
    //     // }
    //   })
    // )
    // this.viewer.imageryLayers.add(ArcGisLayer)
    return;
    const url =
      'http://23.36.250.69/multApp/datamanager/service/0ac46df4-e112-41d6-bb77-14ca59acc87a/6e2217a5-c580-457d-bb16-1c8639a71bc3/aa7cc763-b631-47b3-b76a-719d78a2442b/MapServer';
    const Tiles = new Cesium.Cesium3DTileset({
      url: new Cesium.Resource({
        url: url,
        headers: {
          X_Business_CatalogCode: id
        },
        // proxy: new DefaultProxy('/proxy/'),
        // queryParameters: {
        //   'access_token': '123-435-456-000'
        // },
        retryCallback: this.refreshTokenRetryCallback,
        retryAttempts: 1
      })
    });
    this.viewer.scene.primitives.add(Tiles);
    // const tileset = this.viewer.scene.primitives.add(Tiles)

    // this.tilesets.push(tileset)
    return;
    const resource = new Resource({
      url,
      proxy: new DefaultProxy('/proxy/'),
      headers: {
        X_Business_CatalogCode: id
      }
      // queryParameters: {
      //   'access_token': '123-435-456-000'
      // },
      // retryCallback: refreshTokenRetryCallback,
      // retryAttempts: 1
    });
  }

  /**
   * @Descripttion: 测试
   * @return {*}
   */
  addImage() {
    // 获取当前视图范围，并转换为地理坐标
    const camera = window.SJCesiumMethod.viewer.scene.camera;
    const bounds = camera.computeViewRectangle();
    const arcgisUrl =
      'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/459abbb5-a81c-4586-9ae2-8329bd14fcfa/cd55c9be-de72-4d30-9aff-2da6c224f2a1/MapServer/124';
    const queryUrl = arcgisUrl + '/query';
    // const queryUrl = arcgisUrl

    const queryParams = {
      f: 'json',
      geometry: JSON.stringify({
        xmin: Cesium.Math.toDegrees(bounds.west),
        ymin: Cesium.Math.toDegrees(bounds.south),
        xmax: Cesium.Math.toDegrees(bounds.east),
        ymax: Cesium.Math.toDegrees(bounds.north)
      }),
      // geometryType: 'esriGeometryEnvelope',
      // spatialRel: 'esriSpatialRelIntersects',
      outFields: '*' // 或者你需要的字段
      // 其他可能需要的参数
    };
    axios
      .post(queryUrl, {
        params: queryParams
      })
      .then((res) => {
        console.log(res, 'res');
      });
    // 发送AJAX请求获取数据
    // $.ajax({
    //   url: queryUrl,
    //   data: queryParams,
    //   dataType: 'json',
    //   success: function (response) {
    //     // 处理返回的数据
    //     console.log(response)
    //   },
    //   error: function (error) {
    //     // 处理错误
    //     console.error(error)
    //   }
    // })
  }

  /**
   * @Descripttion:删除argis图层
   * @param {*} label
   * @return {*}
   */
  removeArcgisImageryLayer(label) {
    // console.log(this.imageryLayers, label, 'imageryLayers')
    // debugger
    this.imageryLayers.forEach((item, idx) => {
      // debugger
      if (item.label === label) {
        if (
          typeof item.ArcGisLayer === 'object' &&
          item.ArcGisLayer instanceof Array
        ) {
          item.ArcGisLayer.forEach((arcgis) => {
            this.viewer.imageryLayers.remove(arcgis);
          });
        } else {
          this.viewer.imageryLayers.remove(item.ArcGisLayer);
        }
        this.imageryLayers.splice(idx, 1);
        // 获取要删除的ImageryLayer
        // debugger
        // const imageryLayer = this.viewer.imageryLayers.get(item.index) // index为要删除图层的索引值
        // if (imageryLayer) {
        //   this.viewer.imageryLayers.remove(imageryLayer)
        //   // 从视图中移除该图层
        // } else {
        //   console.log('未找到指定的ImageryLayer')
        // }
      }
    });
  }

  /**
   * @Descripttion: 删除所有arcgis图层
   * @return {*}
   */

  delAllArcgisImageryLayer() {
    this.imageryLayers.forEach((item, idx) => {
      // debugger
      if (item.label !== '区划边界') {
        if (
          typeof item.ArcGisLayer === 'object' &&
          item.ArcGisLayer instanceof Array
        ) {
          item.ArcGisLayer.forEach((arcgis) => {
            this.viewer.imageryLayers.remove(arcgis);
          });
        } else {
          this.viewer.imageryLayers.remove(item.ArcGisLayer);
        }
        this.imageryLayers.splice(idx, 1);
        // 获取要删除的ImageryLayer
        // debugger
        // const imageryLayer = this.viewer.imageryLayers.get(item.index) // index为要删除图层的索引值
        // if (imageryLayer) {
        //   this.viewer.imageryLayers.remove(imageryLayer)
        //   // 从视图中移除该图层
        // } else {
        //   console.log('未找到指定的ImageryLayer')
        // }
      }
    });
  }
  /**
   * @Descripttion: 隐藏显示所有arcgis图层
   * @return {*}
   */

  showAllArcgisImageryLayer(isShow) {
    this.imageryLayers.forEach((item, idx) => {
      // debugger
      if (item.label !== '区划边界') {
        if (
          typeof item.ArcGisLayer === 'object' &&
          item.ArcGisLayer instanceof Array
        ) {
          item.ArcGisLayer.forEach((arcgis) => {
            arcgis.show = isShow;
          });
        } else {
          item.ArcGisLayer.show = isShow;
        }
        // 获取要删除的ImageryLayer
        // debugger
        // const imageryLayer = this.viewer.imageryLayers.get(item.index) // index为要删除图层的索引值
        // if (imageryLayer) {
        //   this.viewer.imageryLayers.remove(imageryLayer)
        //   // 从视图中移除该图层
        // } else {
        //   console.log('未找到指定的ImageryLayer')
        // }
      }
    });
  }
  /**
   * @Descripttion: 添加WMS图层服务 回调和arcgis用的同一个监听handler2
   * @param {*} option
   * @param {*} callBack
   * @return {*}
   */

  loadVMSImageryLayer(option, callBack) {
    // console.log(option, 'option')
    // 创建ImageryProvider对象并指定URL、参数等信息
    const ImageryLayer = new Cesium.ImageryLayer(
      new Cesium.WebMapServiceImageryProvider({
        url: option.url ? option.url : 'http://23.99.113.45:9019/geoserver/wms', // WMS服务地址
        layers: option.layers,
        parameters: {
          service: 'WMS',
          format: 'image/png',
          transparent: true,
          rectangle: Cesium.Rectangle.fromDegrees(105, 28, 111, 33), // 必须有
          // viewparams: 't:2023-04-01 01:00:00', // 时间参数
          viewparams: option.viewparams,
          styles: 'met:station_symbol_test'
          // tiled: true
        },
        getFeatureInfoParameters: {
          viewparams: option.viewparams
        }
        // proxy: new Cesium.DefaultProxy('/proxy/'),
      })
    );
    // 将imageryProvider作为图层添加到viewer中
    // this.viewer.imageryLayers.addImageryProvider(imageryProvider)
    this.viewer.imageryLayers.add(ImageryLayer);

    // push进删除的列表
    this.imageryLayers.push({
      label: option.label,
      ArcGisLayer: ImageryLayer
      // index: this.imageryLayersIndex
    });
    this.handler2.push(callBack);
  }
  /**
   * @Descripttion: 添加单个图片作为图层
   * @param {*} option
   * @param {*} callBack
   * @return {*}
   */

  loadSingleImageryLayer(option, callBack) {
    // alert('ioo')
    // 创建ImageryProvider对象并指定URL、参数等信息
    const image = new Cesium.SingleTileImageryProvider({
      url: option.imgUrl,
      rectangle: Cesium.Rectangle.fromDegrees(105.21, 28.1, 110.24, 32.5)
    });
    // image._tilingScheme = new Cesium.WebMercatorTilingScheme()
    const ImageryLayer = new Cesium.ImageryLayer(image);
    // ImageryLayer.alpha = 0.5;
    // 将imageryProvider作为图层添加到viewer中
    // this.viewer.imageryLayers.addImageryProvider(imageryProvider)
    this.viewer.imageryLayers.add(ImageryLayer);

    // push进删除的列表
    this.imageryLayers.push({
      label: option.label,
      ArcGisLayer: ImageryLayer
      // index: this.imageryLayersIndex
    });
    this.handler2.push(callBack);
  }

  /**
   * @Descripttion: 加载天地图
   * @param {*} option
   * @return {*}
   */
  loadTDTImageryLayer(option) {
    option.url.forEach((item) => {
      this.viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          // url:
          //   'http://{s}.tianditu.gov.cn/vec_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
          //   '&LAYER=vec&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
          //   '&style=default&format=tiles&tk=自己申请的key值',
          url: item,
          // layer: 'tdtCva',
          // style: 'default',
          // format: 'tiles',
          // tileMatrixSetID: 'c',
          // subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
          tilingScheme: new Cesium.GeographicTilingScheme(),
          tileMatrixLabels: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19'
          ],
          maximumLevel: 18
          // show: false
        })
      );
    });
  }

  /**
   * @Descripttion: 渲染的geojson格式数据 测试
   * @return {*}
   */
  addGeojson() {
    const geojsonData = {
      type: 'FeatureCollection',
      features: [
        // 点
        // {
        //   type: 'Feature',
        //   geometry: { type: 'Point', coordinates: [108.0, 31.5] },
        //   properties: { prop0: 'value0' }
        // },
        // // 线
        // {
        //   type: 'Feature',
        //   geometry: {
        //     type: 'LineString',
        //     coordinates: [
        //       [103, 29.0],
        //       [104, 30.0],
        //       [105, 29.0],
        //       [106, 30.0]
        //     ]
        //   },
        //   properties: {
        //     prop0: 'value0',
        //     prop1: 0.0
        //   }
        // },
        // 面
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [106.56841, 29.6039334],
                [106.571666, 29.6039334],
                [106.571666, 29.60824],
                [106.56841, 29.60829404],
                [106.56841, 29.6039334]
              ]
              // [
              //   [106, 30.0],
              //   [107, 30.0],
              //   [107, 31.0],
              //   [106, 31.0],
              //   [106, 30.0]
              // ]
            ]
          },
          properties: {
            prop0: 'value0',
            prop1: { this: 'that' }
          }
        }
        // {
        //   type: 'Feature',
        //   geometry: {
        //     coordinates: [
        //       [
        //         [106.56841410690402, 29.60393348723052],
        //         [106.57166657711412, 29.60393348723052],
        //         [106.57166657711412, 29.608294044583147],
        //         [106.56841410690402, 29.608294044583147],
        //         [106.56841410690402, 29.60393348723052]
        //       ]
        //     ],
        //     type: 'Polygon'
        //   },
        //   properties: {
        //     prop0: 'value0',
        //     prop1: { this: 'that' }
        //   }
        // }
      ]
    };

    // 加载GeoJSON数据
    const dataSource = Cesium.GeoJsonDataSource.load(geojsonData, {
      stroke: Cesium.Color.HOTPINK,
      // fill: Cesium.Color.RED.withAlpha(0.5),
      fill: Cesium.Color.RED,
      strokeWidth: 3
    });
    // .then(datasource => {
    //   this.viewer.dataSources.add(datasource) // 加载这个geojson资源
    //   //
    //   const entities = datasource.entities.values
    //   entities.forEach(entity => {
    //     // debugger
    //     entity.polygon.heightReference =
    //       Cesium.HeightReference.RELATIVE_TO_GROUND // 贴地
    //     entity.polygon.height = 500 // 距地高度0米
    //     entity.polygon.extrudedHeightReference =
    //       Cesium.HeightReference.RELATIVE_TO_GROUND //拉伸
    //     // entity.polygon.extrudedHeight = entity.properties[exHeightFieldName]; // 拉伸高度
    //     entity.polygon.outline = true
    //     entity.polygon.outlineColor = Cesium.Color.BLACK
    //   })
    // })
    // console.log(dataSource, 'dataSource')
    // dataSource.
    // 将加载的数据添加到场景中
    this.viewer.dataSources.add(dataSource).then((dataSource) => {
      console.log(dataSource, 'dataSource');
      // 将相机聚焦在加载的数据范围内
      this.viewer.zoomTo(dataSource);
    });
  }

  /**
   * @Descripttion: 添加区域色块
   * @param {*} layerId 我们的自定义id，用于区分
   * @param {*} option 各种参数包含自定义和官网的，需要的去官网检索api
   * @param {*} callBack 回调函数
   * @return {*}
   */
  // AddClamptoGroundPolygon(
  //   [106.565894, 29.566161, 106.572188, 29.569563],
  //   0.0,
  //   './jialingjiang.png'
  // )
  // AddClamptoGroundPolygon(
  //   [106.574525, 29.54747, 106.582152, 29.551938],
  //   (30.0 / 180.0) * Math.PI,
  //   './changjiang.png'
  // )
  AddClamptoGroundPolygon(poses, rotation, imgSrc) {
    this.viewer.entities.add({
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(
          poses[0],
          poses[1],
          poses[2],
          poses[3]
        ),
        rotation: rotation,
        stRotation: rotation,
        material: new Cesium.ImageMaterialProperty({
          image: imgSrc,
          transparent: true
        })
      }
    });
  }

  addPolygon(layerCode, option, callBack, layerId) {
    // debugger
    const defaultOption = {
      id: layerId,
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray(
          //   [
          //   -125.0, 37.0, -115.0, 32.0, -107.0, 33.0, -102.0, 31.0, -102.0, 35.0
          // ]
          option.dataList
        ),
        // 边框
        outline: false,
        // 边框颜色
        outlineColor: Cesium.Color.WHITE,
        // 边框尺寸
        outlineWidth: 2,
        // 填充的颜色，withAlpha透明度
        color: Cesium.Color.RED,
        // material: option.color,
        // 是否显示
        show: true
      }
    };

    const entitiesOption = merge({}, defaultOption, option);
    const entity = this.viewer.entities.getById(layerId);
    if (!entity) {
      this.viewer.entities.add(entitiesOption);
    }
    // console.log(this.viewer.entities,'entity')
    // this.viewer.entities.values[0].color = 'rgba(11,234,21,0.3)'
    // 添加监听栈
    if (
      this.handler.length === 0 ||
      !this.handler.some((item) => item.layerCode === layerCode)
    ) {
      const listener = {
        layerCode,
        callBack
      };
      this.handler.push(listener);
    }
    // this.mapListen(layerId, callBack, option.isConsole || false)
  }

  /**
   * @Descripttion: 添加geo数据面
   * @param {*} data 边界数据
   * @return {*}
   */

  addPolygonGeo(option) {
    const geojsonData = {
      type: 'FeatureCollection',
      features: [
        //  面
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: option.geoData
          },
          opacity: 1,
          // color: "rgb(89,195,226},
          color: new Cesium.Color(0.35, 0.765, 0.886, 1.0),
          properties: {
            prop0: 'value0',
            prop1: { this: 'that' }
          }
        }
      ]
    };
    const dataSource = Cesium.GeoJsonDataSource.load(geojsonData, {
      stroke: Cesium.Color.BLUE,
      // stroke: Color.BLACK.withAlpha(0.5),
      fill: Cesium.Color.BLUE.withAlpha(0.3),
      // fill: Cesium.Color.RED,
      strokeWidth: 20,
      clampToGround: true
    });
    this.viewer.dataSources.add(dataSource).then((dataSource) => {
      console.log(dataSource, 'dataSource');

      // 将相机聚焦在加载的数据范围内
      this.viewer.zoomTo(dataSource);
    });
  }

  /**
   * @Descripttion: 添加线
   * @param {*} layerCode 地图撒点的一类id
   * @param {*} layerId
   * @param {*} option
   * @param {*} callBack
   * @return {*}
   */

  addLine(layerCode, option, callBack, layerId) {
    const defaultOption = {
      id: layerId,
      polyline: {
        // fromDegrees返回给定的经度和纬度值数组（以度为单位），该数组由Cartesian3位置组成。
        // Cesium.Cartesian3.fromDegreesArray([经度1, 纬度1, 经度2, 纬度2,])
        // Cesium.Cartesian3.fromDegreesArrayHeights([经度1, 纬度1, 高度1, 经度2, 纬度2, 高度2])
        positions: Cesium.Cartesian3.fromDegreesArray(option.dataList),
        // 宽度
        width: 10,
        // 线的颜色Cesium.Color.WHITE
        material: option.color,
        // 线的顺序,仅当`clampToGround`为true并且支持地形上的折线时才有效。
        // zIndex: 10,
        // 显示在距相机的距离处的属性，多少区间内是可以显示的
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500),
        // 是否显示
        show: true
      }
    };
    const entitiesOption = merge({}, defaultOption, option);
    const entity = this.viewer.entities.getById(layerId);
    if (!entity) {
      this.viewer.entities.add(entitiesOption);
    }
    // 添加监听栈
    if (
      this.handler.length === 0 ||
      !this.handler.some((item) => item.layerCode === layerCode)
    ) {
      const listener = {
        layerCode,
        callBack
      };
      this.handler.push(listener);
    }
    // this.mapListen(layerId, callBack, option.isConsole || false)
  }

  /**
   * @Descripttion: 添加geo数据面
   * @param {*} option.data 边界数据
   * @return {*}
   */

  addLineGeo(option) {
    const geojsonData = {
      type: 'FeatureCollection',
      features: [
        //  线
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: option.geoData
          },
          properties: {
            prop0: 'value0',
            prop1: 0.0
          }
        }
      ]
    };

    const dataSource = Cesium.GeoJsonDataSource.load(geojsonData, {
      stroke: Cesium.Color.WHITE,
      // stroke: Color.BLACK.withAlpha(0.5),
      fill: Cesium.Color.WHITE.withAlpha(1),
      // new Cesium.Color(1.0, 0.0, 0.0, 1.0)
      // fill: Cesium.Color.RED,
      strokeWidth: 3
      // clampToGround: true
    });
    this.viewer.dataSources.add(dataSource).then((dataSource) => {
      console.log(dataSource, 'dataSource');
      // 将相机聚焦在加载的数据范围内
      this.viewer.zoomTo(dataSource);
    });
  }

  /**
   * @Descripttion: 生成材质
   * @param {*} val
   * @return {*}
   */
  getColorRamp(val) {
    if (val == null) {
      val = {
        0.0: 'blue',
        0.1: 'cyan',
        0.37: 'lime',
        0.54: 'yellow',
        1: 'red'
      };
    }
    var ramp = document.createElement('canvas');
    ramp.width = 1;
    ramp.height = 100;
    var ctx = ramp.getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, 0, 100);
    for (var key in val) {
      grd.addColorStop(1 - Number(key), val[key]);
    }
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1, 100);
    return ramp;
  }
  /**
   * @Descripttion:  根据geo数据添加立体墙效果
   * @param {*} option 边界数据
   * @return {*}
   */

  addWall(option) {
    // 判断是否有，这个然后删除，每次重新撒一个
    let entity = this.viewer.entities.getById(this.wallEntityId);
    if (entity) {
      this.viewer.entities.remove(entity);
      entity = undefined;
    }

    const positions = option.geoData[0];
    const layerId = '立体墙' + Math.random();
    const list = [];
    positions.forEach((item) => {
      list.push(item[0], item[1]);
    });
    // 设置高度
    const height = 280;

    // 初始化id
    this.wallEntityId = layerId;
    this.viewer.entities.add({
      id: layerId,
      name: '立体墙效果',
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArray(list),
        // 设置高度
        maximumHeights: new Array(positions.length).fill(height + 400),
        minimumHeights: new Array(positions.length).fill(height - 50),
        material: new Cesium.ImageMaterialProperty({
          transparent: true, //开启透明
          image: this.getColorRamp({
            0.0: new Cesium.Color(0.188, 0.52, 0.93, 0.5).toCssColorString(),
            0.045: new Cesium.Color(0.188, 0.52, 0.93, 0.9).toCssColorString(),
            0.1: new Cesium.Color(0.188, 0.52, 0.93, 0.8).toCssColorString(),
            0.15: new Cesium.Color(0.188, 0.52, 0.93, 0.7).toCssColorString(),
            0.37: new Cesium.Color(0.188, 0.52, 0.93, 0.5).toCssColorString(),
            0.54: new Cesium.Color(0.188, 0.52, 0.93, 0.3).toCssColorString(),
            1.0: new Cesium.Color(0.188, 0.52, 0.93, 0.1).toCssColorString()
          })
          // image: this.getColorRamp({
          //   0.0: 'blue',
          //   0.1: 'cyan',
          //   0.37: 'lime',
          //   0.54: 'yellow',
          //   1: 'red'
          // })
        })
      }
    });
    // this.wallEntity.push(wallEntity)
  }

  /**
   * @Descripttion: 根据区县名添加区县立体墙
   * @param {*} areaName
   * @return {*}
   */
  addQxWall(areaName) {
    const url = `http://23.36.123.131:10000/multApp/datamanager/service/e93efdc2-7b92-4587-9d67-607640404384/e9b2aa7d-65a6-4744-b2cd-b8953536159c/026f8049-dc3f-4dbc-918e-d1ca4812102e/MapServer/1/query?where=QXMC='${areaName}'&outFields=*&returnGeometry=true`;
    // 'http://23.36.123.131:10000/multApp/datamanager/service/e93efdc2-7b92-4587-9d67-607640404384/e9b2aa7d-65a6-4744-b2cd-b8953536159c/026f8049-dc3f-4dbc-918e-d1ca4812102e/MapServer/1/query?where=QXMC='江北区'&outFields=*&returnGeometry=true'
    axios.post(url).then((res) => {
      console.log(res, 'res11111');
      if (res.data.features.length > 0) {
        const data = res.data.features[0].geometry.rings;
        const option = {
          geoData: data
        };
        this.addWall(option);
      }
    });
  }

  /**
   * @Descripttion:添加文字 可以配合其他的东西，
   * @param {*} layerCode 地图撒点的一类id
   * @param {*} layerId
   * @param {*} option
   * @param {*} callBack
   * @return {*}
   */
  addText(layerCode, option, callBack, layerId) {
    const defaultOption = {
      id: layerId,
      position: Cesium.Cartesian3.fromDegrees(106.66, 29.7, 500),
      // 点
      // point: {
      //   color: Cesium.Color.RED, // 点位颜色
      //   pixelSize: 10 // 像素点大小
      // },
      // 文字
      label: {
        // 文本。支持显式换行符“ \ n”
        text: '测试名称',
        // 字体样式，以CSS语法指定字体
        font: '14pt Source Han Sans CN',
        // 字体颜色
        fillColor: Cesium.Color.BLACK,
        // 背景颜色
        backgroundColor: Cesium.Color.AQUA,
        // 是否显示背景颜色
        showBackground: true,
        // 字体边框
        outline: true,
        // 字体边框颜色
        outlineColor: Cesium.Color.WHITE,
        // 字体边框尺寸
        outlineWidth: 10,
        // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
        scale: 1.0,
        // 设置样式：FILL：填写标签的文本，但不要勾勒轮廓；OUTLINE：概述标签的文本，但不要填写；FILL_AND_OUTLINE：填写并概述标签文本。
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        // 相对于坐标的水平位置
        // verticalOrigin: Cesium.VerticalOrigin.CENTER,
        // 相对于坐标的水平位置
        // horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 将文字标签贴在地面上

        // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
        // pixelOffset: new Cesium.Cartesian2(10, 0),
        // // 显示在距相机的距离处的属性，多少区间内是可以显示的
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        //   0,
        //   150000
        // ),
        // 是否显示
        show: true
      },
      billboard: {
        // 图像地址，URI或Canvas的属性
        image: require('../cesiumMap/img/test.png'),
        // 设置颜色和透明度
        color: Cesium.Color.WHITE.withAlpha(0.8),
        // 高度（以像素为单位）
        height: 50,
        // 宽度（以像素为单位）
        width: 50,
        // 逆时针旋转
        rotation: 0,
        // 大小是否以米为单位
        sizeInMeters: false,
        // 相对于坐标的垂直位置
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        // 相对于坐标的水平位置
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
        pixelOffset: new Cesium.Cartesian2(10, 0),
        // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
        scale: 1.0,
        // 显示在距相机的距离处的属性，多少区间内是可以显示的
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 15000),
        // 是否显示
        show: true
      }
    };
    const entitiesOption = merge({}, defaultOption, option);
    const entity = this.viewer.entities.getById(layerId);
    if (!entity) {
      this.viewer.entities.add(entitiesOption);
    }
    // 添加监听栈
    if (
      this.handler.length === 0 ||
      !this.handler.some((item) => item.layerCode === layerCode)
    ) {
      const listener = {
        layerCode,
        callBack
      };
      this.handler.push(listener);
    }
    // this.mapListen(layerId, callBack, option.isConsole || false)
  }

  /**
   * @Descripttion: 添加图片
   * @param {*} layerCode 地图撒点的一类id
   * @param {*} option
   * @param {*} callBack
   * @param {*} layerId 唯一id,可以不传，自动生成
   * @param {*} isAddListen 这个用来单纯的增加监听，市级的感知那种移动地图需要撒点的监听逻辑
   * @return {*}
   */
  addImg(layerCode, option, callBack, layerId, isAddListen = false) {
    // 经纬度校验
    // 转回经纬度
    // 非监听才去判断经纬度
    let coordinate = {};
    if (!isAddListen) {
      const lonAndLat = this.transformCartesianToWGS84(option.position);
      coordinate = {
        lon: lonAndLat.lng,
        lat: lonAndLat.lat,
        h: 7000
      };
    }
    // console.log(lonAndLat, 'lonAndLat')

    if (!this.checkLonAndLat(coordinate) && !isAddListen) return;

    if (!isAddListen) {
      this.isNoData = false;
      const defaultOption = {
        id: layerId,
        layerCode,
        position: Cesium.Cartesian3.fromDegrees(
          106.59043576964451,
          29.62676733421874,
          300
        ),
        billboard: {
          disableDepthTestDistance: 800000,
          // material: new Cesium.RadarScanMaterialProperty({
          //   duration: 2000,
          //   stop: 0,
          //   gradient: 0.1,
          //   color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
          //   count: 3
          // }),
          // 图像地址，URI或Canvas的属性
          image: require('../cesiumMap/img/test.png'),
          // 设置颜色和透明度
          color: Cesium.Color.WHITE.withAlpha(1),
          // 高度（以像素为单位）
          height: 102,
          // 宽度（以像素为单位）
          width: 75,
          // 逆时针旋转
          rotation: 0,
          // 大小是否以米为单位
          sizeInMeters: false,
          // 相对于坐标的垂直位置
          // verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          // 相对于坐标的水平位置
          // horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
          pixelOffset: new Cesium.Cartesian2(10, 0),
          // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
          // scale: 1.0,
          // 尺寸大小
          scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 1e5, 0.3),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          // 显示在距相机的距离处的属性，多少区间内是可以显示的
          // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 15000),
          // 是否显示
          show: true,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0,
            option.distance ? option.distance : 20000000
          )
        },
        label: {
          // scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 1e5, 0.3),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,

          disableDepthTestDistance: 50000,
          // 文本。支持显式换行符“ \ n”
          text: '',
          // 字体样式，以CSS语法指定字体
          font: '14pt sans-serif',
          // 字体颜色
          fillColor: Cesium.Color.BLACK,
          // 背景颜色
          backgroundColor: Cesium.Color.AQUA,
          // 是否显示背景颜色
          showBackground: true,
          // 字体边框
          outline: false,
          // 字体边框颜色
          // outlineColor: Cesium.Color.WHITE,
          // 字体边框尺寸
          // outlineWidth: 10,
          // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
          // scale: 1.0,
          // 设置样式：FILL：填写标签的文本，但不要勾勒轮廓；OUTLINE：概述标签的文本，但不要填写；FILL_AND_OUTLINE：填写并概述标签文本。
          // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          style: Cesium.LabelStyle.FILL, // label样式

          // 相对于坐标的水平位置
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          // 相对于坐标的水平位置
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
          // pixelOffset: new Cesium.Cartesian2(-100, -84),
          // 显示在距相机的距离处的属性，多少区间内是可以显示的
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0,
            option.distance ? option.distance : 20000000
          ),
          // 是否显示
          show: true
        }
      };
      const entitiesOption = merge({}, defaultOption, option);
      // this.currentPosition.lon = option.geometry.x
      // this.currentPosition.lat = option.geometry.y
      console.log(entitiesOption, 'entitiesOption');
      const entity = this.viewer.entities.getById(layerId);
      if (!entity) {
        this.viewer.entities.add(entitiesOption);
      }
    } else {
      this.isNoData = true;
    }
    // 添加监听栈
    if (
      this.handler.length === 0 ||
      !this.handler.some((item) => item.layerCode === layerCode)
    ) {
      const listener = {
        layerCode,
        callBack,
        select: option.select
      };
      // debugger
      this.handler.push(listener);
    }
    // console.log(this.handler, 'this.handler')
    // this.mapListen(layerId, callBack, option.isConsole || false)
  }

  /**
   * @Descripttion: 模型
   * @param {*} layerCode 地图撒点的一类id
   * @param {*} option
   * @param {*} callBack
   * @param {*} layerId 唯一id,可以不传，自动生成
   * @param {*} isAddListen 这个用来单纯的增加监听，市级的感知那种移动地图需要撒点的监听逻辑
   * @return {*}
   */

  addModel(layerCode, option, callBack, layerId, modal, isAddListen = false) {
    // 经纬度校验
    // 转回经纬度
    const lonAndLat = this.transformCartesianToWGS84(option.position);
    // console.log(lonAndLat, 'lonAndLat')
    const coordinate = {
      lon: lonAndLat.lng,
      lat: lonAndLat.lat,
      h: 7000
    };
    if (!this.checkLonAndLat(coordinate)) return;

    const defaultOption = {
      id: layerId,
      layerCode,
      position: Cesium.Cartesian3.fromDegrees(
        106.59043576964451,
        29.62676733421874,
        300
      ),
      model: {
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        uri: this.filePath + modal,
        minimumPixelSize: 64
      }
      // billboard: {
      //   disableDepthTestDistance: 800000,
      //   // material: new Cesium.RadarScanMaterialProperty({
      //   //   duration: 2000,
      //   //   stop: 0,
      //   //   gradient: 0.1,
      //   //   color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      //   //   count: 3
      //   // }),
      //   // 图像地址，URI或Canvas的属性
      //   image: require('../cesiumMap/img/test.png'),
      //   // 设置颜色和透明度
      //   color: Cesium.Color.WHITE.withAlpha(1),
      //   // 高度（以像素为单位）
      //   height: 102,
      //   // 宽度（以像素为单位）
      //   width: 75,
      //   // 逆时针旋转
      //   rotation: 0,
      //   // 大小是否以米为单位
      //   sizeInMeters: false,
      //   // 相对于坐标的垂直位置
      //   // verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      //   // 相对于坐标的水平位置
      //   // horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      //   // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
      //   pixelOffset: new Cesium.Cartesian2(10, 0),
      //   // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
      //   // scale: 1.0,
      //   // 尺寸大小
      //   scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 1e5, 0.3),
      //   heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      //   // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      //   // 显示在距相机的距离处的属性，多少区间内是可以显示的
      //   // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 15000),
      //   // 是否显示
      //   show: true,
      //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      //     0,
      //     option.distance ? option.distance : 20000000
      //   )
      // },
      // label: {
      //   // scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 1e5, 0.3),
      //   heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,

      //   disableDepthTestDistance: 50000,
      //   // 文本。支持显式换行符“ \ n”
      //   text: '',
      //   // 字体样式，以CSS语法指定字体
      //   font: '14pt Source Han Sans CN',
      //   // 字体颜色
      //   fillColor: Cesium.Color.BLACK,
      //   // 背景颜色
      //   backgroundColor: Cesium.Color.AQUA,
      //   // 是否显示背景颜色
      //   showBackground: true,
      //   // 字体边框
      //   outline: true,
      //   // 字体边框颜色
      //   outlineColor: Cesium.Color.WHITE,
      //   // 字体边框尺寸
      //   // outlineWidth: 10,
      //   // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
      //   // scale: 1.0,
      //   // 设置样式：FILL：填写标签的文本，但不要勾勒轮廓；OUTLINE：概述标签的文本，但不要填写；FILL_AND_OUTLINE：填写并概述标签文本。
      //   // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      //   style: Cesium.LabelStyle.FILL, // label样式

      //   // 相对于坐标的水平位置
      //   verticalOrigin: Cesium.VerticalOrigin.CENTER,
      //   // 相对于坐标的水平位置
      //   horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      //   // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
      //   // pixelOffset: new Cesium.Cartesian2(-100, -84),
      //   // 显示在距相机的距离处的属性，多少区间内是可以显示的
      //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      //     0,
      //     option.distance ? option.distance : 20000000
      //   ),
      //   // 是否显示
      //   show: true
      // }
    };
    const entitiesOption = merge({}, defaultOption, option);
    // this.currentPosition.lon = option.geometry.x
    // this.currentPosition.lat = option.geometry.y
    // console.log(entitiesOption, 'entitiesOption')
    const entity = this.viewer.entities.getById(layerId);
    if (!entity) {
      this.viewer.entities.add(entitiesOption);
    }
    // console.log(this.handler, 'this.handler')
    // this.mapListen(layerId, callBack, option.isConsole || false)
  }

  /**
   * @Descripttion: 删除指定entities内容
   * @param {*} layerId 唯一id
   * @param {*} select 撒点的图例数据 select.label === layerCode
   * @param {*} isDelete 是否删除，点击图例才删除
   * @return {*}
   */
  deleteEntities(layerId, select, isDelete = false) {
    // debugger
    let entity = this.viewer.entities.getById(layerId);
    // delete this.handler[layerId]
    if (entity) {
      this.viewer.entities.remove(entity);
      entity = undefined;
      // const xx = this.viewer.entities.remove(entity)
      // entity.destory()
      // return xx
    }
    // debugger
    if (this.handler.length > 0 && isDelete) {
      // debugger
      this.handler.forEach((item, index) => {
        if (select.label === item.layerCode) this.handler.splice(index, 1);
      });
    }
  }

  /**
   * @Descripttion: 添加自定义信息体 html元素
   * @param {*} layerId
   * @param {*} domMarkerStr
   * @param {*} option
   * @return {*}
   */
  addCustomInfo(layerId, domId, option) {
    const defaultElement = [
      {
        id: layerId,
        element: document.getElementById(domId),
        offset: [0, 0],
        flog: true,
        position: Cesium.Cartesian3.fromDegrees(106.58763, 29.54321, 240)
      }
    ];
    const customElement = merge([], defaultElement, option);
    console.log(customElement, 'customElement');
    this.htmlElesList[layerId] = new Cesium.CreateHtmlElement(
      this.viewer,
      customElement
    );
    // console.log(this.htmlElesList[layerId],'未激活')
    this.htmlElesList[layerId].active(); // 激活，默认是不激活状态
    // console.log(this.htmlElesList[layerId],'激活后')
  }

  /**
   * @Descripttion: 隐藏自定义元素 没啥效果
   * @param {*} layerId
   * @return {*}
   */
  clearCustomInfo(layerId) {
    console.log(layerId, this.htmlElesList[layerId], '删除');
    // this.htmlElesList[layerId].elements[0].deactive() // 关闭
  }

  /**
   * @Descripttion: 清除自定义元素
   * @param {*} layerId
   * @return {*}
   */
  hiddenCustomInfo(layerId) {
    this.htmlElesList[layerId].clear(); // 清除
  }

  /**
   * 根据区域编码查询下属子区域的中心点
   * @param {String} code  区域编码
   */
  getCenterByCode = function (code) {
    // 兼容社区编码
    if (code.split('').length === 12) {
      code = code + '000';
    }
    return axios.get(this.centerUrl, { params: { parentCode: code } });
  };

  /**
   * @Descripttion: 视角跳转
   * @param {*} coordinate 坐标，
   * @return {*}
   */
  viewerChange1(coordinate) {
    if (!this.checkLonAndLat(coordinate)) return;
    this.viewer.camera.flyTo({
      // 飞往
      destination: Cesium.Cartesian3.fromDegrees(
        coordinate.lon,
        coordinate.lat,
        coordinate.height
      ),
      duration: 2,
      orientation: {
        heading: coordinate.heading,
        pitch: coordinate.pitch,
        roll: coordinate.roll
      }
    });
    // this.viewer.camera.setView({
    //   // 设置视角
    //   destination: cartesianPosition,
    //   orientation: {
    //     heading: Cesium.Math.toRadians(90.0),
    //     pitch: Cesium.Math.toRadians(-90),
    //     roll: 0.0
    //   }
    // })
  }

  viewerChange(coordinate) {
    // 高度
    // Math.ceil(window.QXPAWCesiumMethod.viewer.camera.positionCartographic.height)
    // 经度
    // Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(this.viewer.camera.position).longitude)
    // 纬度
    // Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(this.viewer.camera.position).latitude)
    // const coordinate = {
    //   lon: point.longitude,
    //   lat: point.latitude,
    //   h: 7000
    // }

    if (!this.checkLonAndLat(coordinate)) return;
    // 获取当前的状态信息
    const h = Math.ceil(this.viewer.camera.positionCartographic.height);
    this.viewer.camera.flyTo({
      // 飞往  将经纬度和高度转换为伽利略坐标系？
      destination: Cesium.Cartesian3.fromDegrees(
        coordinate.lon,
        coordinate.lat,
        // h
        coordinate?.isChangeHeight ? coordinate?.h : h
      ),
      // cxsj
      duration: 3,
      orientation: {
        // 航偏角
        // heading: Cesium.Math.toRadians(0), // 6.283185307179586
        heading: 6.283185307179586,
        // heading: this.viewer.camera.heading,
        pitch: Cesium.Math.toRadians(-90.0), // -0.5000626030107767
        // pitch: -0.5000611152802663,
        // pitch: this.viewer.camera.pitch,
        // roll: this.viewer.camera.roll   // 6.283185307179586
        roll: 6.283185307179586
        // roll: 0.0
      }
    });
    // const t = [{
    //   lon: '106.55670928423474',
    //   lat: '29.439795669202024',
    //   height: '7053.628722006314',
    //   heading: '6.283185307179586',
    //   pitch: '-0.5000626030107767',
    //   roll: '6.283185307179586'
    // }]

    // this.viewer.camera.flyTo({
    //   // 飞往  将经纬度和高度转换为伽利略坐标系？
    //   destination: Cesium.Cartesian3.fromDegrees(
    //     coordinate.lon,
    //     coordinate.lat,
    //     coordinate.h
    //   ),
    //   // cxsj
    //   duration: 3,
    //   orientation: {
    //     // 航偏角  viewer.camera.heading
    //     heading: Cesium.Math.toRadians(0),
    //     pitch: Cesium.Math.toRadians(-90.0),
    //     roll: 0.0
    //   }
    // })
    // this.viewer.camera.setView({
    //   // 设置视角
    //   destination: Cesium.Cartesian3.fromDegrees(
    //     coordinate.lon,
    //     coordinate.lat,
    //     coordinate.h
    //   ),
    //   duration: 3,
    //   orientation: {
    //     heading: Cesium.Math.toRadians(0),
    //     pitch: Cesium.Math.toRadians(-90.0),
    //     roll: 0.0
    //   }
    // })
  }

  /**
   * @Descripttion: 经纬度校验
   * @param {*} data
   * @return {*}
   */
  checkLonAndLat(data) {
    // 经纬度正则校验
    const lonRegxExp =
      /^[\-\+]?(0?\d{1,2}(\.\d{1,20})*|1[0-7]?\d{1}(\.\d{1,20})*|180(\.0{1,20})*)$/;
    const latRegxExp = /^[\-\+]?([0-8]?\d{1}(\.\d{1,20})*|90(\.0{1,20})*)$/;
    if (
      lonRegxExp.test(String(data.lon)) &&
      latRegxExp.test(String(data.lat))
    ) {
      return true;
    } else return false;
  }
  /**
   * @Descripttion: 添加圆形扩散效果
   * @param {*} option
   * @return {*}
   */

  addDiffuse(option) {
    this.viewer.entities.add({
      name: '圆形扩散圈',
      // position: boundingSphere.center,
      position: option.position,
      // point: {
      //   pixelSize: 10,
      //   color: Cesium.Color.RED
      // },
      ellipse: {
        semiMinorAxis: 1000,
        semiMajorAxis: 1000,
        material: new Cesium.RadarScanMaterialProperty({
          duration: 2000,
          stop: 0,
          gradient: 0.1,
          color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
          count: 3
        }),
        height: 30.0,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        // outline: true,
        // outlineColor: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
        // classificationType: Cesium.ClassificationType.CESIUM_3D_TILE //贴地方式，此处选择只贴实景模型
      }
    });
    return;
    const that = this;
    this.tilesets[this.tilesets.length - 1].readyPromise.then(
      function (tileset2) {
        that.viewer.zoomTo(tileset2);
        // debugger
        const boundingSphere = tileset2.boundingSphere;
        const radius = boundingSphere.radius;
        const center = boundingSphere.center;
        console.log(
          boundingSphere.center,
          option.position,
          'boundingSphere.center'
        );
        const catographic = Cesium.Cartographic.fromCartesian(center);
        that.viewer.entities.add({
          name: '圆形扩散圈',
          // position: boundingSphere.center,
          position: option.position,

          point: {
            pixelSize: 10,
            color: Cesium.Color.RED
          },
          ellipse: {
            semiMinorAxis: 1000,
            semiMajorAxis: 1000,
            material: new Cesium.RadarScanMaterialProperty({
              duration: 2000,
              stop: 0,
              gradient: 0.1,
              color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
              count: 3
            }),
            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE // 贴地方式，此处选择只贴实景模型
          }
        });

        // return tileset
      }
    );
    // this.tilesets[1].readyPromise.then(function (tileset2) {
    //   that.viewer.zoomTo(tileset2)
    //   var boundingSphere = tileset2.boundingSphere
    //   var radius = boundingSphere.radius
    //   var center = boundingSphere.center
    //   var catographic = Cesium.Cartographic.fromCartesian(center)
    //   that.viewer.entities.add({
    //     name: '圆形扩散圈',
    //     position: boundingSphere.center,
    //     point: {
    //       pixelSize: 10,
    //       color: Cesium.Color.GREEN
    //     },
    //     ellipse: {
    //       semiMinorAxis: 2000,
    //       semiMajorAxis: 2000,
    //       material: new Cesium.RadarScanMaterialProperty({
    //         duration: 2000,
    //         stop: 0,
    //         gradient: 0.1,
    //         color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
    //         count: 3
    //       }),
    //       classificationType: Cesium.ClassificationType.CESIUM_3D_TILE //贴地方式，此处选择只贴实景模型
    //     }
    //   })

    //   return tileset
    // })
  }

  /**
   * @Descripttion:添加雷达效果
   * @param {*} option
   * @return {*}
   */

  addRadar(option) {
    this.viewer.entities.add({
      name: '雷达扫描效果',
      position: option.position,
      point: {
        pixelSize: 10, // 设置点的大小，单位为像素
        color: new Cesium.Color(0.1, 0.6, 0.8, 1.0),
        outlineColor: Cesium.Color.WHITE, // 设置点的外框颜色
        outlineWidth: 2 // 设置点的外框宽度
      },
      ellipse: {
        semiMinorAxis: 1000,
        semiMajorAxis: 1000,
        material: new Cesium.CircleScanMaterialProperty({
          duration: 3000,
          range: -0.2,
          gradient: 0.0,
          // color: Cesium.Color.CYAN
          color: new Cesium.Color(0.1, 0.6, 0.8, 1.0)
        }),
        height: 100.0,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND

        // classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
      }
    });
  }

  /**
   * @Descripttion: 流动效果-移动的光墙
   * @param {*} points
   * @param {*} option
   * @return {*}
   */
  addCustomEntity(points = [], option = {}) {
    let maximumHeights = [];
    let minimumHeights = [];

    if (points.length > 0) {
      maximumHeights = new Array(points.length).fill(option.maxHeight || 40);
      minimumHeights = new Array(points.length).fill(option.minHeight || 1);
    }

    let num = 1;
    const _this = this;
    const imgSrc = require('@/scopes/project/cesiumMap/modulePart/cesiumMap/img/wall_out2.png');
    let b = this.viewer.entities.add({
      id: 'wall',
      name: 'wall',
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArray(points.flat()),
        maximumHeights: maximumHeights,
        minimumHeights: minimumHeights,
        material: new Cesium.ImageMaterialProperty({
          image: new Cesium.CallbackProperty(function () {
            num -= 0.007;
            if (num <= 0) {
              num = 1;
            }
            return _this.getWallImage(num, imgSrc);
          }, false),
          repeat: new Cesium.Cartesian2(50, 1.0),
          transparent: false
        })
      }
    });
    // this.areaEntity.push(b)
  }

  /**
   * @Descripttion: 生成canvas材质
   * @param {*} num
   * @param {*} src
   * @return {*}
   */
  getWallImage(num, src) {
    const _this = this;
    const dom = document.createElement('canvas');
    dom.height = 200;
    dom.width = 20;
    const cut = dom.getContext('2d');
    let img = null;
    if (this.imageDom) {
      img = this.imageDom;
      cut.drawImage(img, 0, 200 * num, 20, 200, 0, 0, 20, 200);
      return dom;
    } else {
      img = new Image();
      img.src = src;
      //处理toDataURL遇跨域资源导致的报错
      img.crossOrigin = 'Anonymous';

      img.onload = function () {
        _this.imageDom = img;
        cut.drawImage(img, 0, 200 * num, 20, 200, 0, 0, 20, 200);
        return dom;
      };
    }
  }

  /**
   * @name:飞行曲线
   * @params {startPoint 起点位置}
   *         {endPoint，终点位置}
   *         {lineColor，线条颜色}
   *         {lineWidth，线条宽度}
   *         {trailColor，尾迹颜色}
   *         {trailWidth，尾迹线宽度}
   *         {trailLength，轨迹长度}
   *         {period，运动时间}
   *         {num， 精度数，数字越大越精细，运动轨迹更流畅}
   *         {name: 名称 用来检索对象可重复}
   * @return {array(entity)}
   */
  addFightLine({
    points,
    height = 400,
    trailWidth = 6,
    trailLength = 0.5,
    period = 5
  }) {
    const hPoint = [];
    points.forEach((item) => {
      const point = Cesium.Cartesian3.fromDegrees(+item[0], +item[1], height);
      hPoint.push(point);
    });
    const b = this.viewer.entities.add({
      // 尾迹线
      // polyline: {
      //   positions: hPoint,
      //   width: trailWidth, // 线的宽度，像素为单位
      //   material: new Cesium.PolylineTrailMaterialProperty({
      //     // 尾迹线材质
      //     color: new Cesium.Color(1, 1, 1, 1),
      //     trailLength,
      //     period
      //   })
      // },
      polyline: {
        positions: hPoint,
        width: 20,
        material: new Cesium.GlowFlyLineMaterialProperty({
          color: new Cesium.Color(128.0 / 255, 233.0 / 255, 236.0 / 255.0, 1.0), //线中间颜色
          outlineColor: new Cesium.Color(
            28.0 / 255,
            70.0 / 255,
            143.0 / 255.0,
            1.0
          ), //线两边边界颜色
          glowColor: new Cesium.Color(
            166.0 / 255,
            236.0 / 255,
            154.0 / 255.0,
            1.0
          ), //动态线颜色
          glowRange: 0.15, //动态线长度，整个线长度是1.0,
          duration: 2.0, //一个周期时间
          stopTime: 0.4, //间断闪烁时的时间间隔，duration最好是stopTime的整数倍
          isContinus: true, //是否是连续，如果是连续则闪烁无效，stopTime无效
          gradient: 0.4 //线两边边框占比，最大是0.5，这个值越大outlineColor覆盖越多，相应的color覆盖越少
        })
      }
    });
    // this.areaEntity.push(b)
  }

  /**
   * @Descripttion: 判断点是否在面内
   * @param {*} point
   * @param {*} ploy
   * @return {*}
   */

  judgePInPoly(point, ploy) {}

  /**
   * @Descripttion: 获取当前的相机经纬度和高度，计算可视区域半径
   * @return {*}
   */

  getCameraPosition() {
    const position = this.viewer.scene.camera.positionCartographic;
    // 弧度转经纬度
    const longitude = Cesium.Math.toDegrees(position.longitude);
    const latitude = Cesium.Math.toDegrees(position.latitude);
    const height = position.height;
    return { lng: longitude, lat: latitude, h: height };
  }

  /**
   * @Descripttion: 获取当前屏幕中心点的经纬度
   * @isRecord  是否记录当前的位置
   * @return {*}
   */

  getCenterPosition(isRecord = true) {
    // 经纬度
    const centerResult = this.viewer.camera.pickEllipsoid(
      new Cesium.Cartesian2(
        this.viewer.canvas.clientWidth / 2,
        this.viewer.canvas.clientHeight / 2
      )
    );
    // const centerPoint = centerResult
    const curPosition =
      Cesium.Ellipsoid.WGS84.cartesianToCartographic(centerResult);
    const curLongitude = (curPosition.longitude * 180) / Math.PI;
    const curLatitude = (curPosition.latitude * 180) / Math.PI;
    if (isRecord) {
      this.currentPosition.lng = curLongitude;
      this.currentPosition.lat = curLatitude;
    }
    // 相机高度
    // debugger
    const height = Number(
      Number(this.viewer.scene.camera.positionCartographic.height).toFixed(0)
    );
    // 计算半径
    let radius = '';
    if (height < 2000) {
      radius = (height * 1.5).toFixed(0);
    } else if (height < 5000) {
      radius = height.toFixed(0);
    } else if (height < 10000) {
      radius = (height * 0.7).toFixed(0);
    } else if (height > 10000) {
      radius = (height * 0.6).toFixed(0);
    }
    if (Number(radius) > 25000) {
      radius = '25000';
    }
    return {
      lng: curLongitude,
      lat: curLatitude,
      h: height,
      radius
    };
  }

  /**
   * @Descripttion: 添加地图点击监听
   * @param {*} isConsole
   * @return {*}
   */
  addMapListenr(isConsole = false) {
    this.listenHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    this.mapListen(isConsole);
  }

  /**
   * @Descripttion: 调用监听事件方法
   * @param {*} isConsole 鼠标移入时是否实时打印鼠标的坐标和经纬度
   * @return {*}
   */

  async mapListen(isConsole = false) {
    // const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    // this.handler[layerId] = handler
    // 鼠标左键点击事件
    this.listenHandler.setInputAction((click) => {
      // debugger
      // entity的撒点监听
      const feature = this.viewer.scene.pick(click.position);
      const pickPosition = this.viewer.scene.pickPosition(click.position);

      if (pickPosition) {
        // 空间地理坐标
        const cartographic = Cesium.Cartographic.fromCartesian(pickPosition);
        if (true) {
          // console.log(pickPosition, 'pickPosition')
          console.log(
            cartographic,
            '经度：',
            Cesium.Math.toDegrees(cartographic.longitude),
            '维度:',
            Cesium.Math.toDegrees(cartographic.latitude)
          );
        }
      }
      if (Cesium.defined(feature) && feature && feature.id) {
        // this.handler.forEach(item => {
        //   // console.log(feature.id.id, item, '鼠标点击事件')
        //   if (feature.id.layerCode === item.layerCode) {
        //     // debugger
        //     // console.log(feature.id.name, '鼠标点击事件')
        //     // console.log(this.handler, 'this.handler')
        //     if (item.callBack.clickCallBack) {
        //       this.isDynamic = false
        //       this.timer1 = setTimeout(() => {
        //         item.callBack.clickCallBack(feature)
        //         this.isDynamic = true
        //         clearTimeout(this.timer1)
        //       }, 100)
        //     }
        //   }
        // })
        if (feature.id.id === layerId) {
          // console.log(feature.id.name, '鼠标点击事件')
          console.log(this.handler, 'this.handler');
          if (callBack.clickCallBack) {
            callBack.clickCallBack(feature);
          }
        }
        // 下面代码简单验证可以给三维地图加上我们的layerId
        // this.viewer.entities.values.map(item => {
        //   if (feature.id.id && item.id === feature.id.id) {
        //     // this.viewer._selectedEntity = [] //去除左击之后出现选中的绿框
        //     console.log('item',item,item.id,item === feature.id )
        //   }
        // })
      }
      // 点击
      // argis的那种图层数据点击监听
      // const pickRay = this.viewer.camera.getPickRay(click.position)

      // const promi = this.viewer.imageryLayers.pickImageryLayerFeatures(
      //   pickRay,
      //   this.viewer.scene
      // )
      // if (promi) {
      //   promi.then(res => {
      //     const data = {}
      //     // console.log(res, res[0].properties, 'res2222')
      //     if (res.length) {
      //       const attr = {} // 有值的数据
      //       Object.keys(res[0].properties).forEach(key => {
      //         const val = res[0].properties[key]
      //         if (!['SHAPE', 'Shape', 'OBJECTID'].includes(key)) {
      //           attr[key] = val
      //           // console.log(attr[key], '000')
      //         }
      //       })
      //       if (res[0].data.layerName) {
      //         data.name = res[0].data.layerName
      //       }
      //       data.data = attr
      //       if (this.handler2.length > 0) {
      //         this.handler2[0].clickCallBack(data)
      //       }

      //       // console.log(attr, 'attr')
      //       // this.openInfoPanel({ type: 'DK', data: attr })
      //     }
      //     // else {
      //     //   this.openInfoPanel({ type: 'NODATA' })
      //     // }
      //   })
      // }
      // const pickedFeature = this.viewer.scene.pick(click.position)
      // if (Cesium.defined(pickedFeature)) {
      //   console.log(
      //     pickedFeature.content.tileset.getProperty('name'),
      //     'pickedFeature'
      //   )
      // }
      // console.log(feature, feature.getProperty('name'), 'feature')
      // if (feature.id.id === 'testArea') {
      //   feature.id.color = Cesium.Color.WHITE
      //   console.log(feature, 'feature')
      //   feature.primitive.show = false
      // }
      // console.log(feature.getPropertyNames(), 'getPropertyNames')
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 鼠标移入移出事件
    this.listenHandler.setInputAction((click) => {
      // let timeTrigger = 0
      const feature = this.viewer.scene.pick(click.endPosition);
      // console.log(feature, 'feature')
      const pickPosition = this.viewer.scene.pickPosition(click.endPosition);

      // dddddddd 拿坐标
      // if (pickPosition) {
      //   // 空间地理坐标
      //   const cartographic = Cesium.Cartographic.fromCartesian(pickPosition)
      //
      //   // console.log(pickPosition, 'pickPosition')
      //   console.log(
      //     cartographic,
      //     '经度：',
      //     Cesium.Math.toDegrees(cartographic.longitude),
      //     '维度:',
      //     Cesium.Math.toDegrees(cartographic.latitude)
      //   )
      // }
      // 分割线
      // 判定移动的时候请求接口
      // if (this.isDynamic) {
      // const cartographic = Cesium.Cartographic.fromCartesian(pickPosition)
      // const lon = Cesium.Math.toDegrees(cartographic.longitude)
      // const lat = Cesium.Math.toDegrees(cartographic.latitude)
      // this.handler.forEach(item => {
      //   if (item.callBack.listenerAddCallBack) {
      //     item.callBack.listenerAddCallBack(item.select)
      //   }
      // })
      // }
      if (Cesium.defined(feature) && feature && feature.id) {
        this.handler.forEach((item) => {
          // 判定移动的时候请求接口
          // if (item.callBack.listenerAddCallBack) {
          //   item.callBack.listenerAddCallBack(item.select)
          // }
          // console.log(feature.id.id, item, '鼠标点击事件')
          if (feature.id.layerCode === item.layerCode) {
            if (item.callBack.mousemoveCallBack) {
              // console.log('移入当前', event)
              item.callBack.mousemoveCallBack(feature, event);
            }
            if (pickPosition) {
              // 空间地理坐标
              const cartographic =
                Cesium.Cartographic.fromCartesian(pickPosition);
              if (isConsole) {
                // console.log(pickPosition, 'pickPosition')
                console.log(
                  cartographic,
                  '经度：',
                  Cesium.Math.toDegrees(cartographic.longitude),
                  '维度:',
                  Cesium.Math.toDegrees(cartographic.latitude)
                );
              }
            }
            // console.log('移入当前',feature)
            this.currentListener.layerCode = item.layerCode;
            this.currentListener.feature = feature;
          }
        });
      } else {
        this.handler.forEach((item) => {
          // console.log(feature.id.id, item, '鼠标点击事件')
          if (this.currentListener.layerCode === item.layerCode) {
            if (item.callBack.mouseoutCallBack) {
              item.callBack.mouseoutCallBack(this.currentListener.feature);
            }
            // console.log('移出当前',feature)
            this.currentListener.layerCode = '';
            this.currentListener.feature = feature;
          }
        });
      }

      // if (feature instanceof Cesium.Cesium3DTileFeature) {
      //   const propertyIds = feature.getPropertyIds()
      //   const length = propertyIds.length
      //   for (let i = 0; i < length; ++i) {
      //     const propertyId = propertyIds[i]
      //     console.log(`{propertyId}: ${feature.getProperty(propertyId)}`)
      //   }
      // }
      // if (pickPosition) {
      //   // 空间地理坐标
      //   const cartographic = Cesium.Cartographic.fromCartesian(pickPosition)
      //   if (isConsole) {
      //     console.log(pickPosition, 'pickPosition')
      //     console.log(
      //       cartographic,
      //       '经度：',
      //       Cesium.Math.toDegrees(cartographic.longitude),
      //       '维度:',
      //       Cesium.Math.toDegrees(cartographic.latitude)
      //     )
      //   }
      // }
      // else {
      //   // 地形上
      //   const globe = this.viewer.scene.globe
      //   const depthTest = globe.depthTestAgainstTerrain
      //   globe.depthTestAgainstTerrain = !depthTest
      //   this.viewer.render()
      //   pickPosition = this.viewer.scene.pickPosition(click.endPosition)
      //   if (pickPosition) {
      //     const cartographic2 = Cesium.Cartographic.fromCartesian(pickPosition)
      //   }
      //   globe.depthTestAgainstTerrain = depthTest
      // }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 鼠标左键抬起事件
    // if (this.isDynamic) {
    await this.listenHandler.setInputAction((click) => {
      // debugger
      // debugger
      console.log('window.sjMapModule.viewer', this.viewer);

      // var windowpos = this.viewer.camera.getPickRay(event.clientX);

      // var cartesian2 = viewer.camera.pickPosition(click.position, this.viewer.scene.globe.ellipsoid);
      // var carto2 = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian2);
      // console.log('carto2',carto2)

      // if (windowpos) {
      //   var cartesian2 = this.viewer.camera.pickEllipsoid(event.position,this.viewer.scene.globe.ellipsoid);
      //   var carto2 = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian2);
      //   CesiumTool.configQiPao({id:"pupdiv"+Math.random(10000),position:obj})

      //   console.log(carto2);
      // }

      console.log('触发点击监听了！！！！');
      // const feature = this.viewer.scene.pick(click.endPosition)
      // const pickPosition = this.viewer.scene.pickPosition(click.endPosition)
      // const pickPosition = this.viewer.scene.pickPosition(click.endPosition)

      const feature = this.viewer.scene.pick(click.position);

      let obj = {};
      if (feature && feature.id?.typeName === 'wst') {
        obj = {
          left: event?.clientX + 'px',
          top: event?.clientY + 'px'
        };
      }
      if (Cesium.defined(feature) && feature && feature.id) {
        if (this.handler.length > 0) {
          // console.log(this.handler,'this.handler')
          this.handler.forEach((item) => {
            // debugger
            // console.log(feature.id.id, item, '鼠标点击事件')
            if (feature.id.layerCode === item.layerCode) {
              // debugger
              // console.log(feature.id.name, '鼠标点击事件')
              // console.log(this.handler, 'this.handler')
              if (item.callBack.clickCallBack) {
                // alert('iioo')
                this.isDynamic = false;
                // return
                this.timer1 = setTimeout(() => {
                  // console.log(feature,'feature')
                  console.log('普通点击，');
                  item.callBack.clickCallBack(feature);
                  this.isDynamic = true;
                  clearTimeout(this.timer1);
                }, 100);
              }
            }
          });
        }

        // if (feature.id.id === layerId) {
        //   // console.log(feature.id.name, '鼠标点击事件')
        //   console.log(this.handler, 'this.handler')
        //   if (callBack.clickCallBack) {
        //     callBack.clickCallBack(feature)
        //   }
        // }
        // 下面代码简单验证可以给三维地图加上我们的layerId
        // this.viewer.entities.values.map(item => {
        //   if (feature.id.id && item.id === feature.id.id) {
        //     // this.viewer._selectedEntity = [] //去除左击之后出现选中的绿框
        //     console.log('item',item,item.id,item === feature.id )
        //   }
        // })
      }
      // 点击
      // argis的那种图层数据点击监听
      const pickRay = this.viewer.camera.getPickRay(click.position);
      const promi = this.viewer.imageryLayers.pickImageryLayerFeatures(
        pickRay,
        this.viewer.scene
      );
      if (promi) {
        promi.then((res) => {
          // debugger
          const data = {};
          // console.log(res, res[0].properties, 'res2222')
          if (res.length) {
            const attr = {}; // 有值的数据
            Object.keys(res[0].properties).forEach((key) => {
              const val = res[0].properties[key];
              if (!['SHAPE', 'Shape', 'OBJECTID'].includes(key)) {
                attr[key] = val;
                // console.log(attr[key], '000')
              }
            });
            // 判断arcgis类型
            if (res[0].data.layerName) {
              data.name = res[0].data.layerName;
            }
            // 判断WMS服务
            if (res[0].data.geometry_name === 'geom') {
              data.name = '气象服务';
              // data.modalTitle = '小时降雨量心情' // 弹窗标题
            }
            // debugger
            data.data = attr;
            if (this.handler2.length > 0) {
              if (data.name === '区县界') {
                // return
                // if (this.curAreaName !== data.data['区县名称']) {
                //   this.curAreaName = data.data['区县名称']
                //   this.addQxWall(data.data['区县名称'])
                // }
                // // 点击同一个区县删除
                // else {
                //   let entity = this.viewer.entities.getById(this.wallEntityId)
                //   if (entity) {
                //     this.viewer.entities.remove(entity)
                //     entity = undefined
                //   }
                //   this.curAreaName = ''
                // }
                console.log('argis点击', data.data, feature);
                if (feature && feature.id?.typeName === 'wst') {
                  let CesiumToolType = new CesiumTool();
                  // console.log('CesiumTool',CesiumToolType,obj)
                  CesiumToolType.configQiPao(
                    { id: 'pupdiv' + Math.random(10000), obj, data: data.data },
                    data,
                    feature
                  );
                }
              } else {
                this.handler2[0].clickCallBack(data);
                // console.log(this.handler2,'this.handler2')
                // 避免二次触发
                // this.isDynamic = false
                // // return

                // this.timer1 = setTimeout(() => {
                //   // console.log(feature,'feature')
                //   // console.log('argis点击')

                //   this.handler2[0].clickCallBack(data)
                //   this.isDynamic = true
                //   clearTimeout(this.timer1)
                // }, 100)
              }
            }

            // console.log(attr, 'attr')
            // this.openInfoPanel({ type: 'DK', data: attr })
          }
          // else {
          //   this.openInfoPanel({ type: 'NODATA' })
          // }
        });
      }
      // 监听移动
      // return
      // debugger
      // console.log(this.isDynamic, 'this.isDynamic')
      if (this.isDynamic) {
        // 点击的时候不触发撒点
        // console.log(this.handler,'this.handler')
        if (this.handler.length > 0) {
          // debugger
          // 判断当前的屏幕位置是否改变,改变了才去调用
          const lng1 = this.currentPosition.lng;
          const lat1 = this.currentPosition.lat;
          const { lng, lat, h } = this.getCenterPosition(false);
          // 判断移动的距离
          const xLng = Math.abs(lng1 - lng);
          const xLat = Math.abs(lat1 - lat);
          // let t = 0.001 // 标准
          const t = h / 2000000;
          // if (h < 1000) {
          //   t = 0.001
          // }
          // else if (h < 2000) {
          //   t = 0.002
          // }
          // if (lng !== lng1 || lat !== lat1) {
          if (xLng > t || xLat > t || this.isNoData) {
            this.handler.forEach((item) => {
              if (item.callBack.listenerDelCallBack) {
                item.callBack.listenerDelCallBack(item.select);
              }
              if (item.callBack.listenerAddCallBack) {
                item.callBack.listenerAddCallBack(item.select);
              }
            });
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
    // }
  }
  /**
   * @Descripttion: 销毁全部监听
   * @return {*}
   */

  removeListen() {
    this.handler.forEach((item) => {
      item.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      item.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    });
  }

  /**
   * @Descripttion: 根据经纬度和半径生产片范围
   * @param {*} lon
   * @param {*} lat
   * @param {*} radius
   * @return {*}
   */
  getCircleCoordinates(lon, lat, radius) {
    const coordinates = [];
    for (let angle = 0; angle <= 360; angle += 10) {
      // 步长可以根据需要调整
      const radians = (angle * Math.PI) / 180;
      const x = lon + radius * Math.cos(radians);
      const y = lat + radius * Math.sin(radians);
      coordinates.push({ x, y });
    }
    return [coordinates];
  }
  /**
   * @Descripttion: 请求数据接口
   * @param {*} lon 经度
   * @param {*} lat 纬度
   * @param {*} _radius 半径 单位米
   * @param {*} layerList 图层列表
   * @return {*}
   */

  queryArcgisLayersData(lon, lat, _radius, layerList) {
    // console.log(lon,lat,_radius,'参数范围')
    // const layerList = [
    //   {
    //     url: 'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/0c564900-3783-408c-8d7d-89bfd4489209/3e1fe5d5-6a85-4b1e-a476-5d9a63de0a3c/MapServer',
    //     layer: '13',
    //     label: '物联感知'
    //   }
    // ]
    const radius = _radius / 100000;
    // const lon = 106.573456575
    // const lat = 29.560167899
    // const radius = 0.005705 //约500米

    // 计算出一个圆的面数据 geometry
    const circleCoordinates = this.getCircleCoordinates(lon, lat, radius);
    const polygon = JSON.stringify(circleCoordinates)
      .replaceAll('{"x":', '[')
      .replaceAll('"y":', '')
      .replaceAll('}', ']');
    // console.log(polygon, 'getCircleCoordinates')
    const geometry1 = {
      rings: polygon
    };
    // 获取到get
    const geometry2 = JSON.stringify(geometry1).replaceAll('"', '');
    // console.log(JSON.stringify(geometry2), 'JSON.stringify(geometry1')
    const geometry = encodeURIComponent(geometry2);

    const arcgisData = []; // 图层接口请求返回的数据
    if (layerList.length > 0) {
      layerList.forEach((layer, index) => {
        let arcgisUrl = '';
        let queryUrl = '';
        if (layer.layer) {
          arcgisUrl = layer.url + '/' + layer.layer;
        } else {
          arcgisUrl = layer.url;
        }
        // debugger
        // queryUrl =
        //   'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/0c564900-3783-408c-8d7d-89bfd4489209/3e1fe5d5-6a85-4b1e-a476-5d9a63de0a3c/MapServer/13' +
        //   `/query?where=1=1&outFields=*&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryPolygon&geometry=${geometry}`
        queryUrl =
          arcgisUrl +
          `/query?where=1=1&outFields=*&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryPolygon&geometry=${geometry}`;
        axios.post(queryUrl).then((res) => {
          // console.log(res, 'res')
          const layerArcgisData = res.data.features;
          let layerArcgisDataForTable = {};
          layerArcgisDataForTable.features = res.data.features;
          layerArcgisDataForTable.fields = res.data.fields;
          // 婷姐的回调
          window.renderTable(layerArcgisDataForTable, index);
          // 地图直接撒点
          // 有数据才撒点
          //以下代码注释调不撒点，但是要渲染表格
          // if (layerArcgisData.length > 0) {
          //   window.addArcgisCallbackPoints(layerArcgisData, layer)
          // }
          // arcgisData[layer.label] = layerArcgisData
          // console.log(arcgisData)
        });
      });
    }

    return arcgisData;
    // console.log(geometry, 'geometry')
    const arcgisUrl =
      'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/0c564900-3783-408c-8d7d-89bfd4489209/3e1fe5d5-6a85-4b1e-a476-5d9a63de0a3c/MapServer/13';
    // const arcgisUrl =
    //   'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/459abbb5-a81c-4586-9ae2-8329bd14fcfa/cd55c9be-de72-4d30-9aff-2da6c224f2a1/MapServer/124'
    const url =
      arcgisUrl +
      `/query?where=1=1&outFields=*&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryPolygon&geometry=${geometry}`;
    console.log(url, 'url');
    axios.post(url).then((res) => {
      console.log(res, 'res');
    });
  }

  // 本地调试用
  queryArcgisLayersData1(lon, lat, _radius) {
    // console.log(lon,lat,_radius)
    const layerList = [
      {
        url: 'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/0c564900-3783-408c-8d7d-89bfd4489209/3e1fe5d5-6a85-4b1e-a476-5d9a63de0a3c/MapServer',
        layer: '3',
        label: '人'
      }
    ];
    const radius = _radius / 100000;
    // const lon = 106.573456575
    // const lat = 29.560167899
    // const radius = 0.005705 //约500米

    // 计算出一个圆的面数据 geometry
    const circleCoordinates = this.getCircleCoordinates(lon, lat, radius);
    const polygon = JSON.stringify(circleCoordinates)
      .replaceAll('{"x":', '[')
      .replaceAll('"y":', '')
      .replaceAll('}', ']');
    // console.log(polygon, 'getCircleCoordinates')
    const geometry1 = {
      rings: polygon
    };
    // 获取到get
    const geometry2 = JSON.stringify(geometry1).replaceAll('"', '');
    console.log(JSON.stringify(geometry2), 'JSON.stringify(geometry1');
    const geometry = encodeURIComponent(geometry2);

    const arcgisData = []; // 图层接口请求返回的数据
    // layerList.forEach(layer => {
    //   let arcgisUrl = ''
    //   let queryUrl = ''
    //   if (layer.layer) {
    //     arcgisUrl = layer.url + '/' + layer.layer
    //   } else {
    //     arcgisUrl = layer.url
    //   }
    //   queryUrl =
    //     'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/0c564900-3783-408c-8d7d-89bfd4489209/3e1fe5d5-6a85-4b1e-a476-5d9a63de0a3c/MapServer/13' +
    //     `/query?where=1=1&outFields=*&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryPolygon&geometry=${geometry}`
    //   axios.post(queryUrl).then(res => {
    //     console.log(res, 'res')
    //     const layerArcgisData = res.data.features
    //     // 婷姐的回调
    //     window.renderTable(layerArcgisData)
    //     // 地图直接撒点
    //     window.addArcgisCallbackPoints(layerArcgisData, layer)
    //     arcgisData[layer.label] = layerArcgisData
    //     // console.log(arcgisData)
    //   })
    // })

    // return arcgisData
    // console.log(geometry, 'geometry')
    // const arcgisUrl =
    //   'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/0c564900-3783-408c-8d7d-89bfd4489209/3e1fe5d5-6a85-4b1e-a476-5d9a63de0a3c/MapServer/3'
    const arcgisUrl =
      'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/0c564900-3783-408c-8d7d-89bfd4489209/3e1fe5d5-6a85-4b1e-a476-5d9a63de0a3c/MapServer/13';
    const url =
      arcgisUrl +
      `/query?where=1=1&outFields=*&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryPolygon&geometry=${geometry}`;
    console.log(url, 'url');
    axios.post(url).then((res) => {
      console.log(res, 'res');
    });
  }

  // /**
  //  * @Descripttion:  地图内置撒点方法
  //  * @param {*} list
  //  * @return {*}
  //  */
  // addArcgisCallbackPoints (list) {

  // }

  /**
   * @Descripttion: 画自定义圆
   * @return {*}
   */
  DrawCircle() {
    return new Promise((resolve, reject) => {
      const viewer = this.viewer;
      let centerPoint = null;
      let centerPointEntity = null; // 用于存储中点实体的引用
      let radius = 10;
      const _id = '画圆drawingCircle' + Math.random();
      viewer.scene.globe.depthTestAgainstTerrain = false;
      const drawingCircle = viewer.entities.add({
        id: _id,
        name: '画圆',
        ellipse: {
          semiMinorAxis: new Cesium.CallbackProperty(() => {
            return radius;
          }, false),
          semiMajorAxis: new Cesium.CallbackProperty(() => {
            return radius;
          }, false),
          material: Cesium.Color.RED.withAlpha(0.2),
          outline: true,
          outlineColor: Cesium.Color.GREEN,
          outlineWidth: 2,
          fill: true // 为true时只显示轮廓线
        }
      });

      let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

      handler.setInputAction((event) => {
        // alert('wt')
        var cartesian = this.getCatesian3FromPX(event.position);
        if (cartesian && centerPoint === null) {
          centerPoint = cartesian;
          drawingCircle.position = centerPoint;
          const p = this.transformCartesianToWGS84(centerPoint);
          console.log(p, '点击的点的位置');
          // 添加中点实体并保存其引用
          centerPointEntity = viewer.entities.add({
            position: cartesian,
            point: {
              color: Cesium.Color.RED,
              pixelSize: 10
            }
          });
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      handler.setInputAction((event) => {
        if (centerPoint) {
          let cartesian = this.getCatesian3FromPX(event.endPosition);
          if (cartesian) {
            let distance = Cesium.Cartesian3.distance(centerPoint, cartesian);
            console.log(distance, '距离');
            radius = distance;
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      handler.setInputAction(() => {
        if (centerPoint !== null && radius > 0) {
          handler.destroy(); // 关闭鼠标事件监听，结束绘制

          let circleCenter = Cesium.Cartographic.fromCartesian(centerPoint);
          let lng = Cesium.Math.toDegrees(circleCenter.longitude);
          let lat = Cesium.Math.toDegrees(circleCenter.latitude);
          // const p = this.transformCartesianToWGS84(cartesian)
          console.log(lng, lat, radius, '点击的点的位置');
          this.queryArcgisLayersData1(lng, lat, radius);
          resolve({
            center: { lng: lng, lat: lat },
            radius: radius
          });
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    });
  }
  /**
   * @Descripttion: 画自定义线
   * @return {*}
   */

  DrawPolyline() {
    return new Promise((resolve, reject) => {
      const viewer = this.viewer;
      const polylinePoints = [];

      // 临时折线实体
      const polylineEntity = viewer.entities.add({
        Id: 'drawingPolyline',
        name: '画线',
        polyline: {
          //使用CallbackProperty允许我们在用户点击时动态更新线段的位置
          positions: new Cesium.CallbackProperty(() => {
            return polylinePoints;
          }, false),
          width: 2,
          material: Cesium.Color.RED
        }
      });

      // 临时动态线实体
      const dynamicLineEntity = viewer.entities.add({
        polyline: {
          positions: new Cesium.CallbackProperty(() => {
            if (lastPoint && currentMousePoint) {
              return [lastPoint, currentMousePoint];
            } else {
              return [];
            }
          }, false),
          width: 2,
          material: Cesium.Color.RED.withAlpha(0.5) // 使用半透明红色，与主线区分
        }
      });

      let lastPoint = null;
      let currentMousePoint = null;

      // 创建事件处理器
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

      // 注册鼠标左键点击事件，用于添加点和显示点
      handler.setInputAction((event) => {
        let cartesian = this.getCatesian3FromPX(event.position);
        if (cartesian) {
          polylinePoints.push(cartesian);
          lastPoint = cartesian;

          console.log(polylinePoints, 'polylinePoints');
          viewer.entities.add({
            position: cartesian,
            point: {
              color: Cesium.Color.BLUE,
              pixelSize: 10
            }
          });
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // 鼠标移动事件，更新当前鼠标位置并重绘临时线
      handler.setInputAction((event) => {
        currentMousePoint = this.getCatesian3FromPX(event.endPosition);
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      // 注册鼠标左键双击点击事件，用于结束绘制
      handler.setInputAction(() => {
        handler.destroy();
        viewer.entities.remove(dynamicLineEntity); // 移除临时线

        resolve(polylinePoints);
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    });
  }

  /**
   * 拾取位置点
   * @param {Object} px 屏幕坐标
   * @return {Object} Cartesian3 三维坐标
   */
  getCatesian3FromPX(px) {
    if (this.viewer && px) {
      var picks = this.viewer.scene.drillPick(px);
      var cartesian = null;
      var isOn3dtiles = false,
        isOnTerrain = false;
      // drillPick
      for (let i in picks) {
        let pick = picks[i];

        if (
          (pick && pick.primitive instanceof Cesium.Cesium3DTileFeature) ||
          (pick && pick.primitive instanceof Cesium.Cesium3DTileset) ||
          (pick && pick.primitive instanceof Cesium.Model)
        ) {
          //模型上拾取
          isOn3dtiles = true;
        }
        // 3dtilset
        if (isOn3dtiles) {
          this.viewer.scene.pick(px); // pick
          cartesian = this.viewer.scene.pickPosition(px);
          if (cartesian) {
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            if (cartographic.height < 0) cartographic.height = 0;
            let lon = Cesium.Math.toDegrees(cartographic.longitude),
              lat = Cesium.Math.toDegrees(cartographic.latitude),
              height = cartographic.height;
            cartesian = this.transformWGS84ToCartesian({
              lng: lon,
              lat: lat,
              alt: height
            });
          }
        }
      }
      // 地形
      let boolTerrain =
        this.viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider;
      // Terrain
      if (!isOn3dtiles && !boolTerrain) {
        var ray = this.viewer.scene.camera.getPickRay(px);
        if (!ray) return null;
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        isOnTerrain = true;
      }
      // 地球
      if (!isOn3dtiles && !isOnTerrain && boolTerrain) {
        cartesian = this.viewer.scene.camera.pickEllipsoid(
          px,
          this.viewer.scene.globe.ellipsoid
        );
      }
      if (cartesian) {
        let position = this.transformCartesianToWGS84(cartesian);
        if (position.alt < 0) {
          cartesian = this.transformWGS84ToCartesian(position, 0.1);
        }
        return cartesian;
      }
      return false;
    }
  }

  /***
   * 坐标转换 84转笛卡尔
   * @param {Object} {lng,lat,alt} 地理坐标
   * @return {Object} Cartesian3 三维位置坐标
   */

  transformWGS84ToCartesian(position, alt) {
    if (this.viewer) {
      return position
        ? Cesium.Cartesian3.fromDegrees(
            position.lng || position.lon,
            position.lat,
            (position.alt = alt || position.alt),
            Cesium.Ellipsoid.WGS84
          )
        : Cesium.Cartesian3.ZERO;
    }
  }

  /***
   * 坐标转换 笛卡尔转84
   * @param {Object} Cartesian3 三维位置坐标
   * @return {Object} {lng,lat,alt} 地理坐标
   */

  transformCartesianToWGS84(cartesian) {
    // debugger
    if (this.viewer && cartesian) {
      var ellipsoid = Cesium.Ellipsoid.WGS84;
      var cartographic = ellipsoid.cartesianToCartographic(cartesian);
      return {
        lng: Cesium.Math.toDegrees(cartographic.longitude),
        lat: Cesium.Math.toDegrees(cartographic.latitude),
        alt: cartographic.height
      };
    }
  }

  //Generate a random circular pattern with varying heights.

  /**
   * @Descripttion:  根据经纬度计算路线
   * @param {*} lon
   * @param {*} lat
   * @param {*} radius
   * @param {*} start
   * @return {*}
   */
  computeCirclularFlight(lon, lat, radius, start) {
    const property = new Cesium.SampledPositionProperty();
    // for (let i = 0; i <= 360; i += 45) {
    //   const radians = Cesium.Math.toRadians(i)
    //   const time = Cesium.JulianDate.addSeconds(
    //     start,
    //     i,
    //     new Cesium.JulianDate()
    //   )
    //   // 创建 SampledPositionProperty 对象
    //   const position = Cesium.Cartesian3.fromDegrees(
    //     lon + radius * 1.5 * Math.cos(radians),
    //     lat + radius * Math.sin(radians),
    //     Cesium.Math.nextRandomNumber() * 500 + 1750
    //   )
    //   // const position = Cesium.Cartesian3.fromDegrees(
    //   //   lon,
    //   //   lat,
    //   //   Cesium.Math.nextRandomNumber()
    //   // )
    //   property.addSample(time, position)

    //   //Also create a point for each sample we generate.
    //   this.viewer.entities.add({
    //     position: position,
    //     point: {
    //       pixelSize: 8,
    //       color: Cesium.Color.TRANSPARENT,
    //       outlineColor: Cesium.Color.YELLOW,
    //       outlineWidth: 3
    //     }
    //   })
    // }
    let data = [
      { longitude: 116.405419, latitude: 39.918034, height: 0, time: 0 },
      { longitude: 120.2821, latitude: 33.918145, height: 0, time: 30 },
      { longitude: 115.497402, latitude: 39.344641, height: 70000, time: 60 },
      { longitude: 107.942392, latitude: 29.559967, height: 70000, time: 110 },
      { longitude: 106.549265, latitude: 29.559967, height: 0, time: 120 }
    ];
    // let property = createProperty(data);
    // 添加数据到 SampledPositionProperty
    property.addSamples(times, positions);
    return property;
  }

  /**
   * @Descripttion: 根据经纬度列表数据，开始时间 生成轨迹
   * @param {*} source 经纬度列表数据
   * @param {*} start 开始时间
   * @return {*}
   */
  createProperty(source, start) {
    // 取样位置 相当于一个集合
    const property = new Cesium.SampledPositionProperty();
    for (let i = 0; i < source.length; i++) {
      let time = Cesium.JulianDate.addSeconds(
        start,
        source[i].time,
        new Cesium.JulianDate()
      );
      let position = Cesium.Cartesian3.fromDegrees(
        source[i].longitude,
        source[i].latitude,
        source[i].height
      );
      // 添加位置，和时间对应
      property.addSample(time, position);
    }
    return property;
  }
  /**
   * @Descripttion: 根据轨迹数据和模型添加轨迹巡防
   * @param {*} dataList
   * @param {*} modal
   * @param {*} startTime  ps:同时的话只能有一个开始时间
   * @return {*}
   */

  flyMoveByModal(dataList, modal, startTime) {
    Cesium.Ion.defaultAccessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMTUwNjgzNi0wMDBmLTQ3NzItYTY0OC0wMzYzMzkyNzU3NDgiLCJpZCI6MTY4MjQsImlhdCI6MTcxMDQwMTI2NH0.9Bzy3bYXMRqSqrqVwOxhRBJ1VaS2zQudBNK8Zp91-8E';
    // const viewer = new Cesium.Viewer('cesiumContainer', {
    //   infoBox: false, // Disable InfoBox widget
    //   selectionIndicator: false, // Disable selection indicator
    //   shouldAnimate: true, // Enable animations
    //   // terrain: Cesium.Terrain.fromWorldTerrain(),
    // })

    // Enable lighting based on the sun position
    this.viewer.scene.globe.enableLighting = true;

    // Enable depth testing so things behind the terrain disappear.
    this.viewer.scene.globe.depthTestAgainstTerrain = true;

    // Set the random number seed for consistent results.
    Cesium.Math.setRandomNumberSeed(30);

    // Set bounds of our simulation time
    const start = Cesium.JulianDate.fromDate(
      new Date(startTime.year, startTime.month, startTime.day, startTime.hour)
    );
    const stop = Cesium.JulianDate.addSeconds(
      start,
      3600,
      new Cesium.JulianDate()
    );

    // Make sure viewer is at the desired time.
    this.viewer.clock.startTime = start.clone();
    this.viewer.clock.stopTime = stop.clone();
    this.viewer.clock.currentTime = start.clone();
    this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // Loop at the end
    this.viewer.clock.multiplier = 1;

    // Set timeline to simulation bounds
    this.viewer.timeline.zoomTo(start, stop);

    // Compute the entity position property.
    // const position = this.computeCirclularFlight(106.5, 29.5, 0.06, start)
    // const data = [
    //   { longitude: 116.405419, latitude: 39.918034, height: 40000, time: 0 },
    //   { longitude: 120.2821, latitude: 33.918145, height: 2000, time: 30 },
    //   { longitude: 115.497402, latitude: 39.344641, height: 70000, time: 60 },
    //   { longitude: 107.942392, latitude: 29.559967, height: 70000, time: 110 },
    //   { longitude: 106.549265, latitude: 29.559967, height: 333, time: 120 }
    // ]
    const position = this.createProperty(dataList, start);
    console.log(position, 'position');
    // Actually create the entity
    const entity = this.viewer.entities.add({
      // Set the entity availability to the same interval as the simulation time.
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({
          start: start,
          stop: stop
        })
      ]),

      // Use our computed positions
      position: position,

      // Automatically compute orientation based on position movement.
      orientation: new Cesium.VelocityOrientationProperty(position),

      // Load the Cesium plane model to represent the entity
      model: {
        uri: this.filePath + modal,
        minimumPixelSize: 64
      },

      // Show the path as a pink line sampled in 1 second increments.
      path: {
        resolution: 1,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.1,
          color: Cesium.Color.RED
        }),
        width: 10
      }
    });

    // // Add button to view the path from the top down
    // Sandcastle.addDefaultToolbarButton('View Top Down', function () {
    //   viewer.trackedEntity = undefined
    //   viewer.zoomTo(
    //     viewer.entities,
    //     new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90))
    //   )
    // })

    // // Add button to view the path from the side
    // Sandcastle.addToolbarButton('View Side', function () {
    //   viewer.trackedEntity = undefined
    //   viewer.zoomTo(
    //     viewer.entities,
    //     new Cesium.HeadingPitchRange(
    //       Cesium.Math.toRadians(-90),
    //       Cesium.Math.toRadians(-15),
    //       7500
    //     )
    //   )
    // })

    // // Add button to track the entity as it moves
    // Sandcastle.addToolbarButton('View Aircraft', function () {
    //   viewer.trackedEntity = entity
    // })

    // // Add a combo box for selecting each interpolation mode.
    // Sandcastle.addToolbarMenu(
    //   [
    //     {
    //       text: 'Interpolation: Linear Approximation',
    //       onselect: function () {
    //         entity.position.setInterpolationOptions({
    //           interpolationDegree: 1,
    //           interpolationAlgorithm: Cesium.LinearApproximation,
    //         })
    //       },
    //     },
    //     {
    //       text: 'Interpolation: Lagrange Polynomial Approximation',
    //       onselect: function () {
    //         entity.position.setInterpolationOptions({
    //           interpolationDegree: 5,
    //           interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
    //         })
    //       },
    //     },
    //     {
    //       text: 'Interpolation: Hermite Polynomial Approximation',
    //       onselect: function () {
    //         entity.position.setInterpolationOptions({
    //           interpolationDegree: 2,
    //           interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
    //         })
    //       },
    //     }
    //   ],
    //   'interpolationMenu'
    // )
  }
}

export default CesiumMethod;
