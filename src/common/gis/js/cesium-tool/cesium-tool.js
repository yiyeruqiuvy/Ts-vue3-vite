/*
 * @Descripttion: cesium基础组件能力
 * @Author: peiqf
 * @Date: 2024-03-18 20:25:05
 * @LastEditors: peiqf
 * @LastEditTime: 2025-04-22 09:19:10
 */

import { merge } from 'lodash';
import axios from 'axios';
// import faceConfig from 'faceConfig.js';
import { commonUtits } from '@/utils/tool.js';

// import API from '@/common/gis/js/cesium-tool/api/index.js';
// import $ from 'jquery';
// import MAP_BUS_EVENTS from '@/common/gis/js/busEvents.js';
// import Vue from 'vue';
const faceConfig = {
  filePath:
    'http://23.210.52.80:18081/cockpit/api/common/attachmentFile/previewFileAuth/',
  basePath: 'http://23.210.52.54:28081/cockpit/api'
};
class CesiumTool {
  constructor() {
    this.pups = [];
    this.pointsList = {}; // 自己撒点的数据集合 用作删除，通过label来辨识
    this.selectedPoints = {}; // 撒点的种类结合，包含所有已撒点信息，图标等   window.CesiumTool.selectedPoints  通过这个方法暴露
  }

  /**
   * @Descripttion: 单个 撒点
   * @param {*} pointClassInfo 点击撒点的 图例数据  包含撒点图标和图例图标  { label: '自定义', }包含option以及这一类型的参数，distance
   * @param {*} point 撒点的配置数据 包含撒点图标和图例图标，包含option
   *  {
          longitude: '106.50014042714167',
          latitude: '29.54269255710681',
          pointIcon: this.defImg,
          detailData: {
          'key1':'value1',
          'key2':'value2',
          },
          // 弹窗的详情数据
        },
   * @param {*} layerId  随机的，唯一id,可以不传，自动生成,用来做删除，遍历删除
         '2121dashfj2',
   * @param {*} layerCode 地图撒点的一类点位，目前用中文label,用来做监听点击打开弹窗的一类判定
         '自定义'
   * @param {*} CallBack  点击点位回调
   * @param {*} ifAddText 顶部是否显示数据名
   * @return {*}
   */
  addSinglePoint(
    pointClassInfo,
    point,
    layerId,
    layerCode,
    callBack,
    ifAddText
  ) {
    // 判断
    if (!(point.longitude && point.latitude)) return;
    // 初始化这个已撒点收集
    if (!this.selectedPoints[pointClassInfo.label]) {
      this.selectedPoints[pointClassInfo.label] = [];
      this.selectedPoints[pointClassInfo.label].push(point);
    }
    // debugger
    let option = {};
    let defaultOption = {
      position: Cesium.Cartesian3.fromDegrees(
        point.longitude,
        point.latitude,
        point.height ? point.height : 340
      ),
      billboard: {
        image: point.pointIcon,
        // 高度（以像素为单位）
        height: 101,
        // 宽度（以像素为单位）
        width: 83,
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 20000)
        verticalOrigin: Cesium.VerticalOrigin.CENTER
      },
      label: {},
      pointData: point, // 所有点位信息
      pointClassInfo,
      modalData: point.detailData,
      geometry: {
        x: point.longitude,
        y: point.latitude
      } // 存入的经纬度
      // distance: 200000000
    };

    if (ifAddText) {
      defaultOption.label = {
        disableDepthTestDistance: 50000,
        // 文本。支持显式换行符“ \ n”
        text: point.name,
        // 字体样式，以CSS语法指定字体
        font: '14pt sans-serif',
        // scale: 0.5,
        // 字体颜色
        // fillColor: Cesium.Color.BLACK,
        fillColor: Cesium.Color.fromCssColorString('#C0E2FF'),
        // fillColor:{ red: 0.6352941176470588, green: 0.8941176470588236, blue: 0.9490196078431372, alpha: 1 },
        outlineColor: Cesium.Color.fromCssColorString('#C0E2FF'),
        // #A2E4F2
        backgroundColor: Cesium.Color.fromBytes(7, 26, 34, 186),
        // backgroundColor:Cesium.Color.fromCssColorString( "rgba(0, 0, 0, 0.9)" ),
        // 背景颜色
        // backgroundColor: Cesium.Color.AQUA,
        // 是否显示背景颜色
        showBackground: true,
        backgroundPadding: new Cesium.Cartesian2(20, 10),
        // 字体边框
        outline: true,
        // 字体边框颜色
        // outlineColor: Cesium.Color.WHITE,
        // 字体边框尺寸
        // outlineWidth: 10,
        // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
        // scale: 1.0,
        // 设置样式：FILL：填写标签的文本，但不要勾勒轮廓；OUTLINE：概述标签的文本，但不要填写；FILL_AND_OUTLINE：填写并概述标签文本。
        // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE, // label样式

        // 相对于坐标的水平位置
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        // 相对于坐标的水平位置
        // 相对于坐标的水平位置
        horizontalOrigin: Cesium.HorizontalOrigin.BOTTOM,
        // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
        // pixelOffset: new Cesium.Cartesian2(20, -170),
        pixelOffset: new Cesium.Cartesian2(-50, -100),

        // pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
        //   5000,
        //   0.5,
        //   20000,
        //   1
        // ),
        // 显示在距相机的距离处的属性，多少区间内是可以显示的
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 20000),
        // 是否显示
        show: true
      };
      // 将alltypeOption中的配置参数给每个点位初始化
      if (!!pointClassInfo?.option) {
        // debugger
        const option = pointClassInfo.option;
        if (option && option.distance) {
          defaultOption.distance = option.distance;
        }
        // 处理文字颜色
        if (option?.label && option?.label.ourTextColor) {
          const color = option.label.ourTextColor.split(',');
          defaultOption.label.fillColor = Cesium.Color.fromBytes(
            color[0],
            color[1],
            color[2],
            color[3]
          );
        }
        // 处理文字背景颜色
        if (option?.label && option?.label.ourBgColor) {
          const color = option.label.ourBgColor.split(',');
          defaultOption.label.backgroundColor = Cesium.Color.fromBytes(
            color[0],
            color[1],
            color[2],
            color[3]
          );
        }
        // 处理文字背景间距
        if (option?.label && option?.label.ourBgPadding) {
          const padding = option.label.ourBgPadding.split(',');
          defaultOption.label.backgroundPadding = new Cesium.Cartesian2(
            padding[0],
            padding[1]
          );
        }
        // 处理文本偏移距离
        if (option?.label && option?.label.ourPixelOffset) {
          const offset = option.label.ourPixelOffset.split(',');
          defaultOption.label.pixelOffset = new Cesium.Cartesian2(
            Number(offset[0]),
            Number(offset[1])
          );
        }
        // 处理距离显示比例
        if (option?.label && option.label.ourPixelOffsetScaleByDistance) {
          const color = option.label.ourPixelOffsetScaleByDistance.split(',');
          defaultOption.label.pixelOffsetScaleByDistance =
            new Cesium.NearFarScalar(color[0], color[1], color[2], color[3]);
        }
        // 处理撒点图片的宽高
        // debugger
        if (option && option?.billboard) {
          // debugger
          // console.log(option.billboard,'option.billboard')
          defaultOption.billboard.height = option.billboard.height;
          defaultOption.billboard.width = option.billboard.width;
        }
        defaultOption = merge({}, defaultOption, option);
      }
    }
    // 处理每个点位单独的配置参数
    // 处理文字颜色
    if (point?.option && point?.option.label.ourTextColor) {
      const color = point.option.label.ourTextColor.split(',');
      point.option.label.fillColor = Cesium.Color.fromBytes(
        color[0],
        color[1],
        color[2],
        color[3]
      );
    }
    // 处理文字背景颜色
    if (point?.option && point?.option.label.ourBgColor) {
      const color = point.option.label.ourBgColor.split(',');
      point.option.label.backgroundColor = Cesium.Color.fromBytes(
        color[0],
        color[1],
        color[2],
        color[3]
      );
    }
    // 处理文字背景间距
    if (point?.option && point?.option.label.ourBgPadding) {
      const padding = point.option.label.ourBgPadding.split(',');
      point.option.label.backgroundPadding = new Cesium.Cartesian2(
        padding[0],
        padding[1]
      );
    }
    // 处理文本偏移距离
    if (point?.option && point?.option.label.ourPixelOffset) {
      const offset = point.option.label.ourPixelOffset.split(',');
      point.option.label.pixelOffset = new Cesium.Cartesian2(
        Number(offset[0]),
        Number(offset[1])
      );
    }
    // 处理距离显示比例
    if (point?.option && point?.option.label.ourPixelOffsetScaleByDistance) {
      const color = point.option.label.ourPixelOffsetScaleByDistance.split(',');
      point.option.label.pixelOffsetScaleByDistance = new Cesium.NearFarScalar(
        color[0],
        color[1],
        color[2],
        color[3]
      );
    }
    // 处理撒点顶部文字,取point.name
    if (point?.option && ifAddText) {
      point.option.label.text = point.name;
    }
    if (pointClassInfo?.option && pointClassInfo?.option?.billboard) {
      // debugger
      // console.log(option.billboard,'option.billboard')
      defaultOption.billboard.height = pointClassInfo.option.billboard.height;
      defaultOption.billboard.width = pointClassInfo.option.billboard.width;
    }
    // debugger
    // if (point?.option) {
    option = merge({}, defaultOption, point.option);
    // }
    console.log(option, 'option111');
    // 判断图片地址

    // const callBack = {
    //   clickCallBack: data => {
    //     const geometry = data.id.geometry
    //     console.log(data.id.modalData, 'callBackdata')
    //     this.$bus.$emit('openArcgisModal', {
    //       data: data.id.modalData,
    //       modalTitle: pointClassInfo.label + '详情'
    //     })
    //     const coordinate = {
    //       lat: geometry.y,
    //       lon: geometry.x,
    //       h: 3000
    //     }
    //     window.SJCesiumMethod.viewerChange(coordinate)
    //   },
    //   mousemoveCallBack: data => {
    //     // console.log('移入', data)
    //   },
    //   mouseoutCallBack: data => {
    //     // console.log('移出', data)
    //   }
    //   // listenerAddCallBack: this.getPoints,
    //   // listenerDelCallBack: this.deletePoints
    // }
    // this.pointsListener[pointClassInfo.label] =
    window.SJCesiumMethod.addImg(layerCode, option, callBack, layerId);
  }

  /**
   * @Descripttion: 批量撒点 自定义
   * @param {*} pointClassInfo  图例数据  包含撒点图标和图例图标
   * @param {*} dataList 列表数据
   * @param {*} ifAddText 是否加载文字 默认不加
   * @return {*}
   */

  addBatchPoints(
    pointClassInfo,
    dataList,
    callBack,
    ifAddText = false,
    isPoint = false
  ) {
    // debugger
    // console.log(pointClassInfo, 'pointClassInfo')
    // 初始化这个已选监听
    if (!this.pointsList[pointClassInfo.label]) {
      this.pointsList[pointClassInfo.label] = [];
    }
    // 删除
    if (this.pointsList[pointClassInfo.label].length > 0) {
      this.pointsList[pointClassInfo.label].forEach((item) => {
        // console.log('删除撒点',item)
        window.SJCesiumMethod.deleteEntities(item);
        // SJCesiumMethod.removeListen()
      });
      this.pointsList[pointClassInfo.label] = [];
    }
    if (dataList.length > 0) {
      dataList.forEach((item, idx) => {
        // 优先取每个点位具备的
        if (!isPoint) {
          item.pointIcon = item.pointIcon
            ? faceConfig.filePath + item.pointIcon
            : faceConfig.filePath + pointClassInfo.pointIcon;
        }

        // this.mapPointIcon.tollStationP
        const r = Math.random();
        // 随机的
        const layerId = pointClassInfo.label + idx + r;
        this.pointsList[pointClassInfo.label].push(layerId);
        this.addSinglePoint(
          pointClassInfo,
          item,
          layerId,
          pointClassInfo.label,
          callBack,
          ifAddText
        );
        // if (ifAddText) {
        //   this.addSinglePoint2(
        //     pointClassInfo,
        //     item,
        //     layerId,
        //     pointClassInfo.label,
        //     idx + 1
        //   )
        // } else {
        //   this.addSinglePoint(
        //     pointClassInfo,
        //     item,
        //     layerId,
        //     pointClassInfo.label,
        //     callBack
        //   )
        // }
      });
    }
  }

  /**
   * @Descripttion:  ARCGIS  类型撒点
   * @param {*} pointClassInfo 图例数据
   * pointClassInfo = {
        url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/c16d531b-f479-464a-b92a-60f9b42271be/f4fd999f-3f40-475e-9639-6145cff2daf3/MapServer',
        layer: 83,
        label: 'arcgis',
        children:[{}]
      }
   * @return {*}
   * {
        url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/c16d531b-f479-464a-b92a-60f9b42271be/f4fd999f-3f40-475e-9639-6145cff2daf3/MapServer',
        layer: 83,
        label: 'arcgis',
      }
   */
  addArcgisLayer(pointClassInfo, callBack) {
    // debugger
    // 初始化这个已选的
    if (!this.selectedPoints[pointClassInfo.label]) {
      this.selectedPoints[pointClassInfo.label] = [];
    }
    // 多个 2级目录
    if (pointClassInfo.children && pointClassInfo.children.length > 0) {
      pointClassInfo.children.forEach((item) => {
        const option = {
          ArcGisLayer: item.url,
          layers: item.layer,
          label: item.label
        };
        // const callBack = {
        //   clickCallBack: data => {
        //     if (data.name !== 'biankuang') {
        //       data.modalTitle = data.name + '信息'
        //       this.handleCallback(data)
        //     }
        //   }
        // }
        this.selectedPoints[pointClassInfo.label].push(item);
        window.SJCesiumMethod.loadArcgisImageryLayer(option, callBack);
      });
    } else {
      // 单个
      // debugger
      const option = {
        ArcGisLayer: pointClassInfo.url,
        layers: pointClassInfo.layer,
        label: pointClassInfo.label
      };
      // const callBack = {
      //   clickCallBack: data => {
      //     if (data.name !== 'biankuang') {
      //       data.modalTitle = data.name + '信息'
      //       this.handleCallback(data)
      //     }
      //   }
      // }
      window.SJCesiumMethod.loadArcgisImageryLayer(option, callBack);
      this.selectedPoints[pointClassInfo.label].push(pointClassInfo);
    }
  }

  /**
   * @Descripttion: 删除单个图层的撒点，根据类型判断
   * @param {*} pointClassInfo
   * @return {*}
   */
  clearBySelect(pointClassInfo) {
    // debugger
    // 自己撒点的删除
    if (
      !!pointClassInfo.catalogueType &&
      pointClassInfo.catalogueType === 'POINT'
    ) {
      // 删除
      if (this.pointsList[pointClassInfo.label].length > 0) {
        this.pointsList[pointClassInfo.label].forEach((item) => {
          window.SJCesiumMethod.deleteEntities(item);
        });
        this.pointsList[pointClassInfo.label] = [];
      }
    }
    // arcgis撒点的删除
    else {
      // debugger
      // 多个
      if (pointClassInfo.children && pointClassInfo.children.length > 0) {
        pointClassInfo.children.forEach((item) => {
          // debugger
          window.SJCesiumMethod.removeArcgisImageryLayer(item.label);
        });
        // 单个
      } else {
        window.SJCesiumMethod.removeArcgisImageryLayer(pointClassInfo.label);
      }
    }
  }

  /**
   * @Descripttion: 地图清屏 自定义和arcgis的
   * @return {*}
   */
  clearMapAll() {
    // 自定义点位清除
    // debugger
    const valuesList = Object.values(this.pointsList);
    if (valuesList.length > 0) {
      valuesList.forEach((item1, idx1) => {
        if (item1.length > 0) {
          item1.forEach((item2) => {
            window.SJCesiumMethod.deleteEntities(item2);
          });
          // this.pointsList.splice(idx1, 1)
          delete this.pointsList[Object.keys[idx1]];
        }
      });
      // console.log(this.pointsList, 'this.pointsList')
    }
    // arcgis清除
    window.SJCesiumMethod.delAllArcgisImageryLayer();
    // 清空
    this.pointsList = {};
    this.selectedPoints = {};
  }

  /**
   * @Descripttion: 新版初始化地图
   * @param {*} areaCode
   * @param {*} isAdd3D 是否加载三维模型，默认加载
   * @return {*}
   */

  async initCesiumMapCQ(areaCode, isAdd3D = true) {
    // publicMethod.loadMap('cesium', 'bigsceen-sj-map', 'SJCesiumMethod')
    const useId = '32697850912581';
    let cesiumUrl = 'http://23.99.222.51:12308/api/honeyscene/';
    // 三维地图
    const result = await commonUtits.getUrlPrefix({
      configCode: 'CESIUM_URL'
    });
    if (result.serviceSuccess) {
      cesiumUrl = result.data.result.configValue;
    }
    // const cesiumUrl = await this.getCesiumUrl()
    const api = cesiumUrl + useId + '/';
    const checkApi = cesiumUrl + 'check/' + useId + '/';
    const params = {
      level: '5',
      value: areaCode
    };
    const res = await axios.post(
      faceConfig.basePath + '/areaCode/getAreaCascadeList',
      params
    );
    if (res.serviceSuccess) {
      console.log(res);
      const areaCodeList = res.data.areaCodeList;
      // 地形影像
      if (isAdd3D) {
        areaCodeList.splice(0, 0, {
          value: areaCode + '000'
        });
      }
      const effectiveAreaCodeList = [];
      areaCodeList.forEach((areaCode) => {
        const url = checkApi + areaCode.value + '000';
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
                res.data.result.name.includes('地形影像')
              ) {
                // console.log(
                //   '有三维模型',
                //   res.data.result.name,
                //   res.data.result.name.includes('地形影像')
                // )
                effectiveAreaCodeList.push(api + areaCode.value + '000');
                const addr = [api + areaCode.value + '000'];
                axios
                  .all(
                    [api + areaCode.value + '000'].map((url) => axios.get(url))
                  )
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
                      window.SJCesiumMethod.LoadScene(
                        items,
                        access_server,
                        false
                      );
                    })
                  )
                  .catch((error) => {
                    console.error(
                      'There has been a problem with your axios operation:',
                      error
                    );
                  });
              } else {
                console.log('不存在三维模型');
              }
            }
          }
        });
      });
    }
  }
  //自定义气泡
  // configQiPao() {
  //   // 使用bus进行通知点击区域
  //   Vue.bus.emit(MAP_BUS_EVENTS.CLICK_CQ_3D_AREA, ...[...arguments].slice(1));
  //   // return
  //   // console.log(param, window.centerPointList)
  //   // let filterObj = window.centerPointList.filter(
  //   //   item => item.areaCode === param.data['区县代码']
  //   // )[0]
  //   // console.log('filterObj', filterObj)
  //   // // alert('iooo')
  //   // $('.pups-box').html('')
  //   // var divmark = `<div class='pups'   style='position:absolute; border-radius: 10px;left:${param.obj.left};top:${param.obj.top}' >
  //   // <p>${(filterObj.total || 0)}  <span class="event">风险数量</span></p>
  //   // <p class='areaName'>${filterObj.areaName}</p>
  //   // </div>`
  //   // // let window.sjMapModule.viewer
  //   // $('.pups-box').append(divmark)
  // }
}

export default CesiumTool;
