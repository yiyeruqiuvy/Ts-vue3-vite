<!--
 * @Descripttion: 地图入口
 * @Author: peiqf
 * @Date: 2025-04-21 10:19:19
 * @LastEditors: peiqf
 * @LastEditTime: 2025-04-22 09:44:08
-->
<template>
  <!-- <div class="count">props： {{ props.count }}</div> -->
  <div id="bigsceen-sj-map"></div>
</template>
<script setup lang="ts" name="LjsnMap">
// import publicMethod from '@/common/gis/js/map-public-method.js';
import CesiumMethod from '@/common/gis/js/cesium-method.js';

import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
// ref
const route = useRoute(); // 组合式 API
console.log(route, 'route');
// const count1 = ref<number>(9);
// const props = withDefaults(
//   defineProps<{ count?: number | boolean; title?: string }>(),
//   {
//     count: 666,
//     title: 'xxx'
//   }
// );
/**
 * @Descripttion: 加载重庆外的天地图
 * @return {*}
 */
const addTdtOutsideCQ = function async() {
  const option = {
    // url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/f9bb1fb0-558a-490f-8e58-86021fc5146a/0e99665d-94b7-45bc-a912-2a06010ed291/WebTileLayer/tile/{TileMatrix}/{TileCol}/{TileRow}'
    url: [
      'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/458b1ef2-d73d-4c3e-b86c-78bb172e6af7/d32c93a5-8d53-47e2-b76c-6ee1963e2412/WebTileLayer/tile/{TileMatrix}/{TileCol}/{TileRow}',
      'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/52caa987-8fdb-4fd1-b65d-2845aa9fdfb4/1c9e55cf-5473-46f4-acd5-58d7d510b8ea/WebTileLayer/tile/{TileMatrix}/{TileCol}/{TileRow}'
    ]
  };
  window.SJCesiumMethod.loadTDTImageryLayer(option);
};
/**
 * @Descripttion:  大屏撒点
 * @param {*} label
 * @return {*}
 */
const addSJSignLayers = function (label) {
  console.log(label, 'label');
  // if (label === '⼩时降⽔实况') label = '降水实况'
  // debugger
  const urls = {
    网格员: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/e242a1cb-caf5-4650-8e45-ffabe230c2dc/eb0e7d4c-6226-4455-b2d0-b10f1c25ad16/MapServer',
      layer: ''
    },
    水专题: {
      url: 'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/459abbb5-a81c-4586-9ae2-8329bd14fcfa/cd55c9be-de72-4d30-9aff-2da6c224f2a1/MapServer',
      layer: '124'
    },
    电专题: {
      url: 'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/7caf935d-4de6-4174-816b-ab1ce0044713/6f4f1ac9-c3b4-4e0d-9d12-94ecbc4bfdc3/MapServer',
      layer: '120'
    },
    气专题: {
      url: 'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/d8a06332-969f-4ac9-bb6e-62db0c019f51/c85c6cab-f372-4d10-95f0-6f11b216da2f/MapServer',
      layer: '123'
    },
    桥梁专题: {
      url: 'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/a58d9b97-e39f-44f5-bb2b-2da3a74f7d1f/9b6f86ba-8e96-4b3e-8400-7d25ec86b997/MapServer',
      layer: '100'
    },
    隧道专题: {
      url: 'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/e1d125ff-aae8-4090-bf68-d3f8e557b9de/9457f1e0-e38f-4dff-b416-8e7666933f60/MapServer',
      layer: '102'
    },
    通讯专题: {
      url: 'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/0c564900-3783-408c-8d7d-89bfd4489209/3e1fe5d5-6a85-4b1e-a476-5d9a63de0a3c/MapServer',
      layer: '13'
    },
    轨道专题: {
      url: [
        'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/e8b4a881-3ee6-46f2-a5d7-23763769299f/b1221d2c-2895-44d4-b478-b59ecf378ad6/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/eaa376d1-b787-44f1-9d4d-49cd9b5317e8/f5e79cf9-cb32-48e0-aa1f-ae04dcbfcb55/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/3bcfb0a7-2507-4006-a2b8-17f4ea665e14/1cea545f-c036-465a-b3ba-0a652e3f80a5/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/35c845b5-1b6c-4ff7-a9b4-227e8e6e740a/b6e2351a-597f-40a3-b07c-ac9a3a15359c/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/f9b3d05f-52b7-40d9-bee9-97fa0f5c605d/9b48b945-138d-4d6f-a7cc-e517586cd56e/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/d0678ed4-f17d-4c2d-973d-2bd0ce8d87ae/86b721a0-c3e7-4553-aec0-609e43ef1765/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/95689fff-7512-45d5-8fac-547fc4bb83f5/0289b889-60a2-430b-9339-ecef14edefed/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/6213da5b-5480-4f78-956d-384dda5dbcb7/1ab334d8-3063-4b6a-be2d-bfefadd90dcc/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/a9ad0efa-dd2e-4fc9-8eeb-bad3faa91f48/ca40a5c3-a9cd-4914-96a6-7fad7face547/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/7c299ca0-ee54-4380-98a4-02d5a856337d/85b98750-fd7c-4ea0-b3c2-3854aa722753/MapServer'
      ],
      layer: ['84', '85', '86', '87', '88', '89', '90', '91', '92', '93']
    },
    一标三实: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/d73dac2f-f2e2-4316-ab53-a8f649fc55ab/a97183b4-916e-4971-82a8-7d41eaa94d2b/MapServer',
      layer: ''
    },
    易涝点: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/c2a5fade-1a55-4bf3-9655-edb49b778129/fce35059-5c37-41e4-97c1-372d658311ec/MapServer',
      layer: ''
    },
    防洪薄弱点: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/a381b4d7-3770-4ce4-b636-24dd46413f2b/553d20f9-3bfa-4b6b-8558-2eb6574e28fe/MapServer',
      layer: '',
      layerName: '重点防洪薄弱风险点风险名录'
    },
    山洪风险点: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/744f122d-8b72-4dbc-a181-4c7efc7c4da3/81f6be1e-7021-485a-b365-86e21c80234b/MapServer',
      layer: ''
    },
    危岩地灾: {
      url: [
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/234afb69-7516-4bdd-907e-60aa4cf97334/aa7cc763-b631-47b3-b76a-719d78a2442b/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/92b8666e-74e3-4ab2-9e52-adb9fd3fa769/765e3c63-06b9-4fd6-8787-13d97862952f/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/7733f1bf-245f-489e-9e0f-ca3249bb7713/1ace0ef5-9048-42c0-b4fd-f7e48f2f02ae/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/2c43985e-83f8-428d-8e04-23c03fe14971/e2d0b971-039d-47a0-a69e-26c78041dbbe/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/6cb86366-0ea1-4fda-9d1b-3108e74bcc6f/6034295c-e52b-471c-8799-7a7d1c7ae98c/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/9b0e9af3-1c01-41be-9293-cf87f45b0112/38df7b95-ba49-4de5-8c20-c9aa5f52f4b2/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/86b2f321-e640-4d09-806e-246c82121bca/96bba310-676b-4a54-932e-a585f19c64b0/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/0f7dba3d-e7f5-46f3-aefc-ce822211747a/58c15042-637a-4ecd-a10d-c9cb33b940d3/MapServer'
      ],
      layer: ['5', '1', '0', '6', '3', '2', '4', '0']
    },
    轨道站出入口: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/38530d09-e80b-4f20-adc2-29daf6ea947b/f114068e-067d-440a-a5dd-95255c108d57/MapServer',
      layer: '95'
    },
    轨道站: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/96f25181-de9a-4591-845b-c86079b3e0c1/e2b5c05a-b3b3-405d-b715-de7d043ea6f7/MapServer',
      layer: '94'
    },
    区划边界: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/2c0723f7-dbde-4179-9cb5-37135c772e04/91f6b690-94b4-440e-a811-31e78b2e5cec/MapServer',
      layer: '55'
    },
    轨道: {
      url: [
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/0b221e00-4864-4f20-a9c3-234cb9733af6/b1221d2c-2895-44d4-b478-b59ecf378ad6/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/04fcbfce-93d6-4d09-a064-95da98601568/f5e79cf9-cb32-48e0-aa1f-ae04dcbfcb55/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/fcec0fc4-6355-4c60-944d-af5514e6807a/1cea545f-c036-465a-b3ba-0a652e3f80a5/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/ca4074fe-0488-4e25-b41f-b5ce397c0c63/b6e2351a-597f-40a3-b07c-ac9a3a15359c/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/e9c483a2-70d1-49d4-89b2-a3762adbdc8c/9b48b945-138d-4d6f-a7cc-e517586cd56e/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/8facf156-5847-4cd9-ad8e-82373df6ba57/0289b889-60a2-430b-9339-ecef14edefed/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/86589a2e-1e38-416d-8e8b-8791ad712587/1ab334d8-3063-4b6a-be2d-bfefadd90dcc/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/dfc68734-feac-4c63-ab19-b5097a063092/ca40a5c3-a9cd-4914-96a6-7fad7face547/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/1422063e-3108-4642-8c04-2ba4846eb62c/85b98750-fd7c-4ea0-b3c2-3854aa722753/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/3b14bc24-5266-4c2e-a8d2-32c86f2c0e71/86b721a0-c3e7-4553-aec0-609e43ef1765/MapServer',
        'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/96f25181-de9a-4591-845b-c86079b3e0c1/e2b5c05a-b3b3-405d-b715-de7d043ea6f7/MapServer'
      ],
      layer: ['84', '85', '86', '87', '88', '90', '91', '92', '93', '89', '94']
    },
    // 物联感知: {
    //   url: [
    //     'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/c5e344e4-e808-49cf-aeb6-7af7536b88aa/13333800-315d-4d10-9ac9-d50c4d13e293/MapServer',
    //     'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/c5e344e4-e808-49cf-aeb6-7af7536b88aa/13333800-315d-4d10-9ac9-d50c4d13e293/MapServer'
    //   ],
    //   layer: ['2', '3']
    // },
    应急避难场所: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/ffb768e3-b7bb-442a-a964-b8713e411ef9/e830cc58-e3fb-49f7-af02-788c518f50ec/MapServer',
      layer: ''
    },
    水库: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/4356bdb2-64fd-40c5-aff4-940ae292c683/81b1d1fd-8087-4224-acca-82e02cf45ebd/MapServer',
      layer: ''
    },
    水质监测风险点: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/28569a9a-eae3-4865-8750-f64cd796830e/4ddbee63-5500-401e-b449-7b3e77c546f2/MapServer',
      layer: ''
    },
    物联感知: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/2b0015a7-8148-419b-b934-a2067d09958e/13333800-315d-4d10-9ac9-d50c4d13e293/MapServer',
      layer: ''
    },
    // 城市内涝点周边感知设备: {
    //   url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/2b0015a7-8148-419b-b934-a2067d09958e/13333800-315d-4d10-9ac9-d50c4d13e293/MapServer',
    //   layer: ''
    // },
    城市内涝点: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/e8d5d4aa-503d-4ee1-a37b-87fb53c3286c/871215ff-ade1-4021-beac-3e4e0ef9d570/MapServer',
      layer: ''
    },
    应急救援队伍: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/459693c1-fbb9-475a-ac6e-8874f9124bb1/a87fcec0-adea-434b-b19c-9ac8fb4e75cb/MapServer',
      layer: ''
    },
    人员密集场所: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/3aa01353-6689-44b8-a27f-c50f9ac5b5c6/97f66d20-b3aa-4036-86f0-5718d4f51e46/MapServer',
      layer: ''
    },
    学校: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/35c5fa49-30f8-4546-abb4-81fec62c42de/ed61c06c-f1b3-4d8a-a1ac-b2b0d1e333d7/MapServer',
      layer: ''
    },
    气象站点: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/c9a2e70e-159b-4308-bfb1-790ea5db2f38/f85b3d5c-a7ec-45e4-a012-0e08ed9745b3/MapServer',
      layer: ''
    },
    水文站: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/89910b23-881d-4aba-96f6-b996bcb1f45e/9810c540-5674-42bc-9d14-6e7b25c08ce8/MapServer',
      layer: ''
    },
    强降雨灾害轨道交通风险点: {
      url: 'http://23.36.2.111/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/fbdee800-f131-4028-95dc-91b47c02c19c/fc3ac9b1-7a44-4d9c-a1f2-5eecb2225954/MapServer',
      layer: ''
    }

    // 降水实况: {
    //   url: 'http://23.99.113.45:9019/geoserver/wms',
    //   layers: 'met:station_live_pre_hour',
    //   viewparams: 'valid:1;t:2024-02-23 01:00:00',
    //   type: 'WMS'
    // }
  };
  const option = {
    ArcGisLayer: urls[label].url,
    layers: urls[label].layer,
    label
    // type: urls[label].type ? urls[label].type : ''
    // 水厂
    // 3号线
    // 'http://23.36.2.111/multApp/datamanager/service/f38e5ec3-4a36-42c2-a69b-aaf51e61fb62/3bcfb0a7-2507-4006-a2b8-17f4ea665e14/1cea545f-c036-465a-b3ba-0a652e3f80a5/MapServer'
  };

  const callBack = {
    clickCallBack: (data) => {
      // debugger
      // let _t = this.t
      // this.t++
      // console.log(data,'重点防洪薄弱风险点风险名录')
      if (data.name !== 'biankuang') {
        data.modalTitle = data.name + '信息';
        // this.$bus.$emit('openArcgisModal', data)
        if (
          [
            '水厂',
            '变电站',
            '天然气储配站',
            '渝中区设备点位',
            '桥梁',
            '隧道',
            '轨道1号线',
            '轨道2号线',
            '轨道3号线',
            '轨道4号线',
            '轨道5号线',
            '轨道6号线',
            '轨道7号线',
            '轨道8号线',
            '轨道9号线',
            '轨道10号线',
            '轨道环线',
            '轨道江跳线'
          ].includes(data.name)
        ) {
          // this.$refs.modal1.openModal(data);
        } else {
          // this.handleCallback(data);
        }
      }
      // console.log(data, 'callBackdata')

      // window.SJCesiumMethod.viewerChange(coordinate)
    },
    mousemoveCallBack: (data) => {
      console.log('移入', data);
    },
    mouseoutCallBack: (data) => {
      console.log('移出', data);
    }
  };
  window.SJCesiumMethod.loadArcgisImageryLayer(option, callBack);
};
/**
 * @Descripttion: 初始化地图相机位置
 * @return {*}
 */
const initCesiumMap = function () {
  const initMapData = {
    lon: '108.101',
    lat: '30.308',
    height: '912115',
    heading: '6.283185307179586',
    pitch: '-1.5000626030107767',
    roll: '6.283185307179586'
  };
  // console.log(initMapData, JSON.parse(initMapData), 'initMapData');
  // const data = JSON.parse(initMapData);
  // 提升高度
  // data.height = data.height * 6
  window.SJCesiumMethod.viewerChange1(initMapData);
  // clearTimeout(tt)
  // }, 3000);
};
/**
 * @Descripttion: 加载市级三维地形影像地图
 * @param isWarning 强降雨大屏的
 * @param isRepeat 是否重复
 * @return {*}
 */
const initCesiumMapCQ = function async() {
  // window.CesiumTool = new CesiumTool();
  // window.CesiumToolBusiness = new CesiumToolBusiness();
  // if (
  //   window.SJCesiumMethod &&
  //   window.SJCesiumMethod.imageryLayers.length > 0 &&
  //   !isRepeat
  // ) {
  //   return;
  // }
  // if (!window.SJCesiumMethod) {
  window.SJCesiumMethod = new CesiumMethod();
  window.SJCesiumMethod.initMap('bigsceen-sj-map');
  // } else {
  try {
    addTdtOutsideCQ();
  } catch (error) {
    console.log(error, 'error');
  }

  // if (this.$route.name === 'torrentialRain') {
  // 加载市级
  window.SJCesiumMethod.initCesiumMap('500000');
  // 水桥模型
  window.SJCesiumMethod.addWaterAndBridge();
  // 加载三维模型
  window.SJCesiumMethod.initCesiumMap('500103', false); // 渝中
  window.SJCesiumMethod.initCesiumMap('500112', false); // 渝北
  window.SJCesiumMethod.initCesiumMap('500107', false); // 九龙坡区
  window.SJCesiumMethod.initCesiumMap('500106', false); // 沙坪坝
  window.SJCesiumMethod.initCesiumMap('500108', false); // 南岸区
  window.SJCesiumMethod.initCesiumMap('500105', false); // 江北
  // }
  // else if (this.$route.name === 'welcome') {
  //   // 城运中心
  //   // 加载市级
  //   window.SJCesiumMethod.initCesiumMap('500000', true, 'cityCenter');
  //   // 水桥模型
  //   // window.SJCesiumMethod.addWaterAndBridge(
  //   //   '583920561836101',
  //   //   'cityCenter'
  //   // )
  //   // 编码修改
  //   window.SJCesiumMethod.addWaterAndBridge('622141134573637', 'cityCenter');
  //   // window.SJCesiumMethod.addWaterAndBridge(
  //   //   '583918747119685',
  //   //   'cityCenter'
  //   // ) // 江北
  //   window.SJCesiumMethod.initCesiumMapByQx('500105', false, 'cityCenter'); // 江北
  //   window.SJCesiumMethod.initCesiumMapByQx('500103', false, 'cityCenter'); // 渝中
  //   window.SJCesiumMethod.initCesiumMapByQx('500112', false, 'cityCenter'); // 渝北
  //   window.SJCesiumMethod.initCesiumMapByQx('500107', false, 'cityCenter'); // 九龙坡区
  //   window.SJCesiumMethod.initCesiumMapByQx('500106', false, 'cityCenter'); // 沙坪坝
  //   window.SJCesiumMethod.initCesiumMapByQx('500108', false, 'cityCenter'); // 南岸区
  // }

  setTimeout(() => {
    // window.SJCesiumMethod.Add3DScene(option1)
    addSJSignLayers('区划边界');
  }, 200);
  // 修改初始定位
  const tomer11 = setTimeout(() => {
    initCesiumMap();
    clearTimeout(tomer11);
  }, 700);

  // 开启监听
  window.SJCesiumMethod.addMapListenr();
};

onMounted(() => {
  // console.log(count1.value);
  initCesiumMapCQ();
});
</script>

<style lang="scss">
#bigsceen-sj-map {
  width: 100rem;
  height: 100rem;
}
</style>
