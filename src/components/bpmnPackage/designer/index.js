import ProcessDesigner from "./ProcessDesigner.vue";

ProcessDesigner.install = function(Vue) {
  Vue.component(ProcessDesigner.name, ProcessDesigner);
};

export default ProcessDesigner;
