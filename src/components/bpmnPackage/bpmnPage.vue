<template>
  <div class="bpmnPage-box">
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
      <a-layout-sider width="355">
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
import CustomContentPadProvider from './designer/plugins/content-pad'
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from './designer/plugins/palette'
import Log from './Log'
import PropertiesPanel from './panel/PropertiesPanel.vue'

export default {
  name: 'App',
  components: {
    PropertiesPanel,
  },
  props: {
    bpmnId: [String, Number],
  },
  data() {
    return {
      disableMixinCreated: true,

      xmlString: '',
      modeler: null,
      reloadIndex: 0,
      controlDrawerVisible: false,
      infoTipVisible: false,
      // translationsSelf: translations,
      controlForm: {
        processId: '',
        processName: '',
        simulation: true,
        labelEditing: false,
        labelVisible: false,
        prefix: 'activiti',
        headerButtonSize: 'mini',
        // additionalModel: []
        additionalModel: [CustomContentPadProvider, CustomPaletteProvider],
      },
      addis: {
        CustomContentPadProvider,
        CustomPaletteProvider,
      },
    }
  },
  mounted() {
    // if(this.bpmnId) this.getProcessXml() // 获取流程xml
  },
  methods: {
    initModeler(modeler) {
      setTimeout(() => {
        this.modeler = modeler
        const canvas = modeler.get('canvas')
        const rootElement = canvas.getRootElement()
        Log.prettyPrimary('Process Id:', rootElement.id)
        Log.prettyPrimary('Process Name:', rootElement.businessObject.name)
      }, 10)
    },
    reloadProcessDesigner(notDeep) {
      this.controlForm.additionalModel = []
      for (let key in this.addis) {
        if (this.addis[key]) {
          this.controlForm.additionalModel.push(this.addis[key])
        }
      }
      !notDeep && (this.xmlString = undefined)
      this.reloadIndex += 1
      this.modeler = null // 避免 panel 异常
    },
    // changeLabelEditingStatus(status) {
    //   this.addis.labelEditing = status ? { labelEditingProvider: ["value", ""] } : false;
    //   this.reloadProcessDesigner();
    // },
    // changeLabelVisibleStatus(status) {
    //   this.addis.customRenderer = status ? CustomRenderer : false;
    //   this.reloadProcessDesigner();
    // },
    elementClick(element) {
      console.log(element)
      this.element = element
    },
    // 保存
    async handleSave() {
      // console.log('bpmnElement-0:', this.$refs.propertiesPanel.bpmnElement.businessObject);
      // console.log('bpmnElement-0:', this.$refs.propertiesPanel.bpmnElement.businessObject.$parent);

      // console.log('tabkeys-2:', this.$refs.propertiesPanel.$refs.BaseInfo.tabkeys);
      let xml = await this.$refs.processDesigner.getPreviewProcessXML()

      let id = '';
      let name = '';
      if(this.$refs.propertiesPanel.bpmnElement.businessObject.$type === 'bpmn:Process'){
        id = this.$refs.propertiesPanel.bpmnElement.businessObject.id;
        name = this.$refs.propertiesPanel.bpmnElement.businessObject.name;
      }else {
        id = this.$refs.propertiesPanel.bpmnElement.businessObject.$parent.id;
        name = this.$refs.propertiesPanel.bpmnElement.businessObject.$parent.name;
      }
      let param = {
        // typeId: this.$refs.propertiesPanel.$refs.BaseInfo.tabkeys,
        processKey: id,
        processName: name,
        processXml: xml,
      }
      if(this.bpmnId) param.id = this.bpmnId
      console.log('param:', param);
    },

    // 获取流程xml
    // async getProcessXml() {
    //   const res = await postAction(`/act/processDesign/getProcessXml`, {id: this.bpmnId})
    //   const { success, message } = res
    //   if (success) {
    //     const { result } = res
    //     if (success) {
    //       this.$message.success(message)
    //       this.$refs.processDesigner.createNewDiagram(result);
    //     }
    //   } else {
    //     this.$message.error(message)
    //   }
    // },
  },
}
</script>

<style lang="scss" scoped>
.bpmnPage-box {
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
// 隐藏右下角bpmn Logo
::v-deep .bjs-powered-by {
  display: none !important;
}
::v-deep .ant-layout-sider-children {
  background: #fff !important;
}
</style>
