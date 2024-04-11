/**
 * @desc 模板
 * @dependencies
 * @author hejiang
 * @version 1.0.0
 * @date 2020.11.2
 */

import { runClass } from './class'
import { runUtil } from './Util'
import { runDomtoimage } from './dom-to-image'
export function runCurvePlaneCircular(exports) {
  var hiddenElementForPlacingDivsToTransfer
  function addHiddenElement() {
    if (
      !window.document.getElementById('hiddenElementForPlacingDivsToTransfer')
    ) {
      console.log(1111)
      hiddenElementForPlacingDivsToTransfer = $(`
                <div id="hiddenElementForPlacingDivsToTransfer" style="
                position: absolute;
                width: 99999px;
                height: 99999px;
                top: 0px;
                left: -199999px;
                visibility: visible;
                ">
                </div>
                `)[0] // window.document.body is null，在监听DOMContentLoaded事件后，body不再为null
      if (window.document.body) {
        window.document.body.appendChild(hiddenElementForPlacingDivsToTransfer)
      }
    }
  }
  addHiddenElement() // window.document.body 若此时window.document.body === null，则下面一行可保证元素被加到body
  window.addEventListener('DOMContentLoaded', addHiddenElement)
  var twoPI = 2 * Math.PI
  var CurvePlaneCircular = runClass().create({
    _componentType: 'CurvePlaneCircular',
    _defaultConfig: {
      hiddenPlaneIndexes: [],
      showStats: false,
      // 是否展示FPS，用于调试性能
      animationControlButton: {
        enable: true,
        hideNumberButtons: true,
        alwaysShowPlayButton: false,
        top: 100,
        left: 500,
        zIndex: 1, // 出现覆盖，无法按钮时，将这个值调大
      },
      imgWidth: 750,
      // 每个图片的宽度
      imgHeight: 200,
      // 每个图片的高度
      percentage: 0.98,
      // 1 - percentage为一个图片两边的间隙占圆弧的比例
      // 最好关闭echarts，highcharts的初始动画，否则这里需要设置一个毫秒数延迟，等待动画结束才开始截取其图片，否则图片有问题
      waitForAnimationTime: 2000,
      // 转换dom元素为图片前的等待时间
      cameraPosition: {
        // 摄像机的三维坐标
        x: 0,
        y: 50,
        z: 100,
      },
      planeY: -200,
      // 底部轮播圆盘的Y轴坐标
      deltaAngle: 0.0001,
      // 转动速度
      doms: [],
      centerPlane: {
        // 中间的图片，建议直接用doms选项加入，不必转为图片
        enable: false,
      },
      // 中间的div
      frontPosition: {
        // 图片移动到前面来的位置
        x: 0,
        y: 150,
        z: 200,
      },
      speedToFront: 3,
      // 图片移动到前面来的速度
      timeToStayFront: 3000,
      // 移动到前面后的等待时间
      moveToFront: true,
      // 为false则只有旋转动画，没有拉到前面来的动画
      enableControls: true,
      // 是否开启控制器
      addDomMesh: true,
      // 是否添加一个和dom在相同位置的3D平面，用来挡住dom后面的3D物体，设为false则dom不会遮挡物体
      canvasClicked: function (idx, coords) {
        // 面板被点击的回调函数，coords为uv坐标系的坐标
      },
      stayFrontCallback: function (idx) {
        // 第idx面板处于停留在前面的状态
      },
      canvasMouseMoved: function (idx, coords) {},
      customize: function () {},
    },
    /**
     * 构造函数
     * @param config
     *        名称                              类型                         是否必填     描述
     *        pid                              String                        是        父容器id
     *        data                             Array                         是        图表数据
     */
    init: function (config) {
      this._init(config)

      var self = this
      this._hasMouseClicked = false
      this._mousePos = new THREE.Vector2()
      this._hasMouseMoved = false
      this._mouseMovePos = new THREE.Vector2()
      if (config.stateUpdated) {
        this.stateUpdated = config.stateUpdated
      } // 动画状态

      this._aniState = {
        angle: -0.000001,
        planeIdxWillGoFront: -1,
        isRotating: true,
        isGoingFront: false,
        isStayingFront: false,
        isGoingBack: false,
        isStopped: false,
        lastRotationYArr: [],
        setAllToFalse: function () {
          this.isRotating = false
          this.isGoingFront = false
          this.isStayingFront = false
          this.isGoingBack = false
        },
        changeTo: function (stateStr) {
          // console.log('changeTo', stateStr);
          this.setAllToFalse()
          switch (stateStr) {
            case 'rotating':
              this.isRotating = true
              break
            case 'goingFront':
              this.isGoingFront = true
              break
            case 'stayingFront':
              this.isStayingFront = true
              break
            case 'goingBack':
              this.isGoingBack = true
              break
          } // 只为了同步动画状态，让动画状态和iframe的src的值相匹配，因为iframe的src是同步的，动画如果没有同步就说不过去

          self.updateStateTo({})
        },
        toggleStop: function () {
          this.isStopped = !this.isStopped
        },
        start: function () {
          this.isStopped = false
        },
        stop: function () {
          this.isStopped = true
        },
        getAniState: function () {
          var rotationYArr = self._curvedPlanes.map(function (plane) {
            return plane.rotation.y
          })
          var positionArr = self._curvedPlanes.map(function (plane) {
            return [plane.position.x, plane.position.y, plane.position.z]
          })
          return {
            angle: this.angle,
            lastRotationYArr: this.lastRotationYArr,
            rotationYArr: rotationYArr,
            positionArr: positionArr,
            planeIdxWillGoFront: this.planeIdxWillGoFront,
            isRotating: this.isRotating,
            isGoingFront: this.isGoingFront,
            isStayingFront: this.isStayingFront,
            isGoingBack: this.isGoingBack,
            isStopped: this.isStopped,
          }
        },
        setAniState: function (newState) {
          this.angle = newState.angle
          var i
          for (i = 0; i < newState.lastRotationYArr; i++) {
            this.lastRotationYArr[i] = newState.lastRotationYArr[i]
          }
          for (i = 0; i < newState.rotationYArr.length; i++) {
            self._curvedPlanes[i].rotation.y = newState.rotationYArr[i]
          }
          for (i = 0; i < newState.positionArr; i++) {
            var pos = newState.positionArr[i]
            self._curvedPlanes[i].position.set(pos[0], pos[1], pos[2])
          }
          this.planeIdxWillGoFront = newState.planeIdxWillGoFront
          this.isRotating = newState.isRotating
          this.isGoingFront = newState.isGoingFront
          this.isStayingFront = newState.isStayingFront
          this.isGoingBack = newState.isGoingBack
          this.isStopped = newState.isStopped
        },
      }
      this._state = {
        speedMultiplier: 1,
        rotatingDirection: -1,
        willGo: -1,
        hiddenPlaneIndexes: [],
      }

      this.render()
    },
    render: function (config) {
      var self = this
      if (config !== undefined) {
        this._config = runUtil().merge(this._config, config)
      }

      config = this._config
      config.deltaAngle = twoPI / Math.floor(twoPI / config.deltaAngle)
      config.aniCtrBtnEnable =
        config.animationControlButton && config.animationControlButton.enable // 是否开启动画控制按钮
      this._renderStatic()
      this._addListener()
      this._light = this._getLight(config)
      var containerInfo = this._getContainerInfo(
        this._domElem,
        this._$domElem.width(),
        this._$domElem.height()
      )
      this._camera = this._getCamera(containerInfo, config)
      this._css3Renderer = this._getCSS3Renderer(containerInfo)
      this._bottomCon.appendChild(this._css3Renderer.domElement) // css3Renderer的内容放到底层的div中

      this._renderer = this._getRenderer(containerInfo)
      this._topCon.appendChild(this._renderer.domElement) // renderer的内容放到上层的div中

      this._controls = undefined
      if (config.enableControls) {
        this._controls = this._getControls(this._camera, this._domElem)
      }

      this._curvedPlanes = this._getCurvedPlanes(containerInfo) // 全部转动的面板
      // this._centerPlane = undefined
      // if (config.centerPlane.enable) {
      //   this._centerPlane = this._getCenterPlane(config)
      //   this._centerPlane.name = 'centerPlane'
      // }

      this._raycaster = this._getRaycaster()

      this._getTextures(this._renderer, function (textures) {
        self._curvedPlanes.forEach(function (curvedPlane, idx) {
          curvedPlane.material.map = textures[idx]
        })
        if (config.centerPlane.enable) {
          self._centerPlane.material.map = textures.last()
        }
        self._texturesLoaded()
      })
    },
    _renderStatic: function () {
      var config = this._config
      this._bottomCon = $('<div class="CurvePlaneCircular-bottom"></div>')[0]
      this._topCon = $('<div class="CurvePlaneCircular-top"></div>')[0]
      this._domElem.appendChild(this._bottomCon)
      this._domElem.appendChild(this._topCon)
      if (config.aniCtrBtnEnable) {
        var $btnArea = $(`
                <div class="CurvePlaneCircular-btn-area" style="top: ${config.animationControlButton.top}px;
                                            left: ${config.animationControlButton.left}px;
                                            z-index: ${config.animationControlButton.zIndex};">
                    <div class="CurvePlaneCircular-btn">1</div>
                    <div class="CurvePlaneCircular-btn">2</div>
                    <div class="CurvePlaneCircular-btn">3</div>
                    <div class="CurvePlaneCircular-btn">4</div>
                    <div class="CurvePlaneCircular-btn">5</div>
                    <div class="CurvePlaneCircular-btn">6</div>
                </div>
                `)
        var $ctrBtn = $(`<div class="CurvePlaneCircular-stop"></div>`)
        $btnArea.append($ctrBtn)
        if (!this._config.animationControlButton.alwaysShowPlayButton) {
          $ctrBtn.hide()
        }
        if (this._config.animationControlButton.hideNumberButtons === true) {
          $btnArea.find(`.CurvePlaneCircular-btn`).hide()
        }
        this._$domElem.append($btnArea)
        this.$btnArea = $btnArea
        this.$ctrBtn = $ctrBtn // 1-6数字按钮
        this.$numBtns = this._$domElem.find(
          '.CurvePlaneCircular-btn-area .CurvePlaneCircular-btn'
        )
        this._ctrBtnState = 'stop'
      }
    },
    _addListener: function () {
      var self = this
      var config = this._config
      // this._domElem.addEventListener(
      //   'click',
      //   function (e) {
      //     e.preventDefault()
      //     self._hasMouseClicked = true
      //     self._mousePos.x = (e.offsetX / this.offsetWidth) * 2 - 1
      //     self._mousePos.y = -(e.offsetY / this.offsetHeight) * 2 + 1
      //   },
      //   false
      // )
      // this._domElem.addEventListener(
      //   'mousemove',
      //   function (e) {
      //     e.preventDefault()
      //     self._hasMouseMoved = true
      //     self._mouseMovePos.x = (e.offsetX / this.offsetWidth) * 2 - 1
      //     self._mouseMovePos.y = -(e.offsetY / this.offsetHeight) * 2 + 1
      //   },
      //   false
      // )
      if (config.aniCtrBtnEnable) {
        this._ctrBtnPlay = function () {
          self._aniState.start()
          self._ctrBtnState = 'stop'
          self.$ctrBtn.removeClass(`CurvePlaneCircular-play`)
          self.$ctrBtn.addClass(`CurvePlaneCircular-stop`)
        }
        this._ctrBtnStop = function () {
          self._aniState.stop()
          self._ctrBtnState = 'play'
          self.$ctrBtn.removeClass(`CurvePlaneCircular-stop`)
          self.$ctrBtn.addClass(`CurvePlaneCircular-play`)
        }
        this.$ctrBtn.click(function () {
          if (self._aniState) {
            if (self._ctrBtnState === 'stop') {
              self.updateStateTo({
                ctrBtn: 'stop',
              })
            } else {
              self.updateStateTo({
                ctrBtn: 'play',
              })
            }
          }
        })
        this.$numBtns.each(function (idx) {
          $(this).click(function () {
            if (idx === self._aniState.planeIdxWillGoFront) {
              // return;
            }
            var offset = self._curvedPlanes[idx].rotation.y % twoPI
            var rotatingDirection
            if (offset < 0) {
              // 转到了左边
              if (-Math.PI < offset) {
                rotatingDirection = 1
              } // 转到了右边
              else {
                rotatingDirection = -1
              }
            } else {
              if (Math.PI < offset) {
                rotatingDirection = 1
              } else {
                rotatingDirection = -1
              }
            }
            if (self._aniState.isStayingFront) {
              self._aniState.changeTo('goingBack')
            }
            self.updateStateTo({
              // 改大速度因子，提高动画速度
              speedMultiplier: 10,
              // 将要移动到前面的面板
              willGo: idx,
              ctrBtn: 'play',
              rotatingDirection: rotatingDirection,
            })
          })
        })
      }
    },
    _getCurvedPlanes: function (containerInfo) {
      var config = this._config
      var num = config.divs.length
      var perAngle = twoPI / num
      var start = -Math.PI / 2 + perAngle / 2
      var end = -Math.PI / 2 - perAngle / 2
      var deltaAngle = perAngle * (1 - config.percentage)
      start -= deltaAngle / 2
      end += deltaAngle / 2
      var sin = Math.abs(Math.sin(perAngle / 2 - deltaAngle / 2))
      var radius = config.imgWidth / 2 / sin
      this._perAngle = perAngle
      this._start = start
      this._end = end
      this._radius = radius
      var planeMeshes = []
      var angle = 0
      for (var i = 0; i < num; i++) {
        var geometry = new THREE.PlaneGeometry(
          config.imgWidth,
          config.imgHeight,
          100,
          100
        )
        var material = new THREE.MeshBasicMaterial({
          depthWrite: true,
          color: 0xffffff,
          side: THREE.DoubleSide,
        })
        material.transparent = true
        this._circularPlaneGeometry(geometry, radius, start, end)
        var planeMesh = new THREE.Mesh(geometry, material)
        planeMesh.rotation.y = angle
        planeMesh.scale.set(1, 1, 1)
        planeMesh.position.y = config.planeY
        planeMeshes.push(planeMesh)
        angle -= perAngle
      }
      return planeMeshes
    },
    _getCenterPlane: function () {
      var config = this._config
      var geometry = new THREE.PlaneGeometry(
        config.centerPlane.width,
        config.centerPlane.height,
        200,
        100
      )
      var material = new THREE.MeshBasicMaterial({
        depthWrite: false,
        // 置为false可以解决中间的面板对其后面的面板的深度测试有异常的问题
        color: 0xffffff,
        side: THREE.DoubleSide,
      })
      material.transparent = true
      var mesh = new THREE.Mesh(geometry, material)
      mesh.position.x = config.centerPlane.x
      mesh.position.y = config.centerPlane.y
      mesh.scale.set(
        config.centerPlane.scale,
        config.centerPlane.scale,
        config.centerPlane.scale
      )
      return mesh
    },
    _getTextures: function (renderer, callback) {
      var self = this
      var config = this._config
      var divs = [].concat(config.divs)
      if (config.centerPlane.enable) {
        divs.push(config.centerPlane.dom)
      }
      var backUpDivs = divs.slice(0)

      for (var div of divs) {
        // div.style.top = '0px';
        // div.style.left = '-9999px'; // 让元素在页面上不可见，并且可以被转为图片
        // div.style.visibility = 'hidden'; // 使用hidden会导致图片显示空白
        div.style.position = 'relative'
        div.style.top = '0px'
        div.style.left = '0px'
        if (hiddenElementForPlacingDivsToTransfer)
          hiddenElementForPlacingDivsToTransfer.appendChild(div)
      }
      var textures = [] // 递归调用，解决多个Promise的回调地狱
      function recursive() {
        if (divs.length === 0) {
          for (var div_ of backUpDivs) {
            if (hiddenElementForPlacingDivsToTransfer)
              hiddenElementForPlacingDivsToTransfer.removeChild(div_)
          }
          callback(textures)
          return
        }
        var dom = divs.shift()
        var width = config.imgWidth
        var height = config.imgHeight
        if (config.centerPlane.enable) {
          if (dom === config.centerPlane.dom) {
            width = config.centerPlane.width
            height = config.centerPlane.height
          }
        }
        const domtoimage = runDomtoimage()
        domtoimage
          .toPng(dom, {
            width: width,
            height: height, // https://github.com/tsayen/dom-to-image/issues/36
            // style: {
            //     position: 'absolute',
            //     top: '0px',
            //     left: '0px'
            // }
          })
          .then(function (dataUrl) {
            // 直接removeChild会导致dispatchEvent无法进行，暂时还是通过把dom.style.left调大来隐藏元素
            // document.body.removeChild(dom);
            // dom.style.left = '99999px';
            // console.log(dataUrl);
            var textureLoader = new THREE.TextureLoader()
            textureLoader.load(dataUrl, function (texture) {
              texture.anisotropy =
                self._renderer.capabilities.getMaxAnisotropy()
              textures.push(texture)
              recursive()
            })
          })
          .catch(function (e) {
            console.log(e)
          })
      } // 等待一段时间才开始dom转png

      setTimeout(function () {
        recursive()
      }, config.waitForAnimationTime)
    },
    _texturesLoaded: function () {
      var config = this._config
      var meshes = []
        .concat(this._curvedPlanes)
        .concat([this._light, this._camera])
      // console.log([this._light, this._camera])
      if (config.centerPlane.enable) {
        meshes.push(this._centerPlane)
      }

      this._scene = this._getScene(meshes)
      this._domScene = this._getDomScene(this._scene)
      this._addAnimation()
    },
    _getDomScene: function (scene) {
      var config = this._config
      var domScene = new THREE.Scene()
      for (var item of config.doms) {
        // 不设置会出问题
        item.dom.style.top = '0'
        item.dom.style.left = '0'
        var domObj = new THREE.CSS3DObject(item.dom)
        domObj.position.x = item.x
        domObj.position.y = item.y
        domObj.scale.set(item.scale, item.scale, item.scale)
        domObj.rotation.x = item.rotationX
        domScene.add(domObj)
        if (config.addDomMesh) {
          var material = new THREE.MeshBasicMaterial({
            depthWrite: false,
            opacity: 0.0,
            color: new THREE.Color('black'),
            side: THREE.DoubleSide,
          })
          material.transparent = true // 放到页面上后，才能拿到宽高
          document.body.appendChild(item.dom)
          var geometry = new THREE.PlaneGeometry(
            item.dom.scrollWidth,
            item.dom.scrollHeight
          )
          var mesh = new THREE.Mesh(geometry, material)
          mesh.position.copy(domObj.position)
          mesh.rotation.copy(domObj.rotation)
          mesh.scale.copy(domObj.scale)
          scene.add(mesh)
        }
      }
      return domScene
    },
    _addAnimation: function () {
      var self = this
      var set = false
      var config = this._config
      if (config.showStats) {
        this._stats = new Stats()
        this._stats.showPanel(0)
        this._stats.dom.style.left = '1rem'
        this._stats.dom.style.position = 'absolute'
        this._domElem.appendChild(this._stats.dom)
      } // var clock = new THREE.Clock();

      this.updateStateTo({
        hiddenPlaneIndexes: config.hiddenPlaneIndexes,
      })
      var startPos = new THREE.Vector3(0, config.planeY, 0)
      var endPos = new THREE.Vector3(
        config.frontPosition.x,
        config.frontPosition.y,
        config.frontPosition.z
      )
      var tempPos = new THREE.Vector3()
      var direction = new THREE.Vector3()
        .subVectors(endPos, startPos)
        .normalize()
        .multiplyScalar(config.speedToFront * this._state.speedMultiplier)
      this._aniState.lastRotationYArr = new Array(this._curvedPlanes.length)
      for (var i = 0; i < this._curvedPlanes.length; i++) {
        this._aniState.lastRotationYArr[i] =
          this._curvedPlanes[i].rotation.y % twoPI
      }
      function animate() {
        if (config.showStats) {
          self._stats.begin()
        }
        if (config.enableControls) {
          self._controls.update()
        }
        if (config.aniCtrBtnEnable) {
          if (!self._config.animationControlButton.alwaysShowPlayButton) {
            if (self._aniState.isStayingFront || self._aniState.isStopped) {
              self.$ctrBtn.show()
            } else {
              self.$ctrBtn.hide()
            }
          }
        }
        if (!self._aniState.isStopped) {
          // 旋转状态
          if (self._aniState.isRotating) {
            var rotationY = self._aniState.angle
            var deltaAngle =
              self._state.rotatingDirection *
              config.deltaAngle *
              self._state.speedMultiplier
            for (var i = 0; i < self._curvedPlanes.length; i++) {
              var planeMesh = self._curvedPlanes[i]

              planeMesh.rotation.y = rotationY

              var a = self._aniState.lastRotationYArr[i] % twoPI
              var b = rotationY % twoPI
              var isZeroBetweenAB = // 符号相同时，跨越2PI
                Math.abs(b - a) > twoPI - 2 * Math.abs(deltaAngle) || // 符号不同时，跨越0
                // 当前为0时，就是面板1最开始的位置
                a * b <= 0 // if (i === 0)
              // console.warn(a, b)
              if (b > -4.5 && b < -1) {
                planeMesh.material.opacity = 0.2
                // console.warn(a, b)
                if (-4.5 < b < -4 && -1.5 < b < -1) {
                  planeMesh.material.opacity = 0.5
                }
              } else {
                planeMesh.material.opacity = 1
              }
              self._aniState.lastRotationYArr[i] = rotationY
              // if (config.moveToFront) {
              //   if (
              //     isZeroBetweenAB &&
              //     (self._state.willGo === -1 || self._state.willGo === i) && // 隐藏的面板不移动到前面
              //     !self._state.hiddenPlaneIndexes.includes(i)
              //   ) {
              //     self._aniState.planeIdxWillGoFront = i
              //     self._aniState.changeTo('goingFront') // console.log('changeTo', 'goingFront', self.aniState.lastRotationYArr);

              //     break
              //   }
              // }
              rotationY -= self._perAngle
            }
            self._aniState.angle += deltaAngle
          } // 移动到前面
          else if (self._aniState.isGoingFront) {
            var plane = self._curvedPlanes[self._aniState.planeIdxWillGoFront]
            tempPos.addVectors(plane.position, direction)
            if (tempPos.z >= endPos.z) {
              plane.position.set(endPos.x, endPos.y, endPos.z)

              self._aniState.changeTo('stayingFront')
            } else {
              plane.position.set(tempPos.x, tempPos.y, tempPos.z)
            }
          } // 停止在前面
          else if (self._aniState.isStayingFront) {
            // 选中的面板移到了前面，则停止动画
            if (self._state.willGo === self._aniState.planeIdxWillGoFront) {
              // 实际上如果willGo不是-1，那么aniCtrBtnEnable就肯定是true，因为只有通过按钮才能修改willGo
              if (config.aniCtrBtnEnable) {
                self.updateStateTo({
                  speedMultiplier: 1,
                  willGo: -1,
                  // rotatingDirection: -1,
                  ctrBtn: 'stop',
                })
                if (config.stayFrontCallback) {
                  config.stayFrontCallback(self._aniState.planeIdxWillGoFront)
                }
              }
            }
            if (!set) {
              // FIXED requestAnimationFrame,每一帧setTimeout一次的bug
              setTimeout(function () {
                // TODO 如果定时器的goingBack指令和用户的stayingFront指令冲突？
                if (self._aniState.isStayingFront) {
                  self._aniState.changeTo('goingBack')
                }
                set = false
              }, config.timeToStayFront / self._state.speedMultiplier)
              set = true
              if (config.stayFrontCallback) {
                config.stayFrontCallback(self._aniState.planeIdxWillGoFront)
              }
            }
            self._handleMouseClick(config)
          } // 移动回去
          else if (self._aniState.isGoingBack) {
            plane = self._curvedPlanes[self._aniState.planeIdxWillGoFront]
            tempPos.subVectors(plane.position, direction)
            if (tempPos.z < startPos.z) {
              plane.position.set(startPos.x, startPos.y, startPos.z)
              self._aniState.changeTo('rotating')
            } else {
              plane.position.set(tempPos.x, tempPos.y, tempPos.z)
            }
          }
        } else {
          // 动画启动事件改由button控制
          self._handleMouseClick(config)
        }
        self._hasMouseClicked = false
        self._hasMouseMoved = false
        self._renderer.render(self._scene, self._camera)
        self._css3Renderer.render(self._domScene, self._camera)
        if (config.showStats) {
          self._stats.end()
        }
        requestAnimationFrame(animate)
      }
      animate()
      if (this._config.customize) {
        this._config.customize.call(this)
      }
    },
    _handleMouseClick: function () {
      var self = this
      var config = this._config
      if (this._hasMouseClicked) {
        // 这一行需要放到raycaster.intersectObjects(self.curvedPlanes)上面，否则intersectObjects返回空数组
        this._raycaster.setFromCamera(this._mousePos, this._camera)
        var intersects = this._raycaster.intersectObjects(this._curvedPlanes) // console.log(mousePos.x, mousePos.y, intersects.length);

        var idx = intersects.findIndex(function (item) {
          return (
            item.object ===
            self._curvedPlanes[self._aniState.planeIdxWillGoFront]
          )
        })
        if (idx !== -1) {
          if (config.aniCtrBtnEnable) {
            this.updateStateTo({
              ctrBtn: 'stop',
            })
          } else {
            this._aniState.toggleStop()
          }
          if (config.canvasClicked) {
            var obj = intersects[idx]
            var coords = {
              x: obj.uv.x,
              y: obj.uv.y,
            }
            config.canvasClicked(this._aniState.planeIdxWillGoFront, coords)
          }
        }
      }
      if (this._hasMouseMoved) {
        this._raycaster.setFromCamera(this._mouseMovePos, this._camera)
        intersects = this._raycaster.intersectObjects(this._curvedPlanes)
        idx = intersects.findIndex(function (item) {
          return (
            item.object ===
            self._curvedPlanes[self._aniState.planeIdxWillGoFront]
          )
        })
        if (idx !== -1) {
          if (config.canvasMouseMoved) {
            obj = intersects[idx]
            coords = {
              x: obj.uv.x,
              y: obj.uv.y,
            }
            config.canvasMouseMoved(this._aniState.planeIdxWillGoFront, coords)
          }
        }
      }
    },
    updateStateTo: function (newState) {
      var self = this
      if (newState.hiddenPlaneIndexes) {
        this._state.hiddenPlaneIndexes = newState.hiddenPlaneIndexes
      }
      if (newState.speedMultiplier) {
        this._state.speedMultiplier = newState.speedMultiplier
      }
      if (newState.rotatingDirection) {
        this._state.rotatingDirection = newState.rotatingDirection
      } // PC才会执行

      if (newState.aniState) {
        this._aniState.setAniState(newState.aniState)
      }
      if (newState.willGo !== undefined) {
        this._state.willGo = newState.willGo
      }
      if (newState.ctrBtn) {
        if (newState.ctrBtn === 'stop') {
          self._ctrBtnStop()
        } else if (newState.ctrBtn === 'play') {
          self._ctrBtnPlay()
        }
      } // 把动画状态从平板发送给PC，则PC的动画就可以同步

      newState.aniState = this._aniState.getAniState()
      this.stateUpdated(newState)
    },
    stateUpdated: function (newState) {},
    _getLight: function () {
      var light = new THREE.AmbientLight(0xffffff)
      light.position.set(0, 0, 0)
      return light
    },
    _getContainerInfo: function (div, width, height) {
      var aspect = width / height
      return {
        div,
        width,
        height,
        aspect,
      }
    },
    _getCamera: function (containerInfo, option) {
      var camera = new THREE.PerspectiveCamera(
        55,
        containerInfo.aspect,
        0.1,
        containerInfo.width * 10
      )
      camera.position.set(
        option.cameraPosition.x,
        option.cameraPosition.y,
        option.cameraPosition.z
      )
      camera.up.set(0, 1, 0)
      camera.lookAt(new THREE.Vector3(0, 0, 0))
      return camera
    },
    _getCSS3Renderer: function (containerInfo) {
      var css3Renderer = new THREE.CSS3DRenderer()
      css3Renderer.setSize(containerInfo.width, containerInfo.height)
      css3Renderer.domElement.style.position = 'absolute'
      css3Renderer.domElement.style.top = '0'
      css3Renderer.domElement.style.left = '0' // css3Renderer.domElement.style.borderWidth = '1px';
      // css3Renderer.domElement.style.borderColor = 'red';
      // css3Renderer.domElement.style.borderStyle = 'solid';
      return css3Renderer
    },
    _getRenderer: function (containerInfo) {
      var renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      })
      renderer.setClearColor(0x000000, 0) // renderer.precision = "highp";
      // Sets device pixel ratio. This is usually used for HiDPI device to prevent bluring output canvas
      // 添加这个设置，可以解决模糊问题
      /*
      2020-09-16 hejiang
      平板APP上ThreeJS显示的位置异常问题在于：renderer.setPixelRatio(window.devicePixelRatio);
      window.devicePixelRatio在PC上是1.0，但是在平板上是2.5，这就是问题所在。最初猜测是它的值为2.5导致的平板上canvas的width和height是PC的2.5倍，
      平板上渲染的位置会出现看上去往右偏移了的异常情况。在PC上把这个设置为2.5时，渲染分辨率为6405*2455，我的电脑是集显，会出现卡顿，但是PC上显示的位置仍然正常。
      由PC在设为2.5时的卡顿可以猜测，平板上设为2.5可能就是导致平板APP直接崩溃回到桌面的原因。在平板上测试设为0.5，1.0，1.5，1.6时肉眼看上去都正常，设为1.65,
      1.7, 1.8, 2.0，2.5，3.0时都有肉眼可见的异常位置偏差且数值越大，位置偏差越大。很难说设为1.0到1.5之间时是否有异常，因为肉眼看不见，看不见不一定没异常。平板上的
      华为自带浏览器无法打开ThreeJS的场景，使用安卓版Chrome浏览器打开此页面，alert(window.devicePixelRatio);得到的结果和APP里一样都是2.5，并且在
      Android版Chrome中设为2.5时，会出现和APP一样的位置偏移异常！
      在fundFinancial/part2/index.js中也写了renderer.setPixelRatio(window.devicePixelRatio);但是它的页面在平板上打开没有问题，在其页面上运行
      alert(window.devicePixelRatio + ', ' + renderer.domElement.outerHTML);
      PC上得到0.75, <canvas width="1260" height="810" style="width: 1680px; height: 1080px;"></canvas>
      平板上得到2.5, <canvas width="4200" height="2700" style="width: 1680px; height: 1080px;"></canvas>
      所以区别到底在哪？我换了那个页面的旧版本的three.js到此页面，此页面仍然有同样的问题。
      那个页面用的ParametricGeometry和明确的x,y,z坐标；我这里用的PlaneGeometry和(0,0,0)坐标，位置只是通过rotation.y来区别。animate
      我不知道是不是这两个区别导致的问题。
      结论：暂时直接将这个值设置为1，和PC上一样，可以解决位置异常问题，平板上也没有察觉到画面有模糊感。
           平板APP的崩溃可能也和渲染分辨率太大有关，设置为1也许可以避免崩溃。
       */
      renderer.setPixelRatio(1) // window.devicePixelRatio
      renderer.setSize(containerInfo.width, containerInfo.height)
      return renderer
    },
    _getControls: function (camera, domElement) {
      var controls = new THREE.OrbitControls(camera, domElement)
      return controls
    },
    _circularPlaneGeometry: function (planeGeometry, radius, start, end) {
      var curve = new THREE.EllipseCurve(
        0,
        0,
        radius,
        radius,
        start,
        end,
        true,
        0
      )
      var curvePoints = curve.getPoints(planeGeometry.parameters.widthSegments)
      for (var i = 0; i < planeGeometry.vertices.length; i++) {
        planeGeometry.vertices[i].z = -curvePoints[i % curvePoints.length].y
      } // for (var i = planeGeometry.vertices.length - 1; i >= 0; i--) {
      //     planeGeometry.vertices[i].z = -curvePoints[i % (curvePoints.length)].y;
      // }

      planeGeometry.computeFaceNormals()
      planeGeometry.computeVertexNormals() // var curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
      // var curveMaterial = new THREE.LineBasicMaterial({color: 0x00ff00});
      // // Create the final object to add to the scene
      // curveObj = new THREE.Line(curveGeometry, curveMaterial);
    },
    _getRaycaster: function () {
      return new THREE.Raycaster()
    },
    _getScene: function (arr) {
      var scene = new THREE.Scene() // scene.updateMatrixWorld(true);
      // 不设背景则会透明
      // scene.background = new THREE.Color(0xeeeeee);
      // scene.fog = new THREE.Fog(0xeeeeee, 100,200)
      for (var item of arr) {
        if (item) {
          scene.add(item)
          console.log(item)
        }
      } // 显示用来构造曲面的曲线，用于调试

      if (typeof curveObj !== 'undefined') {
        scene.add(curveObj)
      }
      return scene
    },
    /**
     * 把自定义配置项参数config通过Util.merge和组件的默认配置this._defaultConfig深合并到this._config中作为组件内的全部配置项。
     * 为了避免改动父容器的属性，这里有必要先往父容器里append一个子元素作为组件内所有渲染过程发生的容器this._domElem，
     * 将此元素的定位设为relative是为了让其内部元素的定位以其为依据而与组件外无关
     * @param config
     *        名称                              类型                         是否必填     描述
     *        pid                              String                        是        父容器id
     */
    _init: function (config) {
      // 是否已经调用render渲染过一次，第一次调用render时是把参数config和this._defaultConfig合并生成this._config，
      // 之后再调用render时，是把参数config和已有的this._config合并
      this._hasRenderedOnce = false
      this._timers = [] // 组件内所有计时器
      this._players = [] // 轮播播放器
      if (config !== undefined) {
        this._config = runUtil().merge(this._defaultConfig, config)
      }

      if (!this._config.parentElement) {
        this._config.parentElement = document.querySelector(
          `#${this._config.pid}`
        )
      }
      this._id = this._componentType + '-' + runUtil().sequence.nextVal() // 用'组件类名+短横线+全局递增整数'，来生成组件实例的全局唯一的id
      this._$domElem = $(`<div id="${this._id}"></div>`)
      this._domElem = this._$domElem[0]
      this._config.parentElement.appendChild(this._domElem)
      this._$domElem.css({
        position: 'relative',
        width: '100%',
        height: '100%',
      })
      if (this._config.cssVar) {
        // 把样式变量加到this._domElem上，控制其内部元素的样式
        this._cssVar = this._config.cssVar
        var entries = Object.entries(this._cssVar)
        for (var entry of entries) {
          var val = entry[1]
          if (typeof val === 'number') {
            val += 'px'
          }
          this._domElem.style.setProperty(
            '--' + runUtil().camelCaseToKebabCase(entry[0]),
            val
          )
        }
      }
    },
    destroy: function (isAll) {
      this._destroyTimers()
      this._destroyPlayers()
      if (isAll) {
        this._config.parentElement.removeChild(this._domElem)
      } else {
        this._$domElem.empty()
      }
    },
    _destroyTimers: function () {
      for (var timerId of this._timers) {
        clearInterval(timerId)
      }
      this._timers = []
    },
    _destroyPlayers: function () {
      for (var _player of this._players) {
        _player.destroy()
      }
      this._players = []
    },
    /**
     * 设置配置项
     * @param key
     * @returns {*}
     */
    get: function (key) {
      return this._config[key]
    },
    /**
     * 获取配置项
     * @param key
     * @param value
     */
    set: function (key, value) {
      this._config[key] = value
    },
    /**
     * 更新渲染
     * @param config
     */
    refresh: function (config) {
      this.render(config)
    },
  })
  return CurvePlaneCircular
}
