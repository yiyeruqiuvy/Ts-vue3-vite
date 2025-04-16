/*
 * @Author: NIXY
 * @LastEditors: peiqf
 * @Date: 2023-04-10 19:55:51
 * @LastEditTime: 2025-04-16 17:28:37
 * @Description: desc
 * @FilePath: \cqGit\src\scopes\project\bigScreen\modulePart\situationAwareness\modulePart\districtBigScreen\utils\pageComponentConfig.js
 */
const config = [
  {
    type: "box",
    className: "content-box",
    name: "组件",
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
        name: "BaseFirstTitle",
        path: "titleSection/BaseFirstTitle",
        ref: "base-first-title",
        moduleName: "标题1",
        componentsDesc: "标题1",
        // com:null,
        parameterDesc: "我是参数参数说明",
        url: "",
        style: {
          width: "100%",
          height: "20%",
          overflow: "hidden",
        },
        config: {
          title: "这是展示标题",
        },
      },
      {
        name: "base-second-title",
        path: "titleSection/base-second-title",
        ref: "base-second-title",
        moduleName: "标题2",
        componentsDesc: "标题2",
        parameterDesc: "我是参数参数说明",
        url: "",
        style: {
          width: "28%",
          height: "20%",
          overflow: "hidden",
        },
        config: {
          title: "这是展示标题",
        },
      },
      {
        name: "base-small-title",
        path: "titleSection/base-small-title",
        ref: "base-small-title",
        moduleName: "标题3",
        componentsDesc: "标题3",
        parameterDesc: "我是参数参数说明",
        url: "",
        style: {
          width: "100%",
          height: "20%",
          overflow: "hidden",
        },
        config: {
          title: "这是展示标题",
        },
      },
      {
        name: "base-third-title",
        path: "titleSection/base-third-title",
        ref: "base-third-title",
        moduleName: "标题4",
        componentsDesc: "标题4",
        parameterDesc: "我是参数参数说明",
        url: "",
        style: {
          width: "100%",
          height: "20%",
          // overflow: "hidden",
        },
        config: {
          title: "这是展示标题4",
        },
      },
      {
        name: "base-middle-title",
        path: "titleSection/base-middle-title",
        ref: "base-middle-title",
        moduleName: "标题5",
        componentsDesc: "标题5",
        parameterDesc: "我是参数参数说明",
        url: "",
        style: {
          width: "100%",
          height: "20%",
          // overflow: "hidden",
        },
        config: {
          title: "这是展示标题5",
        },
      },
    ],
  },
];
export default config;
