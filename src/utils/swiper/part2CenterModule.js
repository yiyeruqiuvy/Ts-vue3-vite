import { runCurvePlaneCircular } from './CurvePlaneCircular'
import { runUtil } from './Util'
import { fun_forAppToScheduing } from './forPadToScheduing'
/**
 *
 * @type {{}}
 */
let part2CenterModule = {
  switchInterval: 10000,

  /**
   * @method 初始化
   * @param param
   */
  init: function (param) {
    let $0 = $('#m-card')
    let $1 = $('#e-card')
    $0.show()
    $1.hide()
    this.$pics = [$0, $1]
    this.currentPictureIndex = 0
    part2CenterModule.mountData()
    // part2CenterData.queryData(param, this.success);
  },
  // /**
  //  * @method 成功回调
  //  */
  // success: function (dataMap) {
  //     part2CenterModule.mountData(dataMap);
  // },

  /**
   * @method 绑定数据
   * @param dataList 数据
   */
  mountData: function (dataMap) {
    var self = this
    // console.log(dataMap)
    // let jumpIndexs = [2, 4];//不进位数据位置
    // let prefix = '<span>';
    // let htmls = ['人</span>', '%', '次</span>', '人</span>', '%', '次</span>', '笔</span>', '元</span>', '次</span>', '次</span>'];
    // let dataLength = Object.keys(dataMap).length;
    // for (let i = 1; i <= dataLength; i++) {
    //     let keyStr = "value" + i;
    //     let value = dataMap[keyStr];
    //     let valueObj;
    //     if (jumpIndexs.indexOf(i - 1) < 0) {
    //         valueObj = echartsTools.getUnitObjWithNumber(value);
    //         $("#tab-value" + i).html(valueObj.value + prefix + valueObj.dw + htmls[i - 1]);
    //     } else {
    //         $("#tab-value" + i).html(value + htmls[i - 1]);
    //     }
    //     console.log(valueObj)

    // }
    this.renderThreeD()

    // 轮播展示图片
    // this.resettableInterval = new runUtil().ResettableInterval(function () {
    //   self.switchPicture(1 - self.currentPictureIndex)
    // }, this.switchInterval)
  },

  renderThreeD: function () {
    var divs = [
      document.getElementById('tab1'),
      document.getElementById('tab2'),
      document.getElementById('tab3'),
      document.getElementById('tab4'),
    ]

    const CurvePlaneCircular = runCurvePlaneCircular()

    this.componentCurvePlaneCircular = new CurvePlaneCircular({
      pid: 'threeD-box',
      stateUpdated: function (newState) {
        fun_forAppToScheduing({
          funName:
            'part2CenterModule.componentCurvePlaneCircular.updateStateTo',
          params: [newState],
        })
      },
      imgWidth: 48, // 每个图片的宽度
      imgHeight: 48, // 每个图片的高度
      percentage: 0.54, // 1 - percentage为一个图片两边的间隙占圆弧的比例
      // 最好关闭echarts，highcharts的初始动画，否则这里需要设置一个毫秒数延迟，等待动画结束才开始截取其图片，否则图片有问题
      waitForAnimationTime: 0, // 转换dom元素为图片前的等待时间
      cameraPosition: {
        // 摄像机的三维坐标
        x: 0,
        y: 50,
        z: 253,
      },
      planeY: -40, // 底部轮播圆盘的Y轴坐标
      deltaAngle: 0.02, // 转动速度
      doms: [],
      // 依次放到场景中的div数组，个数可以为2个及以上
      divs: divs,
      frontPosition: {
        // 图片移动到前面来的位置
        x: 0,
        y: -150,
        z: 100,
      },
      speedToFront: 3, // 图片移动到前面来的速度
      timeToStayFront: 3000, // 移动到前面后的等待时间
      moveToFront: false, // 为false则只有旋转动画，没有拉到前面来的动画
      enableControls: false, // 是否开启控制器
      addDomMesh: true, // 是否添加一个和dom在相同位置的3D平面，用来挡住dom后面的3D物体，设为false则dom不会遮挡物体
      animationControlButton: {
        enable: true,
        hideNumberButtons: true,
        alwaysShowPlayButton: false,
        top: 363,
        left: 985,
        zIndex: 2,
      },
    })
  },

  switchPicture: function (index, priority) {
    if (priority) {
      this.resettableInterval.reset()
    }
    this.currentPictureIndex = index
    var $pics = this.$pics
    $pics[index].show()
    $pics[1 - index].hide()

    fun_forAppToScheduing({
      funName: 'part2CenterModule.switchPicture',
      params: [index, true],
    })
  },
}
export default part2CenterModule
