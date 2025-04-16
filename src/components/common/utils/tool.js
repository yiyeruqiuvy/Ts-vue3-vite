/*
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-04-10 17:11:29
 * @LastEditTime: 2023-04-10 17:11:37
 * @Description: desc
 * @FilePath: \cqGit\src\scopes\project\bigScreen\common\utils\utils.js
 */
// 检验身份证时推荐使用isIdCardNo方法进行验证（使用此方法校验510104201811076116身份证号时提示校验不通过）
const commonUtits = {
  isEmpty(val) {
    if (val === '' || val === undefined || val === null) {
      return true
    }
    return false
  },
  /**
   * 格式化日期
   * @param date
   * @param format
   */
  getFormatDate(date, format) {
    const o = {
      M: date.getMonth() + 1, // 月份
      d: date.getDate(), // 日
      h: date.getHours(), // 小时
      m: date.getMinutes(), // 分
      s: date.getSeconds(), // 秒
      q: Math.floor((date.getMonth() + 3) / 3) // 季度
    }
    if (/(y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    for (const k in o) {
      if (new RegExp('(' + k + '+)').test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return format
  },
  /**
   * 验证是否为18位或者15位身份证号码
   * @param value
   * @returns {boolean}
   * @modify 2020/11/25 wangjh
   */
  isIdCardNo: function (value) {
    const city = {
      11: '北京',
      12: '天津',
      13: '河北',
      14: '山西',
      15: '内蒙古',
      21: '辽宁',
      22: '吉林',
      23: '黑龙江 ',
      31: '上海',
      32: '江苏',
      33: '浙江',
      34: '安徽',
      35: '福建',
      36: '江西',
      37: '山东',
      41: '河南',
      42: '湖北',
      43: '湖南',
      44: '广东',
      45: '广西',
      46: '海南',
      50: '重庆',
      51: '四川',
      52: '贵州',
      53: '云南',
      54: '西藏 ',
      61: '陕西',
      62: '甘肃',
      63: '青海',
      64: '宁夏',
      65: '新疆',
      71: '台湾',
      81: '香港',
      82: '澳门',
      91: '国外'
    }
    let pass = true
    if (
      !value ||
      !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
        value
      )
    ) {
      pass = false
    } else if (!city[value.substr(0, 2)]) {
      pass = false
    } else {
      // 18位身份证需要验证最后一位校验位
      if (value.length === 18) {
        const valueArr = value.split('')
        // ∑(ai×Wi)(mod 11)
        // 加权因子
        const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        // 校验位
        const parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
        let sum = 0
        let ai = 0
        let wi = 0
        for (let i = 0; i < 17; i++) {
          ai = valueArr[i]
          wi = factor[i]
          sum += ai * wi
        }
        // 最后一位不区分大小写
        if (valueArr[17] === 'x') {
          valueArr[17] = valueArr[17].toUpperCase()
        }
        if (parity[sum % 11] !== valueArr[17]) {
          pass = false
        }
      }
    }
    return pass
  },
  /**
   * 社会信用代码
   * @param rule
   * @param value
   * @param callback
   */
  fnSocialCreditCode(rule, value, callback) {
    if (!value) {
      callback()
      return
    }
    const pa = /^[1-9ABCDEFGY][1239][0-9]{6}[0-9A-Z]{9}[0-9A-Z]$/
    const wi = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28]
    const zi = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      A: 10,
      B: 11,
      C: 12,
      D: 13,
      E: 14,
      F: 15,
      G: 16,
      H: 17,
      J: 18,
      K: 19,
      L: 20,
      M: 21,
      N: 22,
      P: 23,
      Q: 24,
      R: 25,
      T: 26,
      U: 27,
      W: 28,
      X: 29,
      Y: 30
    }
    const ziArr = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'J',
      'K',
      'L',
      'M',
      'N',
      'P',
      'Q',
      'R',
      'T',
      'U',
      'W',
      'X',
      'Y'
    ]
    if (value && value !== '' && !pa.test(value)) {
      callback('统一社会信用代码格式错误')
      return
    }
    const arr = value.toUpperCase().split('')
    let sum = 0
    for (let i = 0; i < arr.length - 1; i++) {
      sum += wi[i] * zi[arr[i]]
    }
    const res = 31 - (sum % 31)
    if (arr[17] !== ziArr[res]) {
      callback('统一社会信用代码格式错误')
    } else {
      callback()
    }
  },
  /**
   * 修改后的 社会信用代码 只是验证长度是小于或者等于18位的数字和字母组成的内容
   * @param rule 验证规则
   * @param value  输入的值
   * @param callback  错误的处理函数
   */
  socialCreditCode(rule, value, callback) {
    if (!value) {
      callback()
      return
    }
    const reg = /^[a-zA-Z0-9]{0,18}$/
    if (value && value !== '' && !reg.test(value)) {
      callback('统一社会信用代码格式错误')
      return
    }
    callback()
  },
  /**
   * 身份证验证 + 校验位
   * @param rule
   * @param value
   * @param callback
   */
  // 推荐使用isIdCardNo方法进行验证（使用此方法校验510104201811076116身份证号时提示校验不通过）
  checkIdcard(idcard) {
    const area = {
      11: '11',
      12: '12',
      13: '13',
      14: '14',
      15: '15',
      21: '21',
      22: '22',
      23: '23',
      31: '31',
      32: '32',
      33: '33',
      34: '34',
      35: '35',
      36: '36',
      37: '37',
      41: '41',
      42: '42',
      43: '43',
      44: '44',
      45: '45',
      46: '46',
      50: '50',
      51: '51',
      52: '52',
      53: '53',
      54: '54',
      61: '61',
      62: '62',
      63: '63',
      64: '64',
      65: '65',
      71: '71',
      81: '81',
      82: '82',
      91: '91'
    }
    var idcard, Y, JYM
    let S, M
    let idcard_array = new Array()
    idcard_array = idcard.split('')
    let ereg = null
    if (area[parseInt(idcard.substr(0, 2))] == null) {
      return false
    }
    switch (idcard.length) {
      case 15:
        if (
          (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 ||
          ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 &&
            (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)
        ) {
          ereg =
            /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/
        } else {
          ereg =
            /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/
        }
        if (ereg.test(idcard)) {
          return true
        } else {
          return false
        }
      case 18:
        if (
          parseInt(idcard.substr(6, 4)) % 4 == 0 ||
          (parseInt(idcard.substr(6, 4)) % 100 == 0 &&
            parseInt(idcard.substr(6, 4)) % 4 == 0)
        ) {
          ereg =
            /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/
        } else {
          ereg =
            /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/
        }
        if (ereg.test(idcard)) {
          S =
            (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 +
            (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 +
            (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 +
            (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 +
            (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 +
            (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 +
            (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 +
            parseInt(idcard_array[7]) * 1 +
            parseInt(idcard_array[8]) * 6 +
            parseInt(idcard_array[9]) * 3
          Y = S % 11
          M = 'F'
          JYM = '10X98765432'
          M = JYM.substr(Y, 1)
          if (M == idcard_array[17]) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      default:
        return false
    }
  },
  /**
   * 验证手机号的正则  这是把所有运营商号段写在一起的，包括虚拟运营商（16开头）、物联网等
   * @param value
   * @returns {boolean}
   * 13和18开头的手机号是全段
   * 14开头的手机号除2,3外都有，无142..和143..
   * 15和19开头的手机号后面除4外都有
   * 16开头的手机号后面只有2567
   * 17开头的手机号后面除9外都有
   */
  isMobileNo: function (value) {
    const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
    if (reg.test(value)) {
      return true
    }
    return false
  },
  /**
   * 正则验证是否为手机号码：11位
   */
  isMobileNoReg: /^[1][3,4,5,7,8,9][0-9]{9}$/,
  /**
   * 验证是否为邮箱号码
   * @param value
   * @returns {boolean}
   */
  isEmail: function (value) {
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (reg.test(value)) {
      return true
    }
    return false
  },
  /**
   * 验证是否为邮箱号码
   */
  isEmailreg: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  /**
   * 验证是否为座机号码
   * @param value
   * @returns {boolean}
   */
  isTelephoneNO: /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$|(0\d{10})$/,
  /**
   * 组织机构代码验证
   * @param value
   * @returns {boolean}
   */
  isCreditCode: function (value) {
    const reg =
      /^([0-9ABCDEFGHJKLMNPQRTUWXY]{2})([0-9]{6})([0-9ABCDEFGHJKLMNPQRTUWXY]{10})$/
    if (reg.test(value.toUpperCase())) {
      return true
    }
    return false
  },
  /**
   * 统一社会信用代码验证
   * @param value
   * @returns {boolean}
   */
  socialCode: function (value) {
    const reg = /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/
    if (reg.test(value.toUpperCase())) {
      return true
    }
    return false
  },
  /**
   * 验证数字，最多两位小数
   * @param value
   * @returns {String}
   */
  floatFixTwo: function (value) {
    if (!value) {
      return false
    }
    const reg = /^(-?\d+)(\.\d{1,4})?$/
    if (reg.test(value.trim())) {
      return true
    }
    return false
  },
  /**
   * 获取字符串长度，中文2个，英文1个
   * @param str
   * @returns {String}
   */
  getStringLen: function (str) {
    let len = 0
    for (let i = 0; i < str.length; i++) {
      str.charCodeAt(i) > 255 ? (len += 2) : (len += 1)
    }
    return len
  },
  /**
   * 根据id获取当前在tree中的数据项
   */
  getTreeDataById(leafId, nodes, path) {
    if (path === undefined) {
      path = {}
    }
    for (let i = 0; i < nodes.length; i++) {
      let tmpPath = path
      if (leafId === nodes[i].id) {
        tmpPath = nodes[i]
        return tmpPath
      }
      if (nodes[i].children) {
        const findResult = this.getTreeDataById(
          leafId,
          nodes[i].children,
          tmpPath
        )
        if (findResult) {
          return findResult
        }
      }
    }
  },
  /**
   * 人数正则： 提示语：请输入9位以内的整数
   */
  patternNumberPerson: /^(0|[1-9][0-9]{0,8})$/,
  /**
   * 八位人数正则： 提示语：请输入8位以内的整数    (备注：综治视联网中心的专职人员需要的是8位)
   */
  patternNumberEight: /^(0|[1-9][0-9]{0,7})$/,
  /**
   * 六位整数正则： 提示语：请输入6位以内的整数
   */
  patternNumberSix: /^(0|[1-9][0-9]{0,5})$/,
  /**
   * 5位整数正则： 提示语：请输入5位以内的整数
   */
  patternNumberFive: /^(0|[1-9][0-9]{0,4})$/,
  /**
   * 四位整数正则： 提示语：请输入4位以内的整数
   */
  patternNumberFour: /^(0|[1-9][0-9]{0,3})$/,
  /**
   * 3位整数正则： 提示语：请输入3位以内的整数
   */
  patternNumberThree: /^(0|[1-9][0-9]{0,2})$/,
  /**
   * 数字正则
   */
  patternNumber: /^[1-9]\d*$/,
  /**
   * 自然数正则
   */
  patternNumber1: /^[0-9]\d*$/,
  /**
   * 身份证
   */
  idcard:
    /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  /**
   * 金额：最多4个小数点
   */
  patternFloatFixFour: /^(0|([1-9]\d{0,9}))(\.\d{1,4})?$/,
  /**
   * 最多2位小数点： 提示语：请输入0~99.99
   */
  patternFloatTwoTwo: /^(\d{1,2})(\.\d{1,2})?$/,
  /**
   * 最多2位小数点： 提示语：请输入0~9999.99
   */
  patternFloatFourTwo: /^(\d{1,4})(\.\d{1,2})?$/,
  /**
   * 最多2位小数点： 提示语：请输入0~99999999.99
   */
  patternFloatFixTwo: /^(\d{1,8})(\.\d{1,2})?$/,
  /**
   * 最多2位小数点： 提示语：请输入0~999999.99  (备注：综治视联网中心的年度运行经费需要的是不能大于999999.99)
   */
  patternFloatFixTwo1: /^(\d{1,6})(\.\d{1,2})?$/,
  /**
   * 最多2位小数点： 提示语：请输入0~99999999.99  (备注：综治视联网中心的年度运行经费需要的是不能大于99999999.99)
   */
  patternFloatFixTwo2: /^(\d{1,8})(\.\d{1,2})?$/,
  /**
   * 整数数字正则
   */
  patternSixNumber: /^[1-9]\d*$/,
  /**
   * 自然数正则
   */
  patternNatureNumber: /^(([1-9]\d*)|\d)$/,
  /**
   * 能够以0开头的9位自然数正则,提示语：请输入9位以内的自然数
   */
  patternZeroNature: /^([0-9][0-9]{0,8})$/,
  /**
   * 持续年限,提示语: 请输入0~99
   */
  patternYearDuration: /^([1-9]\d|\d)$/,
  /**
   * 中文、英文、数字和英文逗号:关键词
   */
  patternKeyWord: /^[\u4e00-\u9fa5,0-9a-zA-Z]+$/,
  /**
   * 中文、英文和英文逗号:案件涉及人员
   */
  patternPersons: /^[\u4e00-\u9fa5,a-zA-Z]+$/,
  /**
   * 手机号+座机号
   */
  patternContactTel:
    /^(((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$|(0\d{10}))|([1][3,4,5,6,7,8,9][0-9]{9})$/,
  /**
   * 座机号
   */
  patternFax: /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$|(0\d{10})$/,
  /**
   * QQ+邮箱
   * @param value
   * @returns {boolean}
   */
  isEmailAndQq:
    /^([1-9][0-9]{4,14})|([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/,
  /**
   * 根据地址所属区域编码，判断此地址是否为当前登录人所在区域地址
   * @param {*} item 包含地址区域的对象
   */
  getAddressAreaCode: function (item) {
    const user = top.indexTool.getUserInfo()
    const areaLevel = user.areaLevel
    let addressAreaCode = ''
    switch (areaLevel) {
      case '-1': // 国家级
        break
      case '0': // 省级
        addressAreaCode = item.belongProvince
        break
      case '1': // 市级
        addressAreaCode = item.belongCity
        break
      case '2': // 区级
        addressAreaCode = item.belongCounty
        break
      case '3': // 街道级
        addressAreaCode = item.belongStreet
        break
      case '4': // 社区级
        addressAreaCode = item.belongCommunity
        break
      case '5': // 网格
        addressAreaCode = item.belongGrid
        break
      default:
        break
    }
    return addressAreaCode
  },
  /**
   * 身份证最后一位x修改为大写X
   * @param {String} idNumber 身份证号
   */
  toUpperCaseIdcard: function (idNumber) {
    if (idNumber) {
      let strid = idNumber
      const strX = idNumber.charAt(idNumber.length - 1)
      const str = idNumber.slice(0, idNumber.length - 1)
      if (idNumber.length === 18 && strX === 'x') {
        strid = str + idNumber.charAt(idNumber.length - 1).toUpperCase()
      }
      return strid
    }
  },
  /**
   * 得到当前年月日
   */
  currentData: function () {
    const newDatas = new Date()
    let newDatastr = ''
    newDatastr += newDatas.getFullYear() + '年' // 获取当前年份
    newDatastr += newDatas.getMonth() + 1 + '月' // 获取当前月份
    newDatastr += newDatas.getDate() + '日'
    newDatastr += newDatas.getHours() + '时'
    return newDatastr
  },
  /**
   * escapeHtml() 解决把后台返回数据解析到HTML页面上时, 特殊字符无法被识别
   * 注意：\n得配合style="white-space:pre-wrap;"样式才会生效；因为控制台打印出来是换行的；页面上要显示换行，还需要样式
   * @property {String} str 字符
   */
  escapeHtml(str) {
    const arrEntities = {
      lt: '<',
      gt: '>',
      nbsp: ' ',
      amp: '&',
      quot: '"',
      '#xa': ' \n ',
      '#x7e': '~',
      '#x5c': ' ',
      '#x5e': '^',
      '#x60': '`',
      '#x7c': '|',
      mdash: '——',
      hellip: '^',
      '#xff5e': '¥',
      yen: '￥'
    }
    return str.replace(
      /&(lt|gt|nbsp|amp|quot|#xa|#x7e|#x5c|#x5e|#x60|#x7c|mdash|hellip|#xff5e|yen);/gi,
      function (all, t) {
        return arrEntities[t]
      }
    )
  },
  /**
   * 判断是否为车牌号(新能源+非新能源)
   * @param {String} str 车牌号
   * @returns {Boolean}
   */
  isCarNum:
    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
  /**
   * 对象中的数字大小比较，用于排序：从大到小
   * @param {String} prop 对象中的属性
   * @returns Number
   */
  compare(prop) {
    return function (obj1, obj2) {
      let val1 = obj1[prop]
      let val2 = obj2[prop]
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1)
        val2 = Number(val2)
      }
      if (val1 < val2) {
        return 1
      } else if (val1 > val2) {
        return -1
      } else {
        return 0
      }
    }
  },
  /*
   * 地址栏参数转换成对象,并存到本地localStorage
   */
  locationParams2obj() {
    let str = location.href
    str = decodeURIComponent(str)
    if (!str.split('?')[1]) {
      // 如果地址栏没有参数，代表刷新了页面
      return JSON.parse(localStorage.getItem('userInfo'))
    }
    const arr = str.split('?')[1].split('&')
    let res = {}
    arr.forEach(item => {
      const temp = item.split('=')
      res[temp[0]] = temp[1]
    })
    // 第一次进来存到localstorage里面
    localStorage.setItem('userInfo', JSON.stringify(res))
    return res
  },
  /**
   * 防抖函数
   * @param {*} fun
   * @param {*} delay
   * @returns
   */
  debounce(fun, delay) {
    return function (args) {
      let that = this
      let _args = args
      clearTimeout(fun.id)
      fun.id = setTimeout(function () {
        fun.call(that, _args)
      }, delay)
    }
  }
}

export { commonUtits }
