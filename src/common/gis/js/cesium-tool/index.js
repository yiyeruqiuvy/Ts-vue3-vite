import { commonUtits, } from '@/scopes/project/bigScreenMapbox/common/utils/tool'

let layerAndOurPointConfig
/**
 * 获取增加图层和撒点的方法配置
 * @return {Promise<void>}
 */
const getConfig = async () => {
  const res = await commonUtits.getUrlPrefix({
    configCode: 'layerAndOurPonit',
  })
  if (res && res.serviceSuccess) {
    const result = res.data.result || {}
    layerAndOurPointConfig = JSON.parse(result.configValue || '{}')
  }
}
getConfig()

/** 
 * 按配置执行方法
 * @param mapOption
 * @param context vue 中调用的上下文 this
 */
const startFn = (mapOption, context) => {
  if (mapOption) {
    if (mapOption.type === 'ownPoint' && mapOption.fun === 'window') {
      window[mapOption.funName] && window[mapOption.funName](mapOption.param)
    } else if (mapOption.type === 'ownPoint' && mapOption.fun === 'emit') {
      context.$bus.emit(mapOption.funName, mapOption.params)
    } else {
      // 添加地图撒点
      window.addLayerWuhy(mapOption)
    }
  }
}
/**
 * 公共 触发 增加图层和撒点方法
 * @param context vue 中调用的上下文 this
 * @param sceneName 匹配操作配置的场景名称
 */
export const addLayerAndOurPoint = (context, sceneName) => {
  const mapOption = layerAndOurPointConfig[sceneName]
  if (Array.isArray(mapOption) && mapOption.length) {
    mapOption.forEach(item => {
      startFn(item, context)
    })
    return
  }
  startFn(mapOption, context)
}

window.addLayerAndOurPoint = addLayerAndOurPoint