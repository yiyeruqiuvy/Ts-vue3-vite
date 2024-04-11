/*
 * @Descripttion:
 * @Author: leizq
 * @Date: 2022-08-11 14:13:09
 * @LastEditors: leizq
 * @LastEditTime: 2022-08-12 13:39:56
 */
/**
 * 实现app调度逻辑方法
 *  option.funName string 动态执行事件方法名称
 *  option.params string[] 动态执行事件方法参数
 *  option.iframeIdPath string 子页面路径(相对于各主题页面的父页面为起始，例：各主题父页面--‘’，
 *                                                                  其下一id为iframe1的子页面--‘iframe1’
 *                                                                  若还有子页面--‘iframe1/...’)   非必填
 *  option.type number  类型，默认为520，调用统一方法处理逻辑；若有特例无法统一处理，可以为其他值，单独处理；
 */
export function fun_forAppToScheduing(option) {
  // return 0;
  var winForApp = getParentByType('isForAppToJudge', 'number')
  winForApp = winForApp || {}
  if (winForApp.isForAppToJudge == 2 || winForApp.isForAppToJudge == 4) {
    var frameid = ''
    if (option.iframeIdPath == undefined || option.iframeIdPath == null) {
      option.iframeIdPath = ''
    }
    //判断是否自动获取iframe路径
    if (option.iframeIdPath.indexOf('false/') == 0) {
      frameid = option.iframeIdPath.substr(6)
      option.pathByNotAuto = true
    } else {
      //自动获取该页面
      frameid = app_autoGetIframePath(window, winForApp)
    }
    option.type = option.type || 520
    option.funName = option.funName || ''
    option.params = option.params || []
    option.iframeIdPath = frameid
    var winForMassage = null

    //  调度模块下：主题页面单独打开的情況
    var winOpenMethod = getParentByType('App_ThemeOpenByMd', 'number')
    winOpenMethod = winOpenMethod || {}
    if (winOpenMethod.App_ThemeOpenByMd == 1) {
      return winOpenMethod.SchedulingMessageToIndexForPadPage(option)
    } else {
      if (winForApp.isForAppToJudge == 2) {
        winForMassage = getParentByType('sendEventForAppToPC', 'function')
        if (winForMassage != null) {
          return winForMassage.sendEventForAppToPC(option)
        } else {
          return false
        }
      } else if (winForApp.isForAppToJudge == 4) {
        winForMassage = getParentByType('sendEventForTestToPC', 'function')
        if (winForMassage != null) {
          return winForMassage.sendEventForTestToPC(option)
        } else {
          return false
        }
      }
    }
    return true
  }
  return false
}

/**
 *  循环查找父窗口是否存在对应对象
 * @param objName  对象名称
 * @param type  对象类型
 * @returns {null|Window}
 */
function getParentByType(objName, type) {
  var win = window
  var isFirst = 1
  try {
    do {
      if (isFirst != 1) {
        win = win.parent
      } else {
        isFirst = 0
      }
      if (typeof win[objName] == type) {
        break
      }
    } while (win.parent != win.window)
  } catch (err) {
    return null
  }
  if (typeof win[objName] == type) {
    return win
  } else {
    return null
  }
}
