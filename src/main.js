import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// bpmnPackage组件引用
import Antd from 'ant-design-vue'
import bpmnPackage from "@/components/bpmnPackage/index.js";
import 'ant-design-vue/dist/antd.css';
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'  //这里有多个样式，自己可以根据需要切换

Vue.use(Antd);
Vue.use(bpmnPackage);
Vue.use(hljs.vuePlugin);

import "@/components/bpmnPackage/theme/index.scss";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
