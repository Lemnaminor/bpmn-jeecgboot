# bpmn-jeecgboot

#### 项目描述
基于bpmn.js、vue、antd 仿jeecg-boot的工作流程图。

运行示例：[https://lemnaminor.github.io/bpmn-jeecgboot/dist//](https://lemnaminor.github.io/bpmn-jeecgboot/dist// "https://lemnaminor.github.io/bpmn-jeecgboot/dist//")
#### 参考链接：
bpmn.js: [https://github.com/bpmn-io/bpmn-js/](https://github.com/bpmn-io/bpmn-js/ "https://github.com/bpmn-io/bpmn-js/")

bpmn-process-designer: [https://github.com/miyuesc/bpmn-process-designer/](https://github.com/miyuesc/bpmn-process-designer/ "https://github.com/miyuesc/bpmn-process-designer/")

jeecg-boot: [http://www.jeecg.com/](http://www.jeecg.com/ "http://www.jeecg.com/")
#### 引入项目说明

#### 项目文件夹：bpmnPackage

##### package.json
```json
  "dependencies": {
    "bpmn-js-token-simulation": "^0.10.0",
    "highlight.js": "^10.5.0",
    "x2js": "^3.4.2"
  },
  "devDependencies": {
    "bpmn-js": "^8.8.3",
    "vue-template-compiler": "^2.6.14",
    "sass": "^1.30.0",
    "sass-loader": "^8.0.2"
  },
```


##### npm安装
    npm install  @babel/plugin-proposal-optional-chaining // 可选链运算符 ?.
    npm install  @babel/plugin-proposal-nullish-coalescing-operator // 空值合并运算符 ??

##### 配置babel.config.js
    module.exports = {
      plugins: [
        '@babel/plugin-proposal-optional-chaining',  // 可选链运算符 ?.
        '@babel/plugin-proposal-nullish-coalescing-operator'  // 空值合并运算符 ??
      ]
    }

##### main.js

    // bpmnPackage组件引用
    import bpmnPackage from "../bpmnPackage/index.js";
    import hljs from 'highlight.js'
    import 'highlight.js/styles/atom-one-dark.css'  //这里有多个样式，自己可以根据需要切换
    Vue.use(bpmnPackage);
    Vue.use(hljs.vuePlugin);
    import "../bpmnPackage/theme/index.scss";
    import "bpmn-js/dist/assets/diagram-js.css";
    import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
    import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";

#### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```