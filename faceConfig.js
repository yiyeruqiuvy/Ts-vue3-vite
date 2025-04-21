/*
 * @Author: NIXY
 * @LastEditors: peiqf
 * @Date: 2023-04-10 15:33:51
 * @LastEditTime: 2025-04-18 11:36:13
 * @Description: desc
 * @FilePath: \cqGit\faceConfig.js
 */

// 前端所有配置放这里
const faceConfig = () => {
  return {
    // basePath: 'http://23.210.52.54:28081/cockpit/api', // 线上环境
    // basePath: 'http://23.210.52.80:8088/cockpit', // 本地环境
    // basePath: 'http://njvqrz.natappfree.cc/worktableCockpit', // 本地代理
    // basePath: 'http://ugq5nm.natappfree.cc/cockpit', // 本地代理
    basePath: 'http://localhost:8080/cockpit1', // 本地代理
    // basePath: 'http://172.18.57.194:8088/cockpit', // 本地代理
    // basePath: 'http://ymrrwh.natappfree.cc/cockpit', // 本地代理
    // basePath: 'http://172.18.57.84:8081/manage', // 本地代理
    managePath: 'http://localhost:8080/manage', // 管理端 线上 -- 驾驶舱配管端 basePath: 'http://localhost:8080/cockpit1', // 本地代理
    realManagePath: 'http://localhost:8080/realManage', // 管理端 线上 -- 除驾驶舱配管端外的工作台接口
    openPath: 'http://172.18.57.127:8090/outCockpit/out/cockpit/event', // 提供给风险一张图使用的事件单详情接口
    disPath: 'http://23.210.52.54:28081/dispatch', // 指挥调度的服务IP 测试环境
    taskPath: 'http://23.210.52.80:18081/taskcenter/api', // 任务服务的互联网IP配置
    exchangePath: 'http://23.210.52.80:18081/exchange',
    filePath: 'http://23.210.52.80:18081/cockpit/api/common/attachmentFile/previewFileAuth/', // 文件服务器IP --- 驾驶舱
    downLoadFilePath: 'http://23.210.52.80:18081/cockpit/api/common/attachmentFile/downloadFileAuth/', // word文件预览调用此地址 --- 驾驶舱
    configFilePath: 'http://23.210.52.80:18081/worktableCockpit/common/attachmentFile/previewFileAuth/', // 文件服务器IP --- 驾驶舱配管功能
    configDownLoadFilePath: 'http://23.210.52.80:18081/worktableCockpit/common/attachmentFile/downloadFileAuth/', // word文件预览调用此地址 --- 驾驶舱配管功能
    irs: 'http://zlzx.bigdatacq.com:18081',
    wsPath: 'ws://23.210.52.80:18081/dispatch',
    taskUrl: 'http://23.210.52.80:18081/taskcenter/api',

    // 通用字段变量
    staticLabel: '事件单',
    // 上传文件大小配置
    maxFileSize: 10,
    // 智能能力开关
    intellAbility: true,
    // 首页数据配置
    indexPageConfig: {
      // menuType 菜单样式（leftTop, left, top, simple, workTable）
      menuType: 'left',
      // 左侧菜单显示方式(sliding：侧滑, dropdown：手风琴)
      menuLeftStyle: 'dropdown',
      // 菜单是手风琴时默认是否展开2级菜单,默认不展开
      dropdownOpenMenu: false,
      // 顶部头的高度
      headerHeight: '64px',
      // 顶部头的颜色样式 (base:主题色,light:简洁白)
      headerTheme: 'base',
      // 左侧的颜色样式 (base:主题色,light:简洁白,dark:暗夜黑)
      leftTheme: 'base',
      // 左侧菜单的宽度
      leftWidth: '240px',
      // logo框的宽度（菜单为top时有效，其余logo框宽度等于左侧菜单宽度）
      logoWidth: '240px',
      // 首页左侧菜单收起的时候的宽度（建议不小于30px）
      leftCloseWidth: '50px',
      // 顶部菜单下方条状样式（breadcrumb：面包屑, tab：显示所有tab）
      barType: 'tab',
      // logo 文字
      logoTitle: 'Ta+3 404开发平台',
      // logo 图片名称，如logo.png （注意：请将图片放在 src/corePage/index/img 路径下）
      logoImage: 'logo.png',
      // 不显示pageTool工具箱的页面（如：['orguser.html']）
      notPageTool: ['worktable', 'roleWorktableTemplateModify'],
      //
      /** closeTabCallBackModules: 需要关闭之前使用回调的模块()
       * id: 需要关闭之前回调的模块的id(有id以id为准,没有id以url为准)
       * url:需要关闭之前回调的模块的url
       * prefix:需要关闭之前回调模块的url前缀(非必须)
       * 例如: closeTabCallBackModules:[{url:'orguser.html#/orgManagement',id:'1e706f26bc144c1da12022359c238053'}],
       * **/
      closeTabCallBackModules: [],
      /**
       * ======================================
       *   重要：由于新版工作台使用了一个布局组件，
       *        但该组件不支持IE9，所以如果需要支
       *        持IE9的话需要自己开发工作台，必须
       *        使用faceConfig.js文件中的自定义
       *        工作台页面进行替换，否则在IE9浏览
       *        器下登录进入后工作台打不开，IE其
       *        他版本(IE10、IE11)及其他浏览器
       *        没有影响
       * ======================================
       */
      // 自定义工作台页面，默认页面为workTablePage.html，文字为'工作台'。注：若自定义页面，需在功能资源管理中放开该页面的权限
      worktable: {
        name: '',
        module: 'workTablePage.html', // 模块
        part: 'page', // 路由路径
        prefix: '',
      },
      // html资源获取地址,一般情况下为本系统不需要配置
      srcPrefix: '',
    },
    // 前后端交互参数配置
    resDataConfig: {
      serviceSuccess: 'serviceSuccess', // 服务是否成功回调
      serviceSuccessRule: true, // 服务调用成功规则，设置serviceSuccess为成功时的标志，默认为boolean类型true，也可以设置数字或者字符串类型
      errors: 'errors', // 错误信息 包含错误消息
      message: 'message', // 简单错误信息,如果也有error,那么也会执行error的处理
      redirectUrl: 'redirectUrl', // 重定向地址
      submitParameter: {
        errorMsgTime: 1,
      }, // 默认提交参数
      frontUrl: null, //  取值 null 框架默认, 单点统一平台的话需要配置成portal
      collectionUrl: 'codetable/getCode', // 获取单个码表的url
      collectionUrlList: 'codetable/getCodeBatch', // 获取码表List的url
      cryptoCfg: {
        // 加密配置
        reqDataLevel: 0, //  加密级别 faceConfig.resDataConfig.reqDataLevel的配置 < 后端配置 < submit提交参数配置
      },
    },
    // 是否启用在线换肤/dark-mode
    onlineTheme: process.env.VUE_APP_ONLINE_THEME === 'true',
    // 页面默认主题：用于编译时的默认主题及在线换肤时的默认值处理
    defaultTheme: process.env.VUE_APP_DEFAULT_ONLINE_THEME,
    // 是否启用暗黑模式
    defaultDarkMode: process.env.VUE_APP_DARK_MODE === 'true',
    // 默认语言配置 简体中文zh_CN,英语en_US
    defaultLocale: process.env.VUE_APP_DEFAULT_LOCALE,
  }
}
module.exports = faceConfig()
// debugger
if (typeof window !== 'undefined') {
  const faceConfig = module.exports
  window.faceConfig = faceConfig
  console.log(process.env, 'wwwwwwwwwwwww')
  if (process.env.NODE_ENV === 'production') {
    // 根据开发环境还是正式环境，配置接口
    const path = window.location.href.split('/')

    // path[0] http:
    // path[1] null
    // path[2] 23.210.52.54:18081
    // path[3] cockpit

    // prefixPath http://23.210.52.54:18081
    // prefixPathAll http://23.210.52.54:18081/cockpit

    const prefixPath = path[0] + '//' + path[2]
    // 带上下文的地址
    let prefixPathAll = path[0] + '//' + path[2]
    // 当带.则说明是xxx.html则说明没有上下文,否则应该拼接上下文
    if (path[3] && !path[3].includes('.')) {
      prefixPathAll = prefixPathAll + '/' + path[3]
    }
    const basePath = prefixPathAll + '/api'
    const filePath = prefixPathAll + '/api/common/attachmentFile/previewFileAuth/'
    const downLoadFilePath =
      prefixPathAll + '/api/common/attachmentFile/downloadFileAuth/'
    // 驾驶舱配管功能的文件下载地址和预览地址：configFilePath、configDownLoadFilePath
    let configFilePath = prefixPath + '/worktableCockpit/common/attachmentFile/previewFileAuth/'
    let configDownLoadFilePath =
      prefixPath + '/worktableCockpit/common/attachmentFile/downloadFileAuth/'
    let managePath
    let realManagePath
    let disPath
    let wsPath

    managePath = prefixPath + '/worktableCockpit'
    realManagePath = prefixPath + '/manage'
    // 重定cockpitconfig上下文的后端地址
    if (path[3] === 'cockpitconfig') {
      // basePath = prefixPath + '/manageconfig'
      managePath = prefixPath + '/manageconfig'
      realManagePath = prefixPath + '/manageconfig'
      configFilePath = prefixPath + '/manageconfig/common/attachmentFile/previewFileAuth/'
      configDownLoadFilePath =
        prefixPath + '/manageconfig/common/attachmentFile/downloadFileAuth/'
    }
    // 重定指挥调度上下文 -- 预发才有dispatchwide
    if (path[3] === 'cockpitwide' && path[2].indexOf('28081') > -1) {
      disPath = prefixPath + '/dispatchwide'
      wsPath = 'ws://' + path[2] + '/dispatchwide'
    } else {
      disPath = prefixPath + '/dispatch'
      wsPath = 'ws://' + path[2] + '/dispatch'
    }
    const exchangePath = prefixPath + '/exchange'
    const taskPath = prefixPath + '/taskcenter/api'
    const irs = prefixPath
    const taskUrl = prefixPath + '/taskcenter/api'
    const openPath = prefixPath + '/cockpit/open/api/out/cockpit/event'

    faceConfig.basePath = basePath
    faceConfig.exchangePath = exchangePath
    faceConfig.filePath = filePath
    faceConfig.downLoadFilePath = downLoadFilePath
    faceConfig.disPath = disPath
    faceConfig.taskPath = taskPath
    faceConfig.wsPath = wsPath
    faceConfig.irs = irs
    faceConfig.taskUrl = taskUrl
    faceConfig.openPath = openPath
    faceConfig.managePath = managePath
    faceConfig.realManagePath = realManagePath
    faceConfig.configFilePath = configFilePath
    faceConfig.configDownLoadFilePath = configDownLoadFilePath
  }
}
