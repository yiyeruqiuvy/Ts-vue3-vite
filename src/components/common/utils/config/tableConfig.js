/*
 * @Author: NIXY
 * @LastEditors: peiqf
 * @Date: 2023-04-10 19:55:51
 * @LastEditTime: 2023-09-07 19:43:08
 * @Description: desc
 * @FilePath: \cqGit\src\scopes\project\bigScreen\modulePart\situationAwareness\modulePart\districtBigScreen\utils\pageComponentConfig.js
 */
const config = [
  {
    type: "box",
    className: "content-box",
    name: "表格组件",
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
    ],
  },
];
export default config;
