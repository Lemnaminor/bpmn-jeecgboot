<template>
  <div id="app">
    <a-layout style="background:#fff;">
      <a-layout-content>
        <process-designer
          :key="`designer-${reloadIndex}`"
          :options="{
        taskResizingEnabled: true,
        eventResizingEnabled: true
      }"
          v-model="xmlString"
          v-bind="controlForm"
          keyboard
          ref="processDesigner"
          @element-click="elementClick"
          @init-finished="initModeler"
          @eventSave="handleSave"
        />
      </a-layout-content>
      <a-layout-sider width="355" style="background:#FFFFFF;">
        <properties-panel
          ref="propertiesPanel"
          :key="`penal-${reloadIndex}`"
          :bpmn-modeler="modeler"
          :prefix="controlForm.prefix"
        />
      </a-layout-sider>
    </a-layout>

  </div>
</template>

<script>
// import translations from "@/translations";
// 自定义渲染（隐藏了 label 标签）
// import CustomRenderer from "@/modules/custom-renderer";
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
import CustomContentPadProvider from "../bpmnPackage/designer/plugins/content-pad";
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from "../bpmnPackage/designer/plugins/palette";
import Log from "../bpmnPackage/Log";
import PropertiesPanel from "../bpmnPackage/panel/PropertiesPanel.vue";

export default {
  name: "App",
  components: {
    PropertiesPanel,
  },
  data() {
    return {
      xmlString: "",
      modeler: null,
      reloadIndex: 0,
      controlDrawerVisible: false,
      infoTipVisible: false,
      // translationsSelf: translations,
      controlForm: {
        processId: "",
        processName: "",
        simulation: true,
        labelEditing: false,
        labelVisible: false,
        prefix: "activiti",
        headerButtonSize: "mini",
        // additionalModel: []
        additionalModel: [CustomContentPadProvider, CustomPaletteProvider],
      },
      addis: {
        CustomContentPadProvider,
        CustomPaletteProvider,
      },
    };
  },
  methods: {
    initModeler(modeler) {
      setTimeout(() => {
        this.modeler = modeler;
        const canvas = modeler.get("canvas");
        const rootElement = canvas.getRootElement();
        Log.prettyPrimary("Process Id:", rootElement.id);
        Log.prettyPrimary("Process Name:", rootElement.businessObject.name);
      }, 10);
    },
    // reloadProcessDesigner(notDeep) {
    //   this.controlForm.additionalModel = [];
    //   for (let key in this.addis) {
    //     if (this.addis[key]) {
    //       this.controlForm.additionalModel.push(this.addis[key]);
    //     }
    //   }
    //   !notDeep && (this.xmlString = undefined);
    //   this.reloadIndex += 1;
    //   this.modeler = null; // 避免 panel 异常
    // },
    // changeLabelEditingStatus(status) {
    //   this.addis.labelEditing = status ? { labelEditingProvider: ["value", ""] } : false;
    //   this.reloadProcessDesigner();
    // },
    // changeLabelVisibleStatus(status) {
    //   this.addis.customRenderer = status ? CustomRenderer : false;
    //   this.reloadProcessDesigner();
    // },
    elementClick(element) {
      console.log(element);
      this.element = element;
    },
    // 保存
    async handleSave() {
      // console.log('tabkeys-2:', this.$refs.propertiesPanel.$refs.BaseInfo.tabkeys);
      let xml = await this.$refs.processDesigner.getPreviewProcessXML();
      let obj = {
        typeId: this.$refs.propertiesPanel.$refs.BaseInfo.tabkeys,
        xml: xml,
      };
      console.log("objData:", obj);
    },
  },
};
</script>

<style lang="scss">
body {
  overflow: hidden;
  margin: 0;
  box-sizing: border-box;
}
#app {
  display: flex !important;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: inline-grid;
  grid-template-columns: 100px auto max-content;
}
// 隐藏右下角bpmn Logo
.bjs-powered-by {
  display: none !important;
}
</style>
