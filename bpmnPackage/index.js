import ProcessDesigner from "./designer";
import ProcessPenal from "./panel";
import JEllipsis from './components/JEllipsis.vue'

const components = [ProcessDesigner, ProcessPenal, JEllipsis];

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  version: "0.0.1",
  install,
  ...components
};
