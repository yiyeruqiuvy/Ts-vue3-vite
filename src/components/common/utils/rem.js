/*
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-04-10 16:59:08
 * @LastEditTime: 2023-04-10 16:59:09
 * @Description: desc
 * @FilePath: \cqGit\src\scopes\project\bigScreen\common\utils\rem.js
 */

export const computRem = (doc, win, designWidth) => {
  const docEl = doc.documentElement
  const resizeEvt =
    'orientationchange' in window ? 'orientationchange' : 'resize'
  const recalc = function () {
    const clientWidth = docEl.clientWidth
    if (!clientWidth) return
    const size = getUrlParms('fontsize')
    if (size) {
      docEl.style.fontSize = size + 'px'
    } else {
      docEl.style.fontSize = 100 * (clientWidth / designWidth || 1920) + 'px'
    }
    console.log(docEl.style.fontSize)
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  recalc()
}

// ���㷽��;��������������
export const nowSize = (val, initWidth = 1920) => {
  // ��ǰ�ӿڿ���
  const nowClientWidth = document.documentElement.clientWidth
  return val * (nowClientWidth / initWidth) + 2
}
function getUrlParms(name) {
  const href = window.location.href
  const startIndex = href.indexOf(name + '=')
  if (startIndex < 0) {
    return null
  }
  const endIndex = href.indexOf('&', startIndex)
  if (endIndex < 0) {
    return href.substring(startIndex + name.length + 1, href.length)
  } else {
    return href.substring(startIndex + name.length + 1, endIndex)
  }
}
