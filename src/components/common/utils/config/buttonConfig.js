/*
 * @Author: NIXY
 * @LastEditors: peiqf
 * @Date: 2023-04-10 19:55:51
 * @LastEditTime: 2023-09-08 10:15:58
 * @Description: desc
 * @FilePath: \cqGit\src\scopes\project\bigScreen\modulePart\situationAwareness\modulePart\districtBigScreen\utils\pageComponentConfig.js
 */
const config = [
  {
    type: "box",
    className: "content-box",
    name: "按钮组件",
    url: "",
    style: {
      position: "absolute",
      left: "2.5rem",
      top: "1.5rem",
      right: "2rem",
      bottom: ".2rem",
      width: "14.7rem",
      height: "auto",
      zIndex: 9,
      display: "flex",
      overflow: "scroll",
      "flex-direction": "inherit",
      "flex-wrap": "wrap",
    },
    components: [
      {
        name: "base-button",
        path: "buttonSection/base-button",
        ref: "base-button",
        moduleName: "按钮1",
        componentsDesc: "按钮1样式1",
        parameterDesc: "我是参数参数说明",
        url: "",
        style: {
          width: "100%",
          height: "20%",
          overflow: "hidden",
        },
        config: {
          text: "按钮1样式1",
          btnType: "1",
        },
      },
      {
        name: "base-button",
        path: "buttonSection/base-button",
        ref: "base-button",
        moduleName: "按钮1",
        componentsDesc: "按钮1样式2",
        parameterDesc: "我是参数参数说明",
        url: "",
        style: {
          width: "100%",
          height: "20%",
          overflow: "hidden",
        },
        config: {
          text: "按钮1样式2",
          btnType: "2",
        },
      },
      {
        name: "base-button-switch2",
        path: "buttonSection/base-button-switch2",
        ref: "base-button-switch2",
        moduleName: "按钮2",
        componentsDesc: "按钮2样式1",
        parameterDesc: "我是参数参数说明",
        url: "",
        style: {
          width: "100%",
          height: "20%",
          overflow: "hidden",
        },
        config: {
          text: "按钮2样式1",
          btnData: [
            {
              btnName: "按钮2",
            },
            {
              btnName: "按钮2",
            },
          ],
          btnType: "1",
          fontSize: "0.22rem",
        },
      },
      {
        name: "base-button-switch2",
        path: "buttonSection/base-button-switch2",
        ref: "base-button-switch2",
        moduleName: "按钮2",
        componentsDesc: "按钮2样式2",
        parameterDesc: "我是参数参数说明",
        url: "",
        style: {
          width: "100%",
          height: "20%",
          overflow: "hidden",
        },
        config: {
          text: "按钮2样式2",
          btnData: [
            {
              btnName: "按钮2",
            },
            {
              btnName: "按钮2",
            },
          ],
          btnType: "2",
          fontSize: "0.22rem",
        },
      },
      {
        name: "base-button-switch3",
        path: "buttonSection/base-button-switch3",
        ref: "base-button-switch3",
        moduleName: "按钮3",
        componentsDesc: "按钮3",
        parameterDesc: "我是参数参数说明",
        url: "",
        style: {
          width: "100%",
          height: "20%",
          overflow: "hidden",
        },
        config: {
          text: "按钮3",
          btnData: [
            {
              btnName: "按钮3",
            },
            {
              btnName: "按钮3",
            },
          ],
          btnType: "2",
          fontSize: "0.22rem",
        },
      },
      {
        name: "base-switch-box",
        path: "buttonSection/base-switch-box",
        ref: "base-switch-box",
        moduleName: "按钮4",
        componentsDesc: "按钮4",
        parameterDesc: "我是参数参数说明",
        url: "",
        style: {
          width: "10%",
          height: "20%",
          overflow: "hidden",
        },
        config: {
          text: "按钮4",
          type: "box",
          defaultActive: "",
          btnData: [
            {
              name: "按钮4",
              value: 0,
            },
            {
              name: "按钮4",
              value: 1,
            },
          ],
          btnType: "2",
          fontSize: "0.22rem",
        },
      },
      {
        name: "base-tab-switch",
        path: "buttonSection/base-tab-switch",
        ref: "base-tab-switch",
        moduleName: "按钮5",
        componentsDesc: "按钮5",
        parameterDesc: "我是参数参数说明",
        url: "",
        style: {
          width: "10%",
          height: "20%",
          overflow: "hidden",
        },
        config: {
          tabList: [
            {
              label: "按钮5",
              ischecked: true,
            },
            {
              label: "按钮5",
              ischecked: false,
            },
          ],
        },
      },
    ],
  },
];
export default config;
